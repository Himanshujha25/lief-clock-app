// src/pages/WorkerProfile.jsx
import React, { useEffect, useState } from "react";
import { Card, Avatar, Descriptions, Spin, message, Button, Statistic, Row, Col } from "antd";
import { UserOutlined, MailOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";

export default function WorkerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching profile");
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        message.error(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  }

  if (!profile) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>No profile data found.</p>;
  }

  return (
    <Card
      style={{
        margin: 20,
        minHeight: "90vh",
        borderRadius: 10,
        boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
      }}
      title="👤 My Profile"
    >
      <Row gutter={16}>
        {/* Avatar + Name */}
        <Col xs={24} sm={8} style={{ textAlign: "center" }}>
          <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: "#87d068" }} />
          <h2 style={{ marginTop: 10 }}>{profile.name}</h2>
          <p style={{ color: "gray" }}>{profile.role}</p>
          <Button type="primary" style={{ marginTop: 10 }}>Edit Profile</Button>
        </Col>

        {/* Profile Details */}
        <Col xs={24} sm={16}>
          <Descriptions
            title="Personal Information"
            bordered
            column={1}
            style={{ marginBottom: 20 }}
          >
            <Descriptions.Item label={<><MailOutlined /> Email</>}>
              {profile.email}
            </Descriptions.Item>
            <Descriptions.Item label={<><CalendarOutlined /> Joined On</>}>
              {new Date(profile.createdAt).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label={<><ClockCircleOutlined /> Last Login</>}>
              {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "N/A"}
            </Descriptions.Item>
          </Descriptions>

          {/* Stats Section */}
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Total Hours Worked" value={profile.totalHours || 0} suffix="hrs" />
            </Col>
            <Col span={8}>
              <Statistic title="Days Present" value={profile.daysPresent || 0} />
            </Col>
            <Col span={8}>
              <Statistic title="Leaves Taken" value={profile.leavesTaken || 0} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
