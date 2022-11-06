import { Layout, Menu } from "antd";
import React, { ReactElement, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FormOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";

const { Header, Sider, Content } = Layout;
interface IAuxProps {
  children: ReactElement;
}
export default function CustomLayout({ children }: IAuxProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Layout className="layout">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">{!collapsed && <span>Company Name</span>}</div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["/"]}
            onClick={({ keyPath }) => router.push(`/${keyPath}`)}
            items={[
              {
                key: "/",
                icon: <HomeOutlined />,
                label: "Home",
              },
              {
                key: "orders",
                icon: <FormOutlined />,
                label: "Orders",
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "16px 24px 10px 16px",
              padding: 10,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
