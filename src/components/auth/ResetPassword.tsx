import { useLocation, useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, message, Card, Typography, Space } from "antd";
import { LockOutlined, ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";
const { Title, Text } = Typography;

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.email) {
    navigate("/forgot");
    return null;
  }

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    try {
      // 1. Tìm user theo email
      const { data: users } = await axios.get(`http://localhost:3000/users?email=${state.email}`);
      const user = users[0];
      if (!user) {
        message.error("Email không tồn tại!");
        return;
      }
      // 2. Xóa user cũ
      await axios.delete(`http://localhost:3000/users/${user.id}`);
      // 3. Đăng ký lại với password mới và các thông tin cũ
      await axios.post("http://localhost:3000/register", {
        email: state.email,
        password: values.password,
        username: user.username,
        phone: user.phone,
        address: user.address,
        role: user.role || "client"
      });
      message.success("Đặt lại mật khẩu thành công! Hãy đăng nhập lại.");
      navigate("/login");
    } catch {
      message.error("Lỗi khi đặt lại mật khẩu. Vui lòng thử lại!");
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
              Đặt Lại Mật Khẩu
            </Title>
            <Text style={{ color: "#4a4a4a" }}>
              Nhập mật khẩu mới cho tài khoản
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
            name="password"

          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#d4af37" }} />}
              placeholder="Mật khẩu mới"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{
                borderRadius: 8,
                padding: "10px",
                borderColor: "#d4af37",
              }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#d4af37" }} />}
              placeholder="Xác nhận mật khẩu mới"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
              Đặt Lại Mật Khẩu
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

export default ResetPassword;
