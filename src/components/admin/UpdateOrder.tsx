import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Input, Select, Button, DatePicker, message } from "antd";
import dayjs from "dayjs";
import { useOrders } from "../client/OrderContext";
import axios from "axios";

const { Option } = Select;

const UpdateOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrder } = useOrders();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/orders/${id}`);
        setFormData(data);
      } catch {
        setFormData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!formData) return <div>Không tìm thấy đơn hàng</div>;

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(`http://localhost:3000/orders/${id}`, formData);
      message.success("Cập nhật đơn hàng thành công!");
      navigate("/admin/order");
    } catch {
      message.error("Lỗi khi cập nhật đơn hàng!");
    }
  };

  const orderStatusOptions = [
    { value: 1, label: "Chưa xác nhận" },
    { value: 2, label: "Đã xác nhận" },
    { value: 3, label: "Đang giao" },
    { value: 4, label: "Đã giao" },
    { value: 5, label: "Giao thành công" },
    { value: 6, label: "Hoàn thành đơn hàng" },
    { value: 7, label: "Đã hủy" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title={`Chỉnh sửa đơn hàng: ${formData.orderCode}`}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Mã đơn hàng">
            <Input value={formData.orderCode} disabled />
          </Form.Item>
          <Form.Item label="Ngày đặt hàng">
            <DatePicker
              value={dayjs(formData.orderDate)}
              onChange={(date) => handleChange("orderDate", date?.format("YYYY-MM-DD"))}
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item label="Phương thức thanh toán">
            <Select value={formData.paymentMethod} onChange={(value) => handleChange("paymentMethod", value)}>
              <Option value={1}>Chuyển khoản</Option>
              <Option value={2}>Thanh toán khi nhận hàng</Option>
              <Option value={3}>Thẻ tín dụng</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Trạng thái thanh toán">
            <Select value={formData.paymentStatus} onChange={(value) => handleChange("paymentStatus", value)}>
              <Option value={1}>Chưa thanh toán</Option>
              <Option value={2}>Đã thanh toán</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Trạng thái đơn hàng">
            <Select value={formData.orderStatus} onChange={(value) => handleChange("orderStatus", value)}>
              {orderStatusOptions
                .filter(opt => opt.value >= formData.orderStatus)
                .map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateOrder;