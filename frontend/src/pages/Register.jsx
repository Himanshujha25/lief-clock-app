import React, { useState } from "react";
import { Form, Input, Button, Select, Typography,message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
 import axios from "axios";
const { Title, Text, Link } = Typography;
const { Option } = Select;

export default function Register() {
  const [role, setRole] = useState("");




  const onFinish = async (values) => {
  console.log("Register Submitted:", values);

  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", values);

    message.success(response.data.message);

    // Store token in localStorage (optional)
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("managerEmail", response.data.managerEmail || "");
    localStorage.setItem("managerId", response.data.managerId || "");

    // Redirect user after registration
    if (response.data.role === "manager") {
      window.location.href = "/manager/dashboard";
    } else if (response.data.role === "worker") {
      window.location.href = "/worker/dashboard";
    }
  } catch (error) {
    if (error.response) {
      message.error(error.response.data.message);
    } else {
      message.error("Something went wrong. Try again.");
    }
  }
 };


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1890ff, #70c1ff)",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px 30px",
          maxWidth: 380,
          width: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <Title level={3} style={{ marginBottom: 24, color: "#1890ff" }}>
          Create Account
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Enter your full name" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Full Name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: "Select your role" }]}
          >
            <Select
              placeholder="Select Role"
              size="large"
              onChange={(value) => setRole(value)}
            >
              <Option value="worker">Worker</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>

          {role === "worker" && (
            <Form.Item
              name="managerEmail"
              rules={[{ required: true, type: "email", message: "Enter manager's email" }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Manager's Email"
                size="large"
              />
            </Form.Item>
          )}

          {role === "manager" && (
            <Form.Item
              name="managerCode"
              rules={[{ required: true, message: "Enter your manager code" }]}
            >
              <Input
                placeholder="Manager Code"
                size="large"
              />
            </Form.Item>
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            style={{ borderRadius: 8 }}
          >
            Register
          </Button>

          <Text style={{ display: "block", margin: "16px 0", color: "#999" }}>or</Text>

          <Link href="/login" style={{ fontSize: 14 }}>
            Already have an account? Login
          </Link>
        </Form>
      </div>
    </div>
  );
}
