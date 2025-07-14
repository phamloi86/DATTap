module.exports = {
  email: {
    service: 'gmail',
    auth: {
      user: 'tuyetmatthienthu@gmail.com', // Thay bằng email của bạn
      pass: 'benabldxavhvgxyr'     // Thay bằng app password của Gmail
    }
  },
  otp: {
    length: 6,
    expiry: 5 * 60 * 1000, // 5 phút
  },
  templates: {
    subject: 'Mã OTP đặt lại mật khẩu - GoldWorld',
    html: (otp) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; margin: 0; font-size: 28px;">GoldWorld</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Đặt lại mật khẩu</p>
          </div>
          <div style="margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Xin chào!<br>
              Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản GoldWorld của mình.
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Mã OTP của bạn:</p>
            <div style="font-size: 32px; font-weight: bold; color: #d4af37; letter-spacing: 4px; font-family: monospace;">
              ${otp}
            </div>
          </div>
          <div style="margin-bottom: 30px;">
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              <strong>Lưu ý:</strong><br>
              • Mã này có hiệu lực trong 5 phút<br>
              • Không chia sẻ mã này với bất kỳ ai<br>
              • Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này
            </p>
          </div>
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Trân trọng,<br>
              <strong>GoldWorld Team</strong>
            </p>
          </div>
        </div>
      </div>
    `
  }
}; 