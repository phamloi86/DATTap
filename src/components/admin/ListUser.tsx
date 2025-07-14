import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table, Button, Typography, Tag, Space } from "antd";
import { Iuser } from "../../interfaces/user";
import { Helmet } from "react-helmet-async";

const { Title } = Typography;   

const ListUser = () => {
  const [users, setUsers] = useState<Iuser[]>([]);

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
      render: (_: any, record: Iuser) => (
        <Space>
          <Link to={`/admin/editusers/${record.id}`}>
            <Button type="primary">✏ Sửa</Button>
          </Link>
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
      <Table dataSource={users} columns={columns} rowKey="id" bordered />
    </div>
    </>
  );
};

export default ListUser;