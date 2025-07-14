import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Input, Button, Typography, Select, message } from "antd";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const { Title } = Typography;
const { Option } = Select;

const AddProducts = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/categories")
      .then((res) => setCategories(res.data))
      .catch(() => message.error("Lỗi khi tải danh mục!"));
  }, []);

  const addProduct = async (data: any) => {
    await axios.post("http://localhost:3000/products", data);
  };
  const { mutate } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      message.success("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    },
    onError: () => {
      message.error("Thêm sản phẩm thất bại!");
    },
  });
  const onFinish = (values: any) => {
    mutate(values);
  };

  return (
    <Card title={<Title level={3} style={{ textAlign: "center" }}>Thêm Sản Phẩm Mới</Title>} style={{ maxWidth: 600, margin: "20px auto" }}>
      <Link to="/admin/products" style={{ display: "block", textAlign: "center", marginBottom: 16, color: "#1890ff" }}>
        Quay lại trang chủ
      </Link>
      
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item label="Ảnh sản phẩm" name="image">
          <Input placeholder="Nhập URL ảnh sản phẩm" />
        </Form.Item>

        <Form.Item label="Giá sản phẩm" name="price">
          <Input type="number" placeholder="Nhập giá sản phẩm" />
        </Form.Item>

        <Form.Item label="Mô tả sản phẩm" name="description">
          <Input.TextArea placeholder="Nhập mô tả sản phẩm" rows={4} />
        </Form.Item>

        <Form.Item label="Danh mục sản phẩm" name="categoryId" rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}>
          <Select placeholder="Chọn danh mục">
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>{cat.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Trạng thái" name="inStock">
          <Select placeholder="Chọn trạng thái">
            <Option value={true}>Còn hàng</Option>
            <Option value={false}>Hết hàng</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddProducts;
