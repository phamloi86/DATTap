import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderClient from "./client/header";
import Nav from "./client/nav";
import FooterClient from "./client/footer";
import { CartProvider } from "../components/client/CartContext";

const { Content } = Layout;
const ClientLayout = () => {
  return (
    <CartProvider>
      <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#e0e0e0" }}>
        <HeaderClient />
        <Nav />
        <Content style={{ flex: 1, padding: "24px", background: "#e0e0e0" }}>
          <Outlet />
        </Content>
        <FooterClient />
      </Layout>
    </CartProvider>
  );
};

export default ClientLayout;