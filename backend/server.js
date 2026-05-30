require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const { sendWelcomeEmail, sendInvoiceEmail, PLAN_DETAILS } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'streamvault_super_secret_2024';

app.use(cors());
app.use(express.json());

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── AUTH ROUTES ───────────────────────────────────────────────────────────

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = db.findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = db.createUser({
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      plan: 'free',
      createdAt: new Date().toISOString(),
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user).catch(err => console.error('Welcome email error:', err));

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = db.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.findUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, plan: user.plan });
});

// ─── PAYMENT ROUTES ────────────────────────────────────────────────────────

// Initiate payment (get QR/details for chosen plan)
app.post('/api/payment/initiate', authMiddleware, (req, res) => {
  const { plan, paymentMethod } = req.body;
  if (!['bronze', 'silver', 'gold'].includes(plan))
    return res.status(400).json({ error: 'Invalid plan' });
  if (!['gpay', 'paytm', 'phonepe'].includes(paymentMethod))
    return res.status(400).json({ error: 'Invalid payment method' });

  const planInfo = PLAN_DETAILS[plan];
  const upiIds = {
    gpay: 'streamvault@okaxis',
    paytm: 'streamvault@paytm',
    phonepe: 'streamvault@ybl',
  };

  res.json({
    amount: planInfo.price,
    plan: plan,
    planName: planInfo.name,
    paymentMethod,
    upiId: upiIds[paymentMethod],
    merchantName: 'StreamVault',
    instructions: `Pay ₹${planInfo.price} to complete your ${planInfo.name} plan upgrade`,
  });
});

// Verify payment via UTR
app.post('/api/payment/verify', authMiddleware, async (req, res) => {
  try {
    const { utr, plan, paymentMethod } = req.body;
    if (!utr || utr.trim().length < 6)
      return res.status(400).json({ error: 'Please enter a valid UTR number' });
    if (!['bronze', 'silver', 'gold'].includes(plan))
      return res.status(400).json({ error: 'Invalid plan' });

    // Check for duplicate UTR
    const existing = db.findTransactionByUTR(utr.trim());
    if (existing) return res.status(409).json({ error: 'This UTR has already been used' });

    const user = db.findUserById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const planInfo = PLAN_DETAILS[plan];

    // Create transaction record
    const transaction = db.createTransaction({
      id: uuidv4(),
      userId: req.userId,
      plan,
      amount: planInfo.price,
      paymentMethod,
      utr: utr.trim(),
      status: 'success',
      createdAt: new Date().toISOString(),
    });

    // Upgrade user plan
    const updatedUser = db.updateUser(req.userId, { plan });

    // Send invoice email
    sendInvoiceEmail(updatedUser, transaction).catch(err =>
      console.error('Invoice email error:', err)
    );

    res.json({
      success: true,
      message: `Payment verified! You are now on the ${planInfo.name} plan.`,
      transaction: {
        id: transaction.id,
        plan,
        planName: planInfo.name,
        amount: planInfo.price,
        utr: transaction.utr,
        createdAt: transaction.createdAt,
      },
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, plan: updatedUser.plan },
    });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Server error during verification' });
  }
});

// Get user transactions
app.get('/api/payment/history', authMiddleware, (req, res) => {
  const transactions = db.getUserTransactions(req.userId);
  res.json(transactions.reverse());
});

// Plans info
app.get('/api/plans', (req, res) => {
  res.json(PLAN_DETAILS);
});

app.listen(PORT, () => {
  console.log(`✅ StreamVault backend running on port ${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER || 'NOT SET — add to .env'}`);
});
