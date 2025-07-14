import { useEffect, useState } from "react";
import { IproductForm } from "../../interfaces/product";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Form, Input, Button, Typography, message, Select } from "antd";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IproductForm>();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const getProductById = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/products/${id}`);
        reset(data); // Cập nhật dữ liệu vào form
      } catch (error) {
        console.error(error);
      }
    };

    const getCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/categories");
        setCategories(data);
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi tải danh mục!");
      }
    };

    getProductById();
    getCategories();
  }, [id, reset]);

  const onSubmit = async (productData: IproductForm) => {
    try {
      await axios.put(`http://localhost:3000/products/${id}`, productData);
      message.success("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      message.error("Cập nhật thất bại!");
      console.error(error);
    }
  };

  return (
    <Card
      title={<Title level={3} style={{ textAlign: "center" }}>Sửa sản phẩm</Title>}
      style={{ maxWidth: 600, margin: "20px auto" }}
    >
      <Link
        to="/admin/products"
        style={{ display: "block", textAlign: "center", marginBottom: 16, color: "#1890ff" }}
      >
        Quay lại trang chủ
      </Link>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Tên sản phẩm */}
        <Form.Item
          label="Tên sản phẩm"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Cần có tên sản phẩm" }}
            render={({ field }) => <Input {...field} placeholder="Nhập tên sản phẩm" />}
          />
        </Form.Item>

        {/* Ảnh sản phẩm */}
        <Form.Item label="Ảnh sản phẩm">
          <Controller
            name="image"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Nhập URL ảnh sản phẩm" />}
          />
        </Form.Item>

        {/* Giá sản phẩm */}
        <Form.Item label="Giá sản phẩm">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input type="number" {...field} placeholder="Nhập giá sản phẩm" />
            )}
          />
        </Form.Item>

        {/* Mô tả sản phẩm */}
        <Form.Item label="Mô tả sản phẩm">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea {...field} rows={4} placeholder="Nhập mô tả sản phẩm" />
            )}
          />
        </Form.Item>

        {/* Chọn danh mục */}
        <Form.Item
          label="Danh mục sản phẩm"
          validateStatus={errors.categoryId ? "error" : ""}
          help={errors.categoryId?.message}
        >
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Vui lòng chọn danh mục" }}
            render={({ field }) => (
              <Select {...field} placeholder="Chọn danh mục">
                {categories.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        {/* Trạng thái còn hàng */}
        <Form.Item label="Trạng thái">
          <Controller
            name="inStock"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Chọn trạng thái">
                <Option value={true}>Còn hàng</Option>
                <Option value={false}>Hết hàng</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Cập nhật sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditProducts;