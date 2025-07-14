import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Spin, Image, Tag, Button, message } from "antd"; // Thêm message từ antd
import { Iproduct } from "../../interfaces/product";
import { useCart } from "./CartContext";

const DetailProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Iproduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      message.success(`${product.name} đã được thêm vào giỏ hàng!`);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ marginTop: "20px" }} />;
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Sản phẩm không tồn tại!
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "300px", marginRight: "20px" }}>
          <Image
            src={product.image}
            alt={product.name}
            width={468}
            height={468}
            style={{ objectFit: "cover" }}
            preview={false}
          />
        </div>
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h1 style={{ marginBottom: "20px" }}>{product.name}</h1>
          <div style={{ marginBottom: "10px" }}>
            {product.inStock ? (
              <Tag color="green" style={{ fontSize: "14px", fontWeight: "bold" }}>
                Còn hàng
              </Tag>
            ) : (
              <Tag color="red" style={{ fontSize: "14px", fontWeight: "bold" }}>
                Hết hàng
              </Tag>
            )}
          </div>
          <div style={{ marginBottom: "20px" }}>
            <strong>Giá: </strong>
            <span style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}>
              {Number(product.price).toLocaleString()} VND
            </span>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <p>{product.description}</p>
          </div>
          <Button type="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;