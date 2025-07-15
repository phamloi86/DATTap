import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Typography, message, Modal, Input, Radio } from "antd";
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
  const [cancelModal, setCancelModal] = useState<{ visible: boolean; orderId: number | null }>({ visible: false, orderId: null });
  const [cancelReasons, setCancelReasons] = useState([
    "Tôi muốn thay đổi địa chỉ nhận hàng",
    "Tôi muốn thay đổi sản phẩm",
    "Thời gian giao hàng quá lâu",
    "Đặt nhầm đơn",
    "Khác",
  ]);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState("");

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

  const showCancelModal = (orderId: number) => {
    setCancelModal({ visible: true, orderId });
    setSelectedReason("");
    setCustomReason("");
  };

  const handleCancelOrder = async () => {
    if (!cancelModal.orderId) return;
    let reason = selectedReason;
    if (!reason) {
      message.error("Vui lòng chọn lý do hủy đơn hàng!");
      return;
    }
    if (reason === "Khác") {
      if (!customReason.trim()) {
        message.error("Vui lòng nhập lý do hủy đơn hàng!");
        return;
      }
      reason = customReason;
    }
    try {
      await fetch(`http://localhost:3000/orders/${cancelModal.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: 7, cancelReason: reason }),
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === cancelModal.orderId ? { ...order, orderStatus: 7, cancelReason: reason } : order
        )
      );
      setCancelModal({ visible: false, orderId: null });
      setSelectedReason("");
      setCustomReason("");
      message.success("Đã hủy đơn hàng thành công!");
    } catch {
      message.error("Hủy đơn hàng thất bại!");
    }
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
            <Button type="link" danger onClick={() => showCancelModal(record.id)}>
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
      <Modal
        title="Lý do hủy đơn hàng"
        visible={cancelModal.visible}
        onOk={handleCancelOrder}
        onCancel={() => setCancelModal({ visible: false, orderId: null })}
        okText="Xác nhận hủy"
        cancelText="Đóng"
      >
        <Radio.Group
          onChange={e => setSelectedReason(e.target.value)}
          value={selectedReason}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {cancelReasons.map((reason) => (
            <Radio key={reason} value={reason}>{reason}</Radio>
          ))}
        </Radio.Group>
        {selectedReason === "Khác" && (
          <Input.TextArea
            rows={4}
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
            placeholder="Vui lòng nhập lý do hủy đơn hàng..."
            style={{ marginTop: 12 }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Order;