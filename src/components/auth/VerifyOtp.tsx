import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import { KeyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios, { AxiosError } from "axios";
import { useState } from "react";

const { Title, Text } = Typography;

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Cho phép nhập email nếu không có state truyền sang
  const [email] = useState(location.state?.email || "");

  const onFinish = async (values: { otp: string; email?: string }) => {
    const usedEmail = email || values.email;
    if (!usedEmail) {
      message.error("Vui lòng nhập email!");
      return;
    }
    try {
      await axios.post("http://localhost:3000/verify-otp", {
        email: usedEmail,
        otp: values.otp,
      });
      message.success("Xác minh OTP thành công!");
      navigate("/reset-password", { state: { email: usedEmail } });
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 400) {
        message.error("Mã OTP không đúng hoặc đã hết hạn!");
      } else {
        message.error("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #4a2c00 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          background: "#fffef7",
          padding: "20px",
        }}
        cover={
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              background: "rgba(255, 215, 0, 0.1)",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <Title
              level={2}
              style={{
                color: "#d4af37",
                margin: 0,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Xác Minh OTP
            </Title>
            <Text style={{ color: "#4a4a4a" }}>
              Nhập mã OTP đã gửi đến email
            </Text>
          </div>
        }
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ padding: "0 10px" }}
          initialValues={{ email }}
        >
          {!email && (
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                placeholder="Nhập email đã đăng ký"
                size="large"
                style={{
                  borderRadius: 8,
                  padding: "10px",
                  borderColor: "#d4af37",
                }}
              />
            </Form.Item>
          )}
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: "Vui lòng nhập mã OTP!" },
              { len: 6, message: "Mã OTP phải có 6 chữ số!" },
            ]}
          >
            <Input
              prefix={<KeyOutlined style={{ color: "#d4af37" }} />}
              placeholder="Nhập mã OTP 6 chữ số"
              size="large"
              maxLength={6}
              style={{
                borderRadius: 8,
                padding: "10px",
                borderColor: "#d4af37",
                textAlign: "center",
                fontSize: "18px",
                letterSpacing: "2px",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                borderRadius: 8,
                height: 48,
                background: "#d4af37",
                border: "none",
                fontWeight: 600,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e6c34c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#d4af37")
              }
            >
              Xác Minh OTP
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button type="link" onClick={() => navigate("/forgot")}
              style={{ color: "#d4af37", textDecoration: "none" }}>
              <Space>
                <ArrowLeftOutlined />
                Quay lại gửi OTP
              </Space>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default VerifyOtp;
