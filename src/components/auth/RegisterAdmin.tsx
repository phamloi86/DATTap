// src/components/auth/RegisterAdmin.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useAuth } from "./AuthContext";

const { Title } = Typography;

const RegisterAdmin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const onFinish = async (values: {
    username: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const registerData = { ...values, role: "admin" };
      const { data } = await axios.post("http://localhost:3000/register", registerData);
      login(data);
      navigate("/admin");
      message.success("Đăng ký tài khoản admin thành công!");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      message.error("Đăng ký thất bại! Email có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={<Title level={3} style={{ textAlign: "center" }}>Đăng Ký Admin</Title>}
      style={{ maxWidth: 400, margin: "50px auto", borderRadius: "8px" }}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên tài khoản"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên tài khoản!" }]}
        >
          <Input placeholder="Nhập tên tài khoản" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^[0-9]{10,11}$/, message: "SĐT phải là số và có 10-11 chữ số" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng ký Admin
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <a href="/login">Đã có tài khoản? Đăng nhập ngay</a>
        </div>
      </Form>
    </Card>
  );
};

export default RegisterAdmin;