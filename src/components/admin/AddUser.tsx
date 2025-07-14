import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
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
import { IuserForm } from "../../interfaces/user";
const { Title } = Typography;
const { Option } = Select;

const AddUser = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IuserForm>({
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      role: "client",
      password: "",
    },
  });

  const onSubmit = async (data: IuserForm) => {
    try {
      await axios.post("http://localhost:3000/users", data);
      message.success("Thêm người dùng thành công!");
      navigate("/admin/users");
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      message.error("Thêm người dùng thất bại!");
    }
  };
  return (
    <Card
      title={
        <Title level={3} style={{ textAlign: "center" }}>
          Thêm Người Dùng Mới
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
        <Link to="/admin/users">
          <Button type="link" style={{ fontSize: "16px", color: "#1890ff" }}>
            ⬅ Quay lại danh sách người dùng
          </Button>
        </Link>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Tên tài khoản"
          validateStatus={errors.username ? "error" : ""}
          help={errors.username?.message}
        >
          <Controller
            name="username"
            control={control}
            rules={{ required: "Vui lòng nhập tên tài khoản" }}
            render={({ field }) => (
              <Input {...field} placeholder="Nhập tên tài khoản" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không hợp lệ",
              },
            }}
            render={({ field }) => <Input {...field} placeholder="Nhập email" />}
          />
        </Form.Item>

        <Form.Item
          label="SĐT"
          validateStatus={errors.phone ? "error" : ""}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Vui lòng nhập số điện thoại",
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: "SĐT phải là số và có 10-11 chữ số",
              },
            }}
            render={({ field }) => (
              <Input {...field} placeholder="Nhập số điện thoại" />
            )}
          />
        </Form.Item>

        <Form.Item label="Vai trò">
          <Controller
            name="role"
            control={control}
            rules={{ required: "Vui lòng chọn vai trò" }}
            render={({ field }) => (
              <Select {...field} placeholder="Chọn vai trò">
                <Option value="admin">Admin</Option>
                <Option value="client">Client</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            rules={{ required: "Vui lòng nhập mật khẩu" }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Nhập mật khẩu" />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm người dùng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddUser;