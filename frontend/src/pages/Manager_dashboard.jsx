import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  LogoutOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import ManagerWorkers from "./Manager_worker";
import ManagerAttendance from "./Manager_attendance";
import ManagerOverview from "./ManagerOverview";
import SetLocation from "./SetLocation";

const { Sider, Content, Header } = Layout;

export default function ManagerDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("overview");
  const [managerName, setManagerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setManagerName(decoded.name); // get name from JWT
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      localStorage.removeItem("token"); // clear JWT
      navigate("/"); // redirect
      return;
    }
    setActiveKey(e.key);
  };

  const menuItems = [
    { key: "overview", icon: <BarChartOutlined />, label: "Overview" },
    { key: "workers", icon: <TeamOutlined />, label: "Workers" },
    { key: "attendance", icon: <CalendarOutlined />, label: "Attendance" },
    { key: "setlocation", icon: <UserOutlined />, label: "Set Location" },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ color: "red" }} />,
      label: <span style={{ color: "red" }}>Logout</span>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div
          style={{
            height: 64,
            margin: 16,
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {collapsed ? managerName : managerName || "Manager"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", paddingLeft: 20, fontSize: 20, fontWeight: "bold" }}>
          {menuItems.find((item) => item.key === activeKey)?.label}
        </Header>
        <Content style={{ margin: "16px", padding: 16, background: "#fff", borderRadius: 8 }}>
          {activeKey === "overview" && <ManagerOverview />}
          {activeKey === "workers" && <ManagerWorkers />}
          {activeKey === "attendance" && <ManagerAttendance />}
          {activeKey === "setlocation" && <SetLocation />}
        </Content>
      </Layout>
    </Layout>
  );
}
