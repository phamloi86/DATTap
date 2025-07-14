// src/components/admin/HeaderAdmin.tsx
import React, { useState } from "react";
import { Layout, Input, Typography, Avatar, Row, Col, Button } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useAuth } from "../../components/auth/AuthContext";

const { Header } = Layout;
const { Text } = Typography;

const HeaderAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth(); // Lấy user và logout từ AuthContext

  return (
    <Header style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", padding: "0 24px" }}>
      <Row justify="space-between" align="middle">
        {/* Logo */}
        <Col>
          <Text strong style={{ fontSize: "18px" }}>{user?.username || "Admin"}</Text>
        </Col>

        {/* Ô tìm kiếm */}
        <Col>
          <Input
            prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 350 }}
          />
        </Col>

        {/* Chào Admin + Avatar + Nút Đăng xuất */}
        <Col style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Text>Welcome {user?.username || "Admin"}!</Text>
          <Avatar size="large" icon={<UserOutlined />} />
          <Button type="primary" onClick={logout}>
            Đăng xuất
          </Button>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderAdmin;