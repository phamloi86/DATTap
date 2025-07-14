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
  Space,
  Modal,
} from "antd";
import { Iuser, IuserForm } from "../../interfaces/user";

const { Title } = Typography;
const { Option } = Select;

const EditUsers = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<Iuser | null>(null); // Lưu dữ liệu người dùng

  const {
    control,
    handleSubmit,
    reset,
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

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/users/${id}`);
        setUserData(data); // Lưu dữ liệu để kiểm tra trạng thái khóa
        reset({
          username: data.username,
          email: data.email,
          phone: data.phone,
          role: data.role,
          password: "",
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        message.error("Không thể tải thông tin người dùng!");
      }
    };
    if (id) fetchUser();
  }, [id, reset]);

  const onSubmit = async (data: IuserForm) => {
    setLoading(true);
    try {
      const updateData = { ...data };
      if (!data.password) delete updateData.password; // Không gửi mật khẩu nếu không đổi
      await axios.patch(`http://localhost:3000/users/${id}`, updateData);
      message.success("Cập nhật người dùng thành công!");
      navigate("/admin/users");
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      message.error("Cập nhật người dùng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const lockAccount = async (days: number) => {
    const lockUntil = new Date();
    lockUntil.setDate(lockUntil.getDate() + days);
    try {
      await axios.patch(`http://localhost:3000/users/${id}`, {
        isLocked: true,
        lockUntil: lockUntil.toISOString(),
      });
      setUserData({
        ...userData!,
        isLocked: true,
        lockUntil: lockUntil.toISOString(),
      });
      message.success(`Khóa tài khoản thành công trong ${days} ngày!`);
      navigate("/admin/users");
    } catch (error) {
      console.error("Lỗi khi khóa tài khoản:", error);
      message.error("Khóa tài khoản thất bại!");
    }
  };

  const unlockAccount = async () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn mở khóa tài khoản này?",
      onOk: async () => {
        try {
          await axios.patch(`http://localhost:3000/users/${id}`, {
            isLocked: false,
            lockUntil: null,
          });
          setUserData({ ...userData!, isLocked: false, lockUntil: null });
          message.success("Mở khóa tài khoản thành công!");
        } catch (error) {
          message.error("Mở khóa tài khoản thất bại!");
        }
      },
    });
  };

  return (
    <Card
      title={
        <Title level={3} style={{ textAlign: "center" }}>
          Chỉnh Sửa Người Dùng
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

        <Form.Item label="Mật khẩu mới (nếu muốn đổi)">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Nhập mật khẩu mới" />
            )}
          />
        </Form.Item>

        <Form.Item label="Khóa/Mở khóa tài khoản">
          <Space>
            <Button onClick={() => lockAccount(3)}>Khóa 3 ngày</Button>
            <Button onClick={() => lockAccount(7)}>Khóa 7 ngày</Button>
            <Button onClick={() => lockAccount(30)}>Khóa 1 tháng</Button>
            <Button onClick={() => lockAccount(365)}>Khóa 1 năm</Button>
            {userData?.isLocked && (
              <Button type="dashed" onClick={unlockAccount}>
                Mở khóa
              </Button>
            )}
          </Space>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Cập nhật người dùng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditUsers;