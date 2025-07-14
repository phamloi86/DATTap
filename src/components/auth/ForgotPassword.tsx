// src/components/auth/ForgotPassword.tsx
import { useState } from "react";
import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/forgot-password", {
        email: values.email,
      });
      message.success("Đã gửi mã OTP đến email của bạn!");
      navigate("/verify-otp", { state: { email: values.email } });
    } catch (error: any) {
      if (error.response?.status === 404) {
        message.error("Email không tồn tại trong hệ thống!");
      } else {
        message.error("Không thể gửi OTP. Vui lòng thử lại sau!");
      }
    } finally {
      setLoading(false);
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
              Quên Mật Khẩu
            </Title>
            <Text style={{ color: "#4a4a4a" }}>
              Nhập email để nhận mã OTP
            </Text>
          </div>
        }
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ padding: "0 10px" }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#d4af37" }} />}
              placeholder="Nhập email đã đăng ký"
              size="large"
              style={{
                borderRadius: 8,
                padding: "10px",
                borderColor: "#d4af37",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
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
              Gửi Mã OTP
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/login" style={{ color: "#d4af37", textDecoration: "none" }}>
              <Space>
                <ArrowLeftOutlined />
                Quay lại đăng nhập
              </Space>
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
