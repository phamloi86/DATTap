const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const emailConfig = require('./email-config.cjs');
const fetch = require('node-fetch'); // npm install node-fetch@2

// Lưu trữ OTP tạm thời (nên dùng Redis nếu production)
const otpStorage = new Map();

const transporter = nodemailer.createTransport(emailConfig.email);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: emailConfig.email.auth.user,
    to: email,
    subject: emailConfig.templates.subject,
    html: emailConfig.templates.html(otp)
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    return false;
  }
}

module.exports = async (req, res, next) => {
  if (req.method === 'POST' && req.path === '/forgot-password') {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email là bắt buộc' });

    const users = await fetch('http://localhost:3000/users').then(r => r.json());
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Email không tồn tại' });

    const otp = generateOTP();
    const otpData = {
      otp,
      email,
      createdAt: Date.now(),
      expiresAt: Date.now() + emailConfig.otp.expiry
    };
    otpStorage.set(email, otpData);

    sendOTPEmail(email, otp).then(success => {
      if (success) res.json({ message: 'OTP đã được gửi đến email của bạn' });
      else res.status(500).json({ error: 'Không thể gửi OTP' });
    });
    return;
  }

  if (req.method === 'POST' && req.path === '/verify-otp') {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email và OTP là bắt buộc' });

    const otpData = otpStorage.get(email);
    if (!otpData) return res.status(400).json({ error: 'OTP không tồn tại hoặc đã hết hạn' });
    if (otpData.otp !== otp) return res.status(400).json({ error: 'OTP không đúng' });
    if (Date.now() > otpData.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ error: 'OTP đã hết hạn' });
    }
    otpStorage.delete(email);
    res.json({ message: 'OTP hợp lệ' });
    return;
  }

  if (req.method === 'POST' && req.path === '/reset-password') {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: 'Email và mật khẩu mới là bắt buộc' });

    const users = await fetch('http://localhost:3000/users').then(r => r.json());
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Email không tồn tại' });

    bcrypt.hash(newPassword, 10).then(async (hashedPassword) => {
      console.log("Hash mới:", hashedPassword, "cho email:", email, "mật khẩu gốc:", newPassword);
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: hashedPassword })
      });
      res.json({ message: 'Mật khẩu đã được đặt lại thành công' });
    }).catch(error => {
      console.error('Lỗi mã hóa mật khẩu:', error);
      res.status(500).json({ error: 'Lỗi khi đặt lại mật khẩu' });
    });
    return;
  }

  
  

  next();
}; 