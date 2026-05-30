# ⚡ StreamVault — Premium Streaming Platform

A full-stack web app with tiered subscription plans, UPI payment flow (GPay/Paytm/PhonePe), and real email invoices.

---

## 🗂️ Project Structure

```
streamvault/
├── backend/          ← Node.js + Express API
│   ├── server.js     ← Main server (routes, auth, payment)
│   ├── db.js         ← JSON file-based database
│   ├── emailService.js ← Nodemailer email templates
│   ├── database.json ← Auto-created on first run (users + transactions)
│   └── .env          ← YOUR credentials go here (create from .env.example)
│
├── frontend/         ← React + Vite app
│   └── src/
│       ├── pages/    ← Home, Login, Register, Dashboard, Upgrade
│       ├── components/ ← Navbar
│       └── context/  ← AuthContext (JWT auth state)
│
└── start.sh          ← Runs both servers
```

---

## 🚀 Setup Instructions

### Step 1 — Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2 — Configure Email (REQUIRED for real emails)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_app_password_here
JWT_SECRET=any_random_secret_string
```

#### How to get a Gmail App Password:
1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (required)
3. Go to **App passwords** → https://myaccount.google.com/apppasswords
4. Select "Mail" + "Other (Custom name)" → type "StreamVault" → Generate
5. Copy the 16-character password → paste as `EMAIL_PASS`

> This is the **only way** to send real emails from a Gmail account via SMTP.

### Step 3 — Run

```bash
# Option A: Use the start script
chmod +x start.sh
./start.sh

# Option B: Run manually in two terminals
# Terminal 1:
cd backend && node server.js

# Terminal 2:
cd frontend && npm run dev
```

### Step 4 — Open the App

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 📋 Features

| Feature | Details |
|---------|---------|
| User Registration | Name, email, password — hashed with bcrypt |
| JWT Auth | Tokens stored in localStorage, 7-day expiry |
| Welcome Email | Sent automatically on registration |
| Plan Selection | Bronze (₹10), Silver (₹50), Gold (₹100) |
| UPI Payment | GPay / Paytm / PhonePe UPI IDs shown |
| UTR Verification | User enters UTR after paying — stored in DB |
| Invoice Email | Full HTML invoice sent on successful payment |
| Video Player | Simulated player with per-plan time limits |
| Transaction History | All payments shown in dashboard |
| Database | JSON file (`backend/database.json`) — zero setup |

---

## 💰 Plan Details

| Plan  | Price | Watch Limit | Color  |
|-------|-------|-------------|--------|
| Free  | ₹0    | 5 minutes   | Gray   |
| Bronze| ₹10   | 7 minutes   | Bronze |
| Silver| ₹50   | 10 minutes  | Silver |
| Gold  | ₹100  | Unlimited   | Gold   |

---

## 🔌 API Endpoints

```
POST /api/auth/register     → Register user (sends welcome email)
POST /api/auth/login        → Login, get JWT
GET  /api/auth/me           → Get current user (auth required)

POST /api/payment/initiate  → Get UPI ID for chosen plan+method
POST /api/payment/verify    → Submit UTR, upgrade plan, send invoice
GET  /api/payment/history   → Get user's transactions

GET  /api/plans             → Get all plan details
```

---

## 📧 Email Flow

1. **Registration** → Welcome email sent to new user
2. **Payment verified** → Invoice email with:
   - Invoice ID
   - Plan details + watch limit
   - Amount paid
   - UTR / Reference number
   - Payment method
   - Date & time (IST)

---

## 🛡️ Security Notes

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT tokens for all authenticated routes
- UTR numbers checked for duplicates (can't reuse a UTR)
- CORS enabled for frontend origin

---

## 🔧 Production Deployment

For production:
1. Replace JSON database with PostgreSQL/MySQL
2. Use environment variable for `VITE_API_URL` in frontend
3. Build frontend: `cd frontend && npm run build` → serve `dist/`
4. Run backend with PM2: `pm2 start backend/server.js`
5. Set up SSL/HTTPS

---

Made with ⚡ by StreamVault
