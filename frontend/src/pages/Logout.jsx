// src/components/LogoutButton.jsx
import React from "react";
import { Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    message.success("Logged out successfully");
    navigate("/"); // redirect to home/login
  };

  return (
    <Button
      type="primary"
      danger
      icon={<LogoutOutlined />}
      onClick={handleLogout}
      style={{
        backgroundColor: "red",
        borderColor: "red",
        fontWeight: "bold",
      }}
    >
      Logout
    </Button>
  );
}
