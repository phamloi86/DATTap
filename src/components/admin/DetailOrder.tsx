import React, { useEffect, useState } from "react";
import { Card, Col, Descriptions, Row, Table, Typography, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useOrders } from "../client/OrderContext";
import axios from "axios";


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

const DetailOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useOrders();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/orders/${id}`);
        setOrder(data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: 50 }} />;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  const orderItems = order.items.map((item: any, index: number) => ({
    key: index + 1,
    name: item.product.name,
    price: `${item.product.price.toLocaleString()} VND`,
    quantity: item.quantity,
    total: `${(item.product.price * item.quantity).toLocaleString()} VND`,
  }));

  return (
    <div style={{ padding: 20 }}>
      <Typography.Title level={3}>Chi tiết đơn hàng #{order.orderCode}</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="Thông tin đơn hàng">
            <Descriptions column={1}>
              <Descriptions.Item label="Mã đơn hàng">{order.orderCode}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt hàng">{order.orderDate}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {orderStatusMap[order.orderStatus as OrderStatus]} {/* Ép kiểu */}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">{order.totalAmount.toLocaleString()} VND</Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {paymentMethodMap[order.paymentMethod as PaymentMethod]} {/* Ép kiểu */}
              </Descriptions.Item>
              {order.orderStatus === 7 && order.cancelReason && (
                <Descriptions.Item label="Lý do hủy đơn hàng">
                  {order.cancelReason}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Thông tin người đặt hàng">
            <Descriptions column={1}>
              <Descriptions.Item label="Họ tên">
                {order.customerInfo?.username || "Không rõ"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {order.customerInfo?.phone || "Không rõ"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Thông tin người nhận hàng">
            <Descriptions column={1}>
              <Descriptions.Item label="Họ tên">
                {order.customerInfo?.username || "Không rõ"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {order.customerInfo?.phone || "Không rõ"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {order.customerInfo?.address || "Không rõ"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Card title="Danh sách sản phẩm" style={{ marginTop: 24 }}>
        <Table
          dataSource={orderItems}
          columns={[
            { title: "STT", dataIndex: "key", key: "key" },
            { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
            { title: "Đơn giá", dataIndex: "price", key: "price" },
            { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
            { title: "Thành tiền", dataIndex: "total", key: "total" },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default DetailOrder;