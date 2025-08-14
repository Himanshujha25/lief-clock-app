import React, { useState } from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import { Link } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import logo from "../assets/logo.png";

const { Header } = Layout;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const menuItems = [
    { key: "home", label: <Link to="/">Home</Link> },
    { key: "login", label: <Link to="/login">Login</Link> },
    { key: "register", label: <Link to="/register">Register</Link> },
  ];

  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          background: "linear-gradient(90deg, #002766, #0050b3)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
            fontSize: "22px",
            color: "#fff",
            letterSpacing: "0.5px",
          }}
        >
          <img
            src={logo}
            alt="Liefcare Logo"
            style={{
              width: 180,
              height: 1000,
              objectFit: "contain",
              mixBlendMode: "multiply",
            }}
          />

        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ marginLeft: "auto" }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectable={false}
            items={menuItems}
            style={{
              background: "transparent",
              borderBottom: "none",
              display: "flex",
            }}
          />
        </div>

        {/* Mobile Hamburger */}
        <div className="mobile-menu" style={{ marginLeft: "auto" }}>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: "20px", color: "#fff" }} />}
            onClick={showDrawer}
          />
        </div>
      </Header>

      {/* Drawer for Mobile */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={onClose}
        open={open}
        bodyStyle={{ padding: 0 }}
      >
        <Menu mode="vertical" selectable={false} items={menuItems} />
      </Drawer>

      {/* Responsive CSS */}
      <style>
        {`
          @media (max-width: 768px) {
            .desktop-menu { display: none; }
            .mobile-menu { display: block; }
          }
          @media (min-width: 769px) {
            .desktop-menu { display: block; }
            .mobile-menu { display: none; }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
