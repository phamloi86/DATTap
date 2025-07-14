import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const { Title } = Typography;

type OrderStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const statusMap: Record<OrderStatus, string> = {
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
const Order: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/orders");
        const data = await res.json();
        setOrders(data);
      } catch {
        setOrders([]);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return <div style={{ padding: 20 }}><Title level={2}>Bạn cần đăng nhập để xem đơn hàng!</Title></div>;
  }
  const myOrders = orders.filter(order => order.userId === user.id);
  console.log("Danh sách đơn hàng trong Order.tsx:", myOrders);

  const handleCancelOrder = (orderId: number) => {
    // Có thể gọi API PATCH để cập nhật trạng thái nếu muốn
  };

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "orderCode", key: "orderCode" },
    { title: "Ngày đặt", dataIndex: "orderDate", key: "orderDate" },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: number) => (method === 2 ? "Thanh toán khi nhận hàng" : "Thanh toán online"),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: number) => {
        const orderStatus = status as OrderStatus;
        return <Tag color={colorMap[orderStatus]}>{statusMap[orderStatus]}</Tag>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (total: number) => total.toLocaleString() + " VND",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          {record.orderStatus < 3 && (
            <Button type="link" danger onClick={() => handleCancelOrder(record.id)}>
              Hủy đơn hàng
            </Button>
          )}
          <Link to={`/order-detail/${record.id}`}>
            <Button type="link">Xem chi tiết</Button>
          </Link>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Đơn hàng của tôi</Title>
      <Table columns={columns} dataSource={myOrders} rowKey="id" pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default Order;