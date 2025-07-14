import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
} from "antd";
import { Icategory, IcategoryForm } from "../../interfaces/category";

const { Title } = Typography;
const { Option } = Select;

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  const [categories, setCategories] = useState<Icategory[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IcategoryForm>({
    defaultValues: {
      name: "",
      slug: "",
      parentId: null,
    },
  });

  // Lấy danh sách danh mục để chọn danh mục cha
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/categories");
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Lấy thông tin danh mục cần chỉnh sửa
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/categories/${id}`);
        reset(data); // Điền dữ liệu vào form
      } catch (error) {
        console.error("Lỗi khi lấy thông tin danh mục:", error);
        message.error("Không thể tải thông tin danh mục!");
      }
    };
    if (id) fetchCategory();
  }, [id, reset]);

  const onSubmit = async (data: IcategoryForm) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/categories/${id}`, data);
      message.success("Cập nhật danh mục thành công!");
      navigate("/admin/category");
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      message.error("Cập nhật danh mục thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <Title level={3} style={{ textAlign: "center" }}>
          Chỉnh Sửa Danh Mục
        </Title>
      }
      style={{
        maxWidth: 600,
        margin: "20px auto",
        padding: "24px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <Link to="/admin/category">
          <Button type="link" style={{ fontSize: "16px", color: "#1890ff" }}>
            ⬅ Quay lại danh sách danh mục
          </Button>
        </Link>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Tên danh mục */}
        <Form.Item
          label="Tên danh mục"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Vui lòng nhập tên danh mục" }}
            render={({ field }) => (
              <Input {...field} placeholder="Nhập tên danh mục" />
            )}
          />
        </Form.Item>

        {/* Slug */}
        <Form.Item
          label="Slug (URL danh mục)"
          validateStatus={errors.slug ? "error" : ""}
          help={errors.slug?.message}
        >
          <Controller
            name="slug"
            control={control}
            rules={{ required: "Vui lòng nhập slug" }}
            render={({ field }) => (
              <Input {...field} placeholder="Nhập slug (VD: danh-muc-1)" />
            )}
          />
        </Form.Item>

        {/* Trạng thái */}
        <Form.Item label="Trạng thái">
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Chọn trạng thái">
                <Option value={true}>Hiển thị</Option>
                <Option value={false}>Ẩn</Option>
              </Select>
            )}
          />
        </Form.Item>


        {/* Danh mục cha */}
        <Form.Item label="Danh mục cha (nếu có)">
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Chọn danh mục cha"
                allowClear
                onChange={(value) => field.onChange(value)}
              >
                <Option value={null}>Không có danh mục cha</Option>
                {categories
                  .filter((cat) => cat.id !== Number(id)) // Loại bỏ chính danh mục đang chỉnh sửa
                  .map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
              </Select>
            )}
          />
        </Form.Item>

        {/* Nút submit */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Cập nhật danh mục
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditCategory;