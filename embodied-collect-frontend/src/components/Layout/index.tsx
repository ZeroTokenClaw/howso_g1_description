import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppSider from "./Sider";
import AppHeader from "./Header";

const { Content } = Layout;

const MainLayout = () => (
  <Layout className="app-shell">
    <AppSider />
    <Layout className="app-main">
      <AppHeader />
      <Content className="app-content">
        <Outlet />
      </Content>
    </Layout>
  </Layout>
);

export default MainLayout;
