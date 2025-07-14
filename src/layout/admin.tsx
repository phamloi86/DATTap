import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "./admin/header";
import SidebarAdmin from "./admin/sidebar";
import FooterAdmin from "./admin/footer";

const { Content, Sider } = Layout;
const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderAdmin />
      <Layout>
        <Sider width={250} style={{ background: "#fff", padding: "16px" }}>
          <SidebarAdmin />
        </Sider>
        <Layout style={{ padding: "px" }}>
          <Content style={{ background: "#fff", padding: "24px", minHeight: 280 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <FooterAdmin />
    </Layout>
  );
};

export default AdminLayout;
