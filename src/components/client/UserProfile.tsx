import { useAuth } from "../auth/AuthContext";
import { Card, Typography, Button, Avatar, Menu, Form, Input, Row, Col } from "antd";
import { UserOutlined, HomeOutlined, LogoutOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Title } = Typography;

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);

    if (!user) {
        return <div style={{ padding: 20 }}><Title level={2}>Bạn cần đăng nhập để xem thông tin tài khoản!</Title></div>;
    }

    // Menu items
    const menuItems = [
        {
            key: "profile",
            icon: <UserOutlined style={{ fontSize: 20 }} />,
            label: <span style={{ fontWeight: 500 }}>Thông tin tài khoản</span>,
            onClick: () => { },
        },
        {
            key: "address",
            icon: <HomeOutlined style={{ fontSize: 20 }} />,
            label: <span style={{ fontWeight: 500, color: '#aaa' }}>Thông tin địa chỉ</span>,
            disabled: true,
        },
        {
            key: "logout",
            icon: <LogoutOutlined style={{ fontSize: 20 }} />,
            label: <span style={{ fontWeight: 500, color: '#d4380d' }}>Đăng xuất</span>,
            onClick: logout,
        },
    ];

    return (
        <div
            style={{
               
                
                background: "#f7f9fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
            }}
        >
            <Card
                bordered={false}
                style={{
                    width: "100%",
                    maxWidth: 2450,
                    borderRadius: 28,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                    padding: 0,
                    background: "#fff",
                }}
            >
                <Row gutter={0} style={{ minHeight: 480 }}>
                    {/* Sidebar */}
                    <Col xs={24} md={8} style={{
                        background: "#f4f6fa",
                        borderTopLeftRadius: 28,
                        borderBottomLeftRadius: 28,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "40px 0 0 0"
                    }}>
                        <Avatar size={110} icon={<UserOutlined />} style={{ background: "#D4AF37", color: "#333", marginBottom: 18, boxShadow: "0 2px 12px #d4af3740" }} />
                        <Title level={4} style={{ margin: 0 }}>{user.username}</Title>
                        <Menu
                            mode="vertical"
                            selectable={false}
                            style={{ border: "none", background: "transparent", marginTop: 32, width: "100%" }}
                            items={menuItems}
                            onClick={({ key }) => {
                                const item = menuItems.find(i => i.key === key);
                                if (item && item.onClick) item.onClick();
                            }}
                        />
                    </Col>
                    {/* Main content */}
                    <Col xs={24} md={16} style={{ padding: "48px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Title level={3} style={{ marginBottom: 32 }}>Thông tin tài khoản</Title>
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                email: user.email,
                                phone: user.phone,
                                address: user.address,
                                username: user.username,
                            }}
                            style={{ maxWidth: 400 }}
                            disabled={!editMode}
                        >
                            <Form.Item label="Tên tài khoản" name="username">
                                <Input prefix={<UserOutlined />} placeholder="Tên tài khoản" />
                            </Form.Item>
                            <Form.Item label="Email" name="email">
                                <Input prefix={<UserOutlined />} placeholder="Email" type="email" />
                            </Form.Item>
                            <Form.Item label="Số điện thoại" name="phone">
                                <Input prefix={<UserOutlined />} placeholder="Số điện thoại" />
                            </Form.Item>
                            <Form.Item label="Địa chỉ" name="address">
                                <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" />
                            </Form.Item>
                            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                                {!editMode && (
                                    <Button icon={<EditOutlined />} type="primary" onClick={() => setEditMode(true)}>
                                        Chỉnh sửa
                                    </Button>
                                )}
                                {editMode && (
                                    <Button type="primary" htmlType="submit" style={{ background: "#52c41a", border: "none" }}>
                                        Lưu thay đổi
                                    </Button>
                                )}
                                <Button icon={<LockOutlined />} onClick={() => navigate("/reset-password")}>Đổi mật khẩu</Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default UserProfile; 