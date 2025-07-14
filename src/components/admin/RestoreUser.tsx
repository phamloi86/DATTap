import { useEffect, useState } from "react";
import { Table, Button, Typography, Tag, Space, Popconfirm, message } from "antd";
import { Iuser } from "../../interfaces/user";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";

const { Title } = Typography;
const RestoreUser = () => {
    const [users, setUsers] = useState<Iuser[]>([]);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/users");
                setUsers(data);
            } catch (error) {
                message.error("Lỗi khi lấy danh sách người dùng đã xoá!");
            }
        };
        fetchUsers();
    }, []);

    const handleRestore = async (id: number) => {
        try {
            await axios.patch(`http://localhost:3000/users/${id}`, { isDeleted: false });
            setUsers((prev) => prev.map((user) => user.id === id ? { ...user, isDeleted: false } : user));
            message.success("Khôi phục người dùng thành công!");
        } catch {
            message.error("Lỗi khi khôi phục người dùng!");
        }
    };

    const columns = [
        { title: "Tên tài khoản", dataIndex: "username", key: "username" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "SĐT", dataIndex: "phone", key: "phone" },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            render: (role: string) => (
                <Tag color={role === "admin" ? "red" : "green"}>{role}</Tag>
            ),
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (_: unknown, record: Iuser) => {
                if (record.isLocked && record.lockUntil) {
                    const lockDate = new Date(record.lockUntil);
                    const now = new Date();
                    if (lockDate > now) {
                        return (
                            <Tag color="red">
                                Khóa đến {lockDate.toLocaleDateString("vi-VN")}
                            </Tag>
                        );
                    }
                }
                return <Tag color="green">Hoạt động</Tag>;
            },
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_: unknown, record: Iuser) => (
                <Space>
                    <Popconfirm
                        title="Bạn có chắc muốn khôi phục người dùng này?"
                        onConfirm={() => handleRestore(record.id)}
                        okText="Khôi phục"
                        cancelText="Huỷ"
                    >
                        <Button type="primary">♻ Khôi phục</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Helmet>
                <title>Khôi phục người dùng</title>
            </Helmet>
            <div
                style={{
                    maxWidth: "1000px",
                    margin: "auto",
                    padding: "24px",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    marginTop: "24px",
                }}
            >
                <Title level={2} style={{ textAlign: "center" }}>
                    Khôi phục người dùng
                </Title>
                <Table
                    dataSource={users.filter(u => u.isDeleted === true && u.id !== currentUser?.id)}
                    columns={columns}
                    rowKey="id"
                    bordered
                />
            </div>
        </>
    );
};

export default RestoreUser; 