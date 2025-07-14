import React, { useEffect, useState } from "react";
import { Card, Table, Button, Space, Tag, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";
import { useOrders } from "../client/OrderContext";

// Định nghĩa type cho các key
type PaymentMethod = 1 | 2 | 3;
type PaymentStatus = 1 | 2;
type OrderStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Khai báo các map với type rõ ràng
const paymentMethodMap: Record<PaymentMethod, string> = {
  1: "Chuyển khoản",
  2: "Thanh toán khi nhận hàng",
  3: "Thẻ tín dụng",
};

const paymentStatusMap: Record<PaymentStatus, string> = {
  1: "Chưa thanh toán",
  2: "Đã thanh toán",
};

const orderStatusMap: Record<OrderStatus, string> = {
  1: "Chưa xác nhận",
  2: "Đã xác nhận",
  3: "Đang giao",
  4: "Đã giao",
  5: "Giao thành công",
  6: "Hoàn thành đơn hàng",
  7: "Đã hủy",
};

const colorMap: Record<OrderStatus, string> = {
  1: "default",
  2: "processing",
  3: "blue",
  4: "green",
  5: "success",
  6: "error",
  7: "red",
};

const getStatusTag = (status: number) => {
  const orderStatus = status as OrderStatus; // Ép kiểu vì chúng ta biết status chỉ có thể là 1-7
  return <Tag color={colorMap[orderStatus]}>{orderStatusMap[orderStatus]}</Tag>;
};

const OrderAdmin: React.FC = () => {
  const { orders } = useOrders();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Lỗi khi lấy danh sách người dùng:", err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/orders/${id}`, { method: "DELETE" });
      // Assuming useOrders context will update the orders state
      // If not, you might need to refetch or update the state directly here
      // For now, we'll rely on the context to trigger a re-render
      // setOrders((prev) => prev.filter((order) => order.id !== id)); // This line is removed as per the new_code
      message.success("Xoá đơn hàng thành công!");
    } catch {
      message.error("Lỗi khi xoá đơn hàng!");
    }
  };

  const columns = [
    { title: "STT", dataIndex: "id", key: "id" },
    { title: "Mã đơn hàng", dataIndex: "orderCode", key: "orderCode" },
    { title: "Ngày đặt", dataIndex: "orderDate", key: "orderDate" },
    {
      title: "Người đặt",
      dataIndex: "userId",
      key: "userId",
      render: (userId: number) => users.find((u) => u.id === userId)?.username || "Không xác định",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: number) => {
        const paymentMethod = method as PaymentMethod; // Ép kiểu
        return paymentMethodMap[paymentMethod];
      },
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: number) => {
        const paymentStatus = status as PaymentStatus; // Ép kiểu
        return paymentStatusMap[paymentStatus];
      },
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: getStatusTag,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: any) => (
        <Space>
          <Link to={`/admin/updateorder/${record.id}`}>
            <Button type="primary">✏ Chỉnh sửa</Button>
          </Link>
          <Link to={`/admin/detailorder/${record.id}`}>
            <Button style={{ backgroundColor: "#50c878", borderColor: "#50c878" }} type="default">
              Chi tiết
            </Button>
          </Link>
          <Popconfirm
            title="Bạn có chắc muốn xoá đơn hàng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger type="primary">🗑 Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>Quản lý đơn hàng</h1>
      <Card>
        <Table columns={columns} dataSource={orders} rowKey="id" pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
};

export default OrderAdmin;