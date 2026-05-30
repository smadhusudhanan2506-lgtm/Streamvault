const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'onboarding@resend.dev';

const PLAN_DETAILS = {
  free:   { name: 'Free',   price: 0,   limit: '5 minutes',  color: '#888888' },
  bronze: { name: 'Bronze', price: 10,  limit: '7 minutes',  color: '#CD7F32' },
  silver: { name: 'Silver', price: 50,  limit: '10 minutes', color: '#C0C0C0' },
  gold:   { name: 'Gold',   price: 100, limit: 'Unlimited',  color: '#FFD700' },
};

async function sendWelcomeEmail(user) {
  const result = await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: '🎉 Welcome to StreamVault!',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:20px;background:#0a0a0a;font-family:'Segoe UI',sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#1a1400,#2d2000);border:1px solid #FFD700;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#FFD700,#B8860B);padding:40px;text-align:center;">
            <h1 style="margin:0;color:#0a0a0a;font-size:32px;letter-spacing:3px;">⚡ STREAMVAULT</h1>
            <p style="margin:8px 0 0;color:#3d2f00;font-size:14px;letter-spacing:2px;">PREMIUM STREAMING PLATFORM</p>
          </div>
          <div style="padding:40px;">
            <h2 style="color:#FFD700;margin-top:0;">Welcome, ${user.name}! 👋</h2>
            <p style="color:#d4af37;line-height:1.6;">Your StreamVault account has been created successfully. You are currently on the <strong style="color:#FFD700;">Free Plan</strong> which gives you 5 minutes of video watching time.</p>
            <div style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);border-radius:12px;padding:20px;margin:24px 0;">
              <p style="color:#FFD700;margin:0 0 10px;font-weight:bold;">📧 Your Account Details</p>
              <p style="color:#ccc;margin:6px 0;">👤 Name: <strong>${user.name}</strong></p>
              <p style="color:#ccc;margin:6px 0;">📩 Email: <strong>${user.email}</strong></p>
              <p style="color:#ccc;margin:6px 0;">🎬 Plan: <strong>Free (5 min limit)</strong></p>
            </div>
            <div style="text-align:center;margin-top:28px;">
              <p style="color:#d4af37;">Upgrade to Gold for unlimited streaming! 🚀</p>
            </div>
          </div>
          <div style="background:rgba(0,0,0,0.4);padding:20px;text-align:center;border-top:1px solid rgba(255,215,0,0.2);">
            <p style="color:#666;font-size:12px;margin:0;">© 2024 StreamVault. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
  console.log('Welcome email sent to', user.email, '| ID:', result?.data?.id);
  return result;
}

async function sendInvoiceEmail(user, transaction) {
  const plan = PLAN_DETAILS[transaction.plan];
  const date = new Date(transaction.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const invoiceId = `INV-${transaction.id.toUpperCase().slice(0, 8)}`;

  const result = await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `✅ Payment Confirmed — StreamVault ${plan.name} Plan | ${invoiceId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:20px;background:#0a0a0a;font-family:'Segoe UI',sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#1a1400,#2d2000);border:1px solid #FFD700;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <div style="background:linear-gradient(135deg,#FFD700,#B8860B);padding:40px;text-align:center;">
            <h1 style="margin:0;color:#0a0a0a;font-size:32px;letter-spacing:3px;">⚡ STREAMVAULT</h1>
            <p style="margin:8px 0 0;color:#3d2f00;font-size:14px;letter-spacing:2px;">PAYMENT INVOICE</p>
          </div>

          <!-- Success -->
          <div style="text-align:center;padding:36px 40px 0;">
            <div style="font-size:64px;margin-bottom:16px;">✅</div>
            <h2 style="color:#FFD700;margin:0;font-size:26px;">Payment Successful!</h2>
            <p style="color:#aaa;margin:10px 0 0;">Your plan has been upgraded successfully</p>
          </div>

          <!-- Invoice Table -->
          <div style="padding:30px 40px;">
            <div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.25);border-radius:12px;overflow:hidden;">
              <div style="background:rgba(255,215,0,0.15);padding:14px 20px;border-bottom:1px solid rgba(255,215,0,0.2);">
                <p style="margin:0;color:#FFD700;font-weight:bold;font-size:15px;">📄 INVOICE — ${invoiceId}</p>
              </div>
              <table style="width:100%;border-collapse:collapse;">
                <tr style="border-bottom:1px solid rgba(255,215,0,0.1);">
                  <td style="padding:14px 20px;color:#aaa;font-size:14px;">Customer Name</td>
                  <td style="padding:14px 20px;color:#fff;font-size:14px;text-align:right;font-weight:600;">${user.name}</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,215,0,0.1);">
                  <td style="padding:14px 20px;color:#aaa;font-size:14px;">Email Address</td>
                  <td style="padding:14px 20px;color:#fff;font-size:14px;text-align:right;">${user.email}</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,215,0,0.1);">
                  <td style="padding:14px 20px;color:#aaa;font-size:14px;">Plan Upgraded To</td>
                  <td style="padding:14px 20px;text-align:right;">
                    <span style="background:${plan.color};color:#000;padding:4px 14px;border-radius:20px;font-weight:800;font-size:13px;letter-spacing:1px;">${plan.name.toUpperCase()}</span>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,215,0,0.1);">
                  <td style="padding:14px 20px;color:#aaa;font-size:14px;">Video Watch Limit</td>
                  <td style="padding:14px 20px;color:#FFD700;font-size:14px;text-align:right;font-weight:700;">${plan.limit}</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,215,0,0.1);">
                  <td style="padding:14px 20px;color:#aaa;font-size:14px;">Payment Method</td>
                  <td style="padding:14px 20px;color:#fff;font-size:14px;text-align:right;text-transform:uppercase;">${transaction.paymentMethod}</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,215,0,0.1);">
                  <td style="padding:14px 20px;color:#aaa;font-size:14px;">UTR / Reference No.</td>
                  <td style="padding:14px 20px;color:#fff;font-size:14px;text-align:right;font-family:monospace;letter-spacing:1px;">${transaction.utr}</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,215,0,0.1);">
                  <td style="padding:14px 20px;color:#aaa;font-size:14px;">Transaction Date</td>
                  <td style="padding:14px 20px;color:#fff;font-size:14px;text-align:right;">${date} IST</td>
                </tr>
                <tr style="background:rgba(255,215,0,0.05);">
                  <td style="padding:18px 20px;color:#FFD700;font-size:17px;font-weight:700;">Total Amount Paid</td>
                  <td style="padding:18px 20px;color:#FFD700;font-size:24px;font-weight:800;text-align:right;">₹${plan.price}.00</td>
                </tr>
              </table>
            </div>

            <!-- Benefits -->
            <div style="background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(184,134,11,0.06));border:1px solid rgba(255,215,0,0.25);border-radius:12px;padding:22px;margin-top:24px;">
              <p style="color:#FFD700;margin:0 0 12px;font-weight:700;font-size:15px;">🎬 Your ${plan.name} Plan Benefits</p>
              <p style="color:#d4af37;margin:0;line-height:2;">
                ✓ Watch videos for <strong style="color:#FFD700;">${plan.limit}</strong><br>
                ✓ HD streaming quality<br>
                ✓ Access to full content library<br>
                ✓ Priority customer support
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:rgba(0,0,0,0.4);padding:24px 40px;text-align:center;border-top:1px solid rgba(255,215,0,0.2);">
            <p style="color:#888;font-size:12px;margin:0 0 6px;">This is an automated invoice. Please keep it for your records.</p>
            <p style="color:#555;font-size:12px;margin:0;">© 2024 StreamVault. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
  console.log('Invoice email sent to', user.email, '| ID:', result?.data?.id);
  return result;
}

module.exports = { sendWelcomeEmail, sendInvoiceEmail, PLAN_DETAILS };
