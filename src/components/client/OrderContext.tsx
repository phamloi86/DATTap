import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Order {
  id: number;
  orderCode: string;
  orderDate: string;
  paymentMethod: number;
  paymentStatus: number;
  orderStatus: number;
  userId: number;
  items: { product: { id: string | number; name: string; price: number; image: string }; quantity: number }[];
  totalAmount: number;
  discountCode: string; // Thêm trường mã giảm giá
  discountAmount: number; // Thêm trường số tiền giảm
}

const initialOrders: Order[] = [
  { id: 1, orderCode: "DH001", orderDate: "2025-03-17", paymentMethod: 1, paymentStatus: 1, orderStatus: 2, userId: 1, items: [], totalAmount: 0, discountCode: "Không sử dụng", discountAmount: 0 },
  { id: 2, orderCode: "DH002", orderDate: "2025-03-16", paymentMethod: 2, paymentStatus: 2, orderStatus: 3, userId: 2, items: [], totalAmount: 0, discountCode: "Không sử dụng", discountAmount: 0 },
];

interface OrderContextType {
  orders: Order[];
  updateOrder: (updatedOrder: Order) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : initialOrders;
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
    console.log("Danh sách đơn hàng sau khi cập nhật trong OrderContext:", orders);
  }, [orders]);

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prevOrders) => {
      const existingOrder = prevOrders.find((order) => order.id === updatedOrder.id);
      if (existingOrder) {
        console.log("Cập nhật đơn hàng:", updatedOrder);
        return prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order));
      }
      console.log("Thêm đơn hàng mới:", updatedOrder);
      return [...prevOrders, updatedOrder];
    });
  };

  return (
    <OrderContext.Provider value={{ orders, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within an OrderProvider");
  return context;
};