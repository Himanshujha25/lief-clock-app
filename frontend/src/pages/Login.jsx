import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { LockOutlined, MailOutlined, GoogleOutlined } from "@ant-design/icons";
import axios from "axios";
const { Title, Text, Link } = Typography;

export default function Login() {

const onFinish = async (values) => {
  console.log("Login Submitted:", values);

  try {
    const response = await axios.post("https://lief-clock-app.onrender.com/api/auth/login", values);
    
    // Example: store token in localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);

    message.success("Login successful!");

    // Redirect user after login based on role
    if (response.data.role === "manager") {
      window.location.href = "/manager/dashboard";
    } else if (response.data.role === "worker") {
      window.location.href = "/worker/dashboard";
    }
  } catch (error) {
    if (error.response) {
      // Backend returned an error message
      message.error(error.response.data.message);
    } else {
      message.error("Something went wrong. Try again.");
    }
  }
};


  const handleGoogleLogin = () => {
    window.location.href = "https://lief-clock-app.onrender.com/auth/google";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1890ff, #70c1ff)", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "40px 30px", maxWidth: 380, width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <Title level={3} style={{ marginBottom: 24, color: "#1890ff" }}>Login</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Enter your password" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <div style={{ textAlign: "right", marginBottom: 12 }}>
            <Link href="#" style={{ fontSize: 14 }}>Forgot password?</Link>
          </div>

          <Button type="primary" htmlType="submit" size="large" block style={{ borderRadius: 8 }}>
            Login
          </Button>

          <Text style={{ display: "block", margin: "16px 0", color: "#999" }}>or</Text>

          <Button
            icon={<GoogleOutlined />}
            size="large"
            block
            style={{ backgroundColor: "#db4437", color: "#fff", borderRadius: 8 }}
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>

          <div style={{ marginTop: 16 }}>
            <Link href="/register" style={{ fontSize: 14 }}>
              Create an account
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
