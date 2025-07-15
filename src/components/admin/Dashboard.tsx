import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { Bar } from "react-chartjs-2";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import "chart.js/auto";
const DashBoard = () => {
  const [revenue, setRevenue] = useState(0);
  const [stock, setStock] = useState(0);
  const [soldOrders, setSoldOrders] = useState(0);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: "Doanh Thu (VND)",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      .then((orders) => {
        // Đơn đã hoàn thành (orderStatus === 6)
        const paidOrders = orders.filter((order: any) => order.orderStatus === 6);
        // Đơn chưa xử lý (orderStatus === 1)
        const unpaidOrders = orders.filter((order: any) => order.orderStatus === 1);

        // 🔹 Tổng doanh thu
        const totalRevenue = paidOrders.reduce(
          (sum: number, order: any) => sum + (Number(order.totalAmount) || 0),
          0
        );
        setRevenue(totalRevenue);

        // 🔹 Tổng số đơn hàng đã bán
        setSoldOrders(paidOrders.length);

        // 🔹 Số lượng hàng chưa xử lý
        setStock(unpaidOrders.length);

        // 🔹 Doanh thu 5 ngày gần nhất
        const revenueByDate: Record<string, number> = {};
        paidOrders.forEach((order: any) => {
          const date = order.orderDate.split("T")[0];
          revenueByDate[date] = (revenueByDate[date] || 0) + (Number(order.totalAmount) || 0);
        });

        const sortedDates = Object.keys(revenueByDate)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .slice(-5); // Lấy 5 ngày gần nhất

        setChartData({
          labels: sortedDates,
          datasets: [
            {
              label: "Doanh Thu (VND)",
              data: sortedDates.map((date) => revenueByDate[date]),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => console.error("Lỗi lấy danh sách đơn hàng:", err));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng Doanh Thu"
              value={revenue.toLocaleString("vi-VN")} // Format số tiền VNĐ
              suffix="VNĐ"
              prefix={<DollarCircleOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Số lượng hàng chưa xử lý"
              value={stock}
              prefix={<DatabaseOutlined style={{ color: "#ff4d4f" }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn hàng đã bán"
              value={soldOrders}
              prefix={<ShoppingCartOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 20 }}>
        <h3>Doanh Thu 5 Ngày Gần Nhất</h3>
        <Bar data={chartData} />
      </Card>
    </div>
  );
};

export default DashBoard;
