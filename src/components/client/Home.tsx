import { useEffect, useState } from "react";
import axios from "axios";
import { Carousel, Image, Card, Tag, Spin, Row, Col } from "antd";
import { CustomerServiceOutlined, SyncOutlined, TruckOutlined } from "@ant-design/icons";
import { Iproduct } from "../../interfaces/product";
import { useNavigate } from "react-router-dom"; // Import useNavigate từ react-router-dom

const banners = [
  "https://cdn.pnj.io/images/promo/238/BANNER_BST_Audax__1200x450__Main_banner.png",
  "https://theme.hstatic.net/200000061680/1000549213/14/ms_banner_img4.jpg?v=1363",
  "https://nuu.edu.vn/wp-content/uploads/huong-dan-ban-vang-bac-da-quy-kim-cuong-online-internet.jpg",
  "https://i.ytimg.com/vi/4LbTb92bfRk/maxresdefault.jpg",
];

const infoBoxes = [
  {
    icon: <TruckOutlined style={{ fontSize: "36px", color: "#000000" }} />,
    title: "FREE SHIPPING & RETURN",
    description: "Free shipping on all orders over $99.",
  },
  {
    icon: <SyncOutlined style={{ fontSize: "36px", color: "#000000" }} />,
    title: "MONEY BACK GUARANTEE",
    description: "100% money back guarantee",
  },
  {
    icon: <CustomerServiceOutlined style={{ fontSize: "36px", color: "#000000" }} />,
    title: "ONLINE SUPPORT 24/7",
    description: "Lorem ipsum dolor sit amet.",
  },
];


const Home = () => {
  const navigate = useNavigate(); // Khai báo hook navigate

  // State cho Featured Products
  const [products, setProducts] = useState<Iproduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State cho New Products
  const [newProducts, setNewProducts] = useState<Iproduct[]>([]);
  const [newProductsLoading, setNewProductsLoading] = useState<boolean>(true);

  // Call API cho Featured Products (sản phẩm cũ)
  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((response) => {
        console.log("Dữ liệu API:", response.data);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Call API cho New Products (sản phẩm mới)
  useEffect(() => {
    axios
      .get("http://localhost:3000/new_product")
      .then((response) => {
        console.log("Dữ liệu New Products:", response.data);
        if (Array.isArray(response.data)) {
          setNewProducts(response.data);
        } else if (response.data && Array.isArray(response.data.products)) {
          setNewProducts(response.data.products);
        } else {
          setNewProducts([]);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu New Products:", error);
        setNewProducts([]);
      })
      .finally(() => {
        setNewProductsLoading(false);
      });
  }, []);

  // Hàm xử lý chuyển hướng khi click vào sản phẩm
  const handleProductClick = (id: number) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* Banner chạy toàn màn hình */}
      <Carousel autoplay autoplaySpeed={3000} effect="fade" style={{ width: "100%", height: "600px", overflow: "hidden" }}>
        {banners.map((src, index) => (
          <div key={index}>
            <Image src={src} alt={`Banner ${index + 1}`} preview={false} style={{ width: "100vw", height: "600px", objectFit: "cover" }} />
          </div>
        ))}
      </Carousel>

      {/* Info Boxes */}
      <Row gutter={[16, 16]} style={{ marginTop: "30px", textAlign: "center" }} justify="center">
        {infoBoxes.map((box, index) => (
          <Col key={index} xs={24} sm={12} md={5}>
            <Card
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ marginRight: "15px" }}>{box.icon}</div>
              <div>
                <h4 style={{ marginBottom: "5px" }}>{box.title}</h4>
                <p style={{ color: "#666", fontSize: "14px" }}>{box.description}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Featured Products Section */}
      {loading ? (
        <Spin size="large" style={{ marginTop: "20px" }} />
      ) : (
        <>
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Featured Products</h1>
          <Row gutter={[0, 0]} style={{ marginTop: "20px" }} justify="center">
            {products.length > 0 ? (
              products.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={5}>
                  <Card
                    hoverable
                    onClick={() => handleProductClick(product.id)} // Thêm sự kiện click chuyển hướng
                    style={{
                      height: "250px",
                      width: "300px",
                      flexDirection: "column",
                      borderRadius: "10px",
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    }}
                    cover={
                      <div style={{ padding: "0px", display: "flex", justifyContent: "center" }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          preview={false}
                          style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                        />
                      </div>
                    }
                  >
                    <div style={{ textAlign: "center" }}>
                      {product.inStock !== undefined && (
                        <Tag color={product.inStock ? "green" : "red"} style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {product.inStock ? "Còn hàng" : "Hết hàng"}
                        </Tag>
                      )}
                      <h3 style={{ fontSize: "12px", fontWeight: "bold", marginTop: "8px" }}>{product.name}</h3>
                      <p style={{ fontSize: "10px", color: "#666" }}>{product.description || "Không có mô tả"}</p>
                      <div>
                        <span style={{ color: "red", fontSize: "14px", fontWeight: "bold" }}>
                          {Number(product.price).toLocaleString()} VND
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#888" }}>Không có sản phẩm nào để hiển thị!</p>
            )}
          </Row>
        </>
      )}

      {/* New Products Section */}
      {newProductsLoading ? (
        <Spin size="large" style={{ marginTop: "20px" }} />
      ) : (
        <>
          <h1 style={{ textAlign: "center", marginBottom: "20px", marginTop: "40px" }}>New Products</h1>
          <Row gutter={[0, 0]} style={{ marginTop: "20px" }} justify="center">
            {newProducts.length > 0 ? (
              newProducts.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={5}>
                  <Card
                    hoverable
                    onClick={() => handleProductClick(product.id)}
                    style={{
                      height: "250px",
                      width: "300px",
                      flexDirection: "column",
                      borderRadius: "10px",
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    }}
                    cover={
                      <div style={{ padding: "0px", display: "flex", justifyContent: "center" }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          preview={false}
                          style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                        />
                      </div>
                    }
                  >
                    <div style={{ textAlign: "center" }}>
                      {product.inStock !== undefined && (
                        <Tag color={product.inStock ? "green" : "red"} style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {product.inStock ? "Còn hàng" : "Hết hàng"}
                        </Tag>
                      )}
                      <h3 style={{ fontSize: "12px", fontWeight: "bold", marginTop: "8px" }}>{product.name}</h3>
                      <p style={{ fontSize: "10px", color: "#666" }}>
                        {product.description || "Không có mô tả"}
                      </p>
                      <div>
                        <span style={{ color: "red", fontSize: "14px", fontWeight: "bold" }}>
                          {Number(product.price).toLocaleString()} VND
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#888" }}>Không có sản phẩm nào để hiển thị!</p>
            )}
          </Row>
        </>
      )}
    </div>
  );
};

export default Home;
