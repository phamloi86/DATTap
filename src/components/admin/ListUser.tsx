import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table, Button, Typography, Tag, Space, Popconfirm, message } from "antd";
import { Iuser } from "../../interfaces/user";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../auth/AuthContext";

const { Title } = Typography;
const ListUser = () => {
  const [users, setUsers] = useState<Iuser[]>([]);
  const { user: currentUser } = useAuth();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/users");
        setUsers(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    };
    fetchUsers();
  }, []);
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      message.success("Xoá người dùng thành công!");
    } catch {
      message.error("Lỗi khi xoá người dùng!");
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
      render: (_: any, record: Iuser) => {
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
          <Link to={`/admin/editusers/${record.id}`}>
            <Button type="primary">✏ Sửa</Button>
          </Link>
          {currentUser?.id !== record.id && (
            <Popconfirm
              title="Bạn có chắc muốn xoá người dùng này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <Button danger type="primary">🗑 Xoá</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Helmet>

        <title>Danh sách người dùng</title>
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
          Quản lý người dùng
        </Title>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <Link to="/admin/addusers">
            <Button type="link" style={{ fontSize: "16px", fontWeight: "bold" }}>
              ➕ Thêm người dùng
            </Button>
          </Link>
        </div>
        <Table dataSource={users.filter(u => u.id !== currentUser?.id)} columns={columns} rowKey="id" bordered />
      </div>
    </>
  );
};

export default ListUser;