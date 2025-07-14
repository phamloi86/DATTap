import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Table, Typography, Spin, Button, Image } from "antd";
import { useOrders } from "./OrderContext";

const { Title, Text } = Typography;

type PaymentMethod = 1 | 2 | 3;
type OrderStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const paymentMethodMap: Record<PaymentMethod, string> = {
  1: "Chuyển khoản",
  2: "Thanh toán khi nhận hàng",
  3: "Thẻ tín dụng",
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
const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundOrder = orders.find((o) => o.id === Number(id));
    if (foundOrder) {
      setOrder(foundOrder);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id, orders]);

  if (loading) return <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: 50 }} />;
  if (!order) return <Text>Không tìm thấy đơn hàng</Text>;

  const orderItems = order.items.map((item: any, index: number) => ({
    key: index + 1,
    image: item.product.image, 
    name: item.product.name,
    price: `${item.product.price.toLocaleString()} VND`,
    quantity: item.quantity,
    total: `${(item.product.price * item.quantity).toLocaleString()} VND`,
  }));

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <Image src={image} width={50} height={50} style={{ objectFit: "cover" }} />,
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Đơn giá", dataIndex: "price", key: "price" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Thành tiền", dataIndex: "total", key: "total" },
  ];

  return (
    <div style={{ padding: 20, maxWidth: "800px", margin: "0 auto" }}>
      <Title level={3}>Chi tiết đơn hàng #{order.orderCode}</Title>
      <Card title="Thông tin đơn hàng">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Mã đơn hàng">{order.orderCode}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt hàng">{order.orderDate}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{orderStatusMap[order.orderStatus as OrderStatus]}</Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {paymentMethodMap[order.paymentMethod as PaymentMethod]}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">{order.totalAmount.toLocaleString()} VND</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Danh sách sản phẩm" style={{ marginTop: 24 }}>
        <Table
          dataSource={orderItems}
          columns={columns}
          pagination={false}
        />
      </Card>

      <Button
        type="primary"
        style={{ marginTop: 20 }}
        onClick={() => navigate("/order")}
      >
        Quay lại danh sách đơn hàng
      </Button>
    </div>
  );
};

export default OrderDetail;