import { useState } from "react";
import { Layout, Input, Button, Row, Col, Typography, Avatar, AutoComplete, Badge } from "antd";
import { UserOutlined, SearchOutlined, LoginOutlined, UserAddOutlined, ShoppingCartOutlined, DollarOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthContext";
import { useCart } from "../../components/client/CartContext";
import axios from "axios";

const { Header } = Layout;
const { Text } = Typography;
const removeAccents = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[̀-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
// Định nghĩa interface cho sản phẩm
interface Product {
  id: number;
  name: string;
  price: number;
  // Thêm các trường khác nếu cần
}
const HeaderClient = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const fetchProducts = async (query: string) => {
    try {
      const { data } = await axios.get<Product[]>("http://localhost:3000/products");
      const normalizedQuery = removeAccents(query.toLowerCase());
      const filteredProducts = data
        .filter((product: Product) => {
          const normalizedProductName = removeAccents(product.name.toLowerCase());
          return normalizedProductName.includes(normalizedQuery);
        })
        .map((product: Product) => ({
          value: product.id.toString(),
          label: `${product.name} - ${product.price.toLocaleString("vi-VN")} VNĐ`,
        }));
      setOptions(filteredProducts);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value) {
      fetchProducts(value);
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (value: string) => {
    navigate(`/detail/${value}`);
    setSearchValue("");
    setOptions([]);
  };

  return (
    <Header style={{ background: "#ffffff", padding: "0 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Link to="/">
            <Text strong style={{ fontSize: "20px", color: "#D4AF37" }}>GOLD WORLD</Text>
          </Link>
        </Col>
        <Col flex="auto" style={{ margin: "0 20px" }}>
          <AutoComplete
            value={searchValue}
            options={options}
            style={{ width: "100%", maxWidth: 500 }}
            onSearch={handleSearchChange}
            onSelect={handleSelect}
          >
            <Input
              prefix={<SearchOutlined style={{ color: "black" }} />}
              style={{ borderRadius: "6px", background: "#e9e9e9", color: "black" }}
              size="large"
              placeholder="Tìm kiếm sản phẩm..."
            />
          </AutoComplete>
        </Col>
        <Col>
          <Text style={{ color: "#D4AF37", fontWeight: "bold", marginRight: 16 }}>
            <a style={{ color: "#D4AF37" }} href="/goldprice">
              <DollarOutlined /> Giá vàng hôm nay
            </a>
          </Text>
        </Col>
        <Col>
          <Link to="/cart">
            <Badge count={cartItems.length} showZero> {/* Hiển thị số lượng sản phẩm trong giỏ hàng */}
              <Button type="text" icon={<ShoppingCartOutlined />} style={{ color: "#D4AF37", fontSize: "18px" }} />
            </Badge>
          </Link>
        </Col>
        {user ? (
          <Col>
            <Button
              type="text"
              style={{ color: "#D4AF37" }}
              onClick={() => navigate("/profile")}
            >
              <Avatar size="large" icon={<UserOutlined />} style={{ background: "#D4AF37", color: "#333" }} />
              <Text style={{ marginLeft: 8, color: "#D4AF37" }}>{user.username}</Text>
            </Button>
          </Col>
        ) : (
          <Col>
            <Link to="/login">
              <Button icon={<LoginOutlined />} type="text" style={{ marginRight: 10, color: "#D4AF37" }}>
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button
                icon={<UserAddOutlined />}
                style={{ background: "#D4AF37", color: "#333", fontWeight: "bold" }}
              >
                Đăng ký
              </Button>
            </Link>
          </Col>
        )}
      </Row>
    </Header>
  );
};

export default HeaderClient;