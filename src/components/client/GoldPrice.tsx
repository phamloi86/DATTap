import React from "react";
import { Table, Card, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";

const { Title } = Typography;

interface GoldPrice {
  key: string;
  type: string;
  buy: number;
  sell: number;
}
const columns: ColumnsType<GoldPrice> = [
  {
    title: "Loại vàng",
    dataIndex: "type",
    key: "type",
    align: "left",
  },
  {
    title: "Giá mua (1.000đ/chỉ)",
    dataIndex: "buy",
    key: "buy",
    align: "right",
    render: (value) => value.toLocaleString("vi-VN"),
  },
  {
    title: "Giá bán (1.000đ/chỉ)",
    dataIndex: "sell",
    key: "sell",
    align: "right",
    render: (value) => value.toLocaleString("vi-VN"),
  },
];

const goldPrices: GoldPrice[] = [
  { key: "1", type: "Vàng miếng SJC 999.9", buy: 9430, sell: 9580 },
  { key: "2", type: "Nhẫn Trơn PNJ 999.9", buy: 9450, sell: 9620 },
  { key: "3", type: "Vàng Kim Bảo 999.9", buy: 9450, sell: 9620 },
  { key: "4", type: "Vàng nữ trang 999.9", buy: 9360, sell: 9610 },
];

const GoldPriceTable: React.FC = () => {
  return (
    <Card style={{ maxWidth: 800, margin: "20px auto", textAlign: "center" }}>
      <Title level={4} style={{ color: "#D4AF37" }}>
        Giá Vàng PNJ, SJC Mới Nhất Hôm Nay
      </Title>
      <Typography.Text type="secondary">
        Cập nhật ngày: {moment().format("DD/MM/YYYY HH:mm")}
      </Typography.Text>
      <Table
        columns={columns}
        dataSource={goldPrices}
        pagination={false}
        style={{ marginTop: 16 }}
      />
    </Card>
  );
};

export default GoldPriceTable;
