import { Layout, Row, Col, Typography, Space } from "antd";
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Title } = Typography;
const FooterClient = () => {
  return (
    <Footer style={{ background: "#222", color: "#fff", padding: "40px 50px" }}>
      <Row gutter={32}>
        <Col span={8}>
          <Title level={3} style={{ color: "#D4AF37" }}>GOLD WORLD</Title>
          <Text style={{ color: "#d9d9d9" }}>
            Cửa hàng mua bán vàng uy tín, chất lượng cao cấp.
          </Text>
        </Col>
        <Col span={8}>
          <Title level={4} style={{ color: "#fff" }}>Dịch vụ khách hàng</Title>
          <Space direction="vertical">
            <Text style={{ color: "#d9d9d9" }}>Chính sách đổi trả</Text>
            <Text style={{ color: "#d9d9d9" }}>Hướng dẫn mua hàng</Text>
            <Text style={{ color: "#d9d9d9" }}>Câu hỏi thường gặp</Text>
          </Space>
        </Col>
        <Col span={8}>
          <Title level={4} style={{ color: "#fff" }}>Liên hệ</Title>
          <Space size="large">
            <FacebookOutlined style={{ fontSize: "24px", color: "#D4AF37" }} />
            <TwitterOutlined style={{ fontSize: "24px", color: "#D4AF37" }} />
            <InstagramOutlined style={{ fontSize: "24px", color: "#D4AF37" }} />
          </Space>
          <Text style={{ display: "block", color: "#d9d9d9", marginTop: 10 }}>
            Địa chỉ: 123 Đường ABC, TP. Hà Nội
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default FooterClient;
