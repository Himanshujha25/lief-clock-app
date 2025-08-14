import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import ClockInOut from "./Worker_clock";
import WorkerAttendance from "./Worker_attenadance";
import WorkerProfile from "./Worker_profile";

const { Sider, Content } = Layout;

export default function WorkerDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("clock");
  const navigate = useNavigate();

  useEffect(() => {
    const savedTab = localStorage.getItem("workerActiveTab");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      localStorage.removeItem("token"); // clear token
      localStorage.removeItem("workerActiveTab");
      navigate("/"); // go back to login/home
      return;
    }
    setActiveTab(e.key);
    localStorage.setItem("workerActiveTab", e.key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
        }}
      >
        <div
          style={{
            height: 50,
            margin: 16,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 6,
            textAlign: "center",
            color: "#fff",
            lineHeight: "50px",
            fontWeight: "bold",
            fontSize: collapsed ? "12px" : "16px",
          }}
        >
          Worker
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeTab]}
          onClick={handleMenuClick}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 82px)",
          }}
        >
          <Menu.Item key="clock" icon={<ClockCircleOutlined />}>
            Clock In/Out
          </Menu.Item>
          <Menu.Item key="attendance" icon={<FileTextOutlined />}>
            Attendance
          </Menu.Item>
          <Menu.Item key="profile" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined style={{ color: "red" }} />}
            style={{
              marginTop: "auto",
              color: "red",
              fontWeight: "bold",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
        <Content style={{ height: "100vh", padding: 0, margin: 0 }}>
          {activeTab === "clock" && <ClockInOut />}
          {activeTab === "attendance" && <WorkerAttendance />}
          {activeTab === "profile" && <WorkerProfile />}
        </Content>
      </Layout>
    </Layout>
  );
}
