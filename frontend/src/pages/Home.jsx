import React from "react";
import { Row, Col, Button, Typography, Card } from "antd";
import { ClockCircleOutlined, TeamOutlined, BarChartOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #002766, #1890ff)",
        minHeight: "100vh",
        color: "white",
        overflowX: "hidden", // prevents right-side extra space
        width: "100%",
      }}
    >
      {/* Hero Section */}
      <Row
        justify="center"
        align="middle"
        style={{
          textAlign: "center",
          margin: 0, // removes default row margin
        }}
      >
        <Col xs={24} md={16} style={{ padding: "40px 20px" }}>
          <Title
            level={1}
            style={{
              color: "white",
              fontWeight: "bold",
              marginBottom: 16,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Liefcare Clock-In App
          </Title>
          <Paragraph
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.9)",
              maxWidth: 700,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Your trusted partner for time tracking in healthcare.  
            Manage attendance, track hours, and streamline shift operations — anywhere, anytime.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            href="/login"
            style={{
              marginTop: 30,
              borderRadius: "8px",
              padding: "0 40px",
              fontSize: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              background: "#40a9ff",
              border: "none",
            }}
          >
            Login to Your Account
          </Button>
        </Col>
      </Row>

      {/* Features Section */}
      <Row
        gutter={[24, 24]}
        justify="center"
        style={{
          padding: "60px 20px",
          margin: 0, // fix spacing issue
          maxWidth: 1200,
          marginInline: "auto", // center the content
        }}
      >
        {[
          {
            icon: <ClockCircleOutlined style={{ fontSize: "40px", color: "#fff" }} />,
            title: "For Workers",
            desc: "Clock in/out quickly, track hours accurately, and keep a secure history of your work shifts.",
          },
          {
            icon: <TeamOutlined style={{ fontSize: "40px", color: "#fff" }} />,
            title: "For Managers",
            desc: "Manage your workforce with ease, approve attendance records, and optimize staffing schedules.",
          },
          {
            icon: <BarChartOutlined style={{ fontSize: "40px", color: "#fff" }} />,
            title: "Real-time Insights",
            desc: "Access live data and reports to make quick, informed staffing and payroll decisions.",
          },
        ].map((feature, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              hoverable
              bordered={false}
              style={{
                textAlign: "center",
                minHeight: 260,
                borderRadius: 16,
                background: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                color: "white",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div style={{ marginBottom: 15 }}>{feature.icon}</div>
              <Title level={4} style={{ color: "white" }}>
                {feature.title}
              </Title>
              <Paragraph style={{ color: "rgba(255,255,255,0.85)" }}>
                {feature.desc}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
