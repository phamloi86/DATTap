import React from "react";
import { Card, Button, List, Typography, InputNumber } from "antd";
import { useCart } from "./CartContext";
import { Iproduct } from "../../interfaces/product";
import { Link } from "react-router-dom"; // Thêm Link

interface CartItemProps {
  product: Iproduct;
  quantity: number;
  onRemove: (id: string | number) => void;
  onUpdateQuantity: (id: string | number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, quantity, onRemove, onUpdateQuantity }) => {
  return (
    <List.Item>
      <Card style={{ width: 240 }}>
        <img src={product.image} alt={product.name} style={{ width: "100%" }} />
        <Typography.Title level={4}>{product.name}</Typography.Title>
        <Typography.Text>{product.description}</Typography.Text>
        <Typography.Text strong>{product.price.toLocaleString()} VND</Typography.Text>
        <div style={{ marginTop: 8 }}>
          <Typography.Text>Số lượng: </Typography.Text>
          <InputNumber
            min={1}
            value={quantity}
            onChange={(value) => onUpdateQuantity(product.id, value as number)}
            style={{ width: 60 }}
          />
          <Button type="link" onClick={() => onRemove(product.id)} style={{ marginLeft: 8 }}>
            Xóa
          </Button>
        </div>
        <Typography.Text strong>
          Tổng: {(product.price * quantity).toLocaleString()} VND
        </Typography.Text>
      </Card>
    </List.Item>
  );
};

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={2}>Giỏ Hàng</Typography.Title>
      {cartItems.length === 0 ? (
        <Typography.Text>Giỏ hàng của bạn đang trống.</Typography.Text>
      ) : (
        <>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={cartItems}
            renderItem={(item) => (
              <CartItem
                key={item.product.id}
                product={item.product}
                quantity={item.quantity}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            )}
          />
          <Typography.Title level={3}>Tổng cộng: {totalPrice.toLocaleString()} VND</Typography.Title>
          <Link to="/checkout">
            <Button type="primary" style={{ marginTop: "20px" }}>
              Thanh Toán
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Cart;