import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Space, message, Spin } from "antd";
import { ClockCircleOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // install via npm i jwt-decode

const { Title, Text } = Typography;

export default function ClockInOut() {
  const [time, setTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [userEmail, setUserEmail] = useState("");

  // Get user email from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email); // assuming your JWT has `email` field
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // Load saved clock-in state per user
  useEffect(() => {
    if (userEmail) {
      const savedStatus = localStorage.getItem(`isClockedIn_${userEmail}`);
      const savedLat = localStorage.getItem(`latitude_${userEmail}`);
      const savedLng = localStorage.getItem(`longitude_${userEmail}`);

      if (savedStatus === "true") {
        setIsClockedIn(true);
      }
      if (savedLat && savedLng) {
        setCoords({ latitude: parseFloat(savedLat), longitude: parseFloat(savedLng) });
      }
    }
  }, [userEmail]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Clock In
  const getLocationAndClockIn = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      message.error("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const token = localStorage.getItem("token");

          const res = await axios.post(
            "http://localhost:5000/api/clock/clock-in",
            { latitude, longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.status === 200) {
            setIsClockedIn(true);
            setCoords({ latitude, longitude });

            // Save per user
            localStorage.setItem(`isClockedIn_${userEmail}`, "true");
            localStorage.setItem(`latitude_${userEmail}`, latitude);
            localStorage.setItem(`longitude_${userEmail}`, longitude);

            message.success(res.data.message || "Clocked In Successfully!");
          }
        } catch (err) {
          message.error(err.response?.data?.message || "Clock In failed");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("❌ Geolocation error:", error);
        message.error("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  // Clock Out
  const handleClockOut = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://lief-clock-app.onrender.com/api/clock/clock-out",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setIsClockedIn(false);
        setCoords({ latitude: null, longitude: null });

        // Remove per user
        localStorage.removeItem(`isClockedIn_${userEmail}`);
        localStorage.removeItem(`latitude_${userEmail}`);
        localStorage.removeItem(`longitude_${userEmail}`);

        message.success(res.data.message || "Clocked Out Successfully!");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Clock Out failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Card
        style={{
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <ClockCircleOutlined style={{ fontSize: 50, color: "#1890ff" }} />
        <Title level={3} style={{ marginTop: 10 }}>
          Clock In / Clock Out
        </Title>

        <Text type="secondary" style={{ fontSize: 16 }}>
          {time.toLocaleDateString()} — {time.toLocaleTimeString()}
        </Text>

        {coords.latitude && coords.longitude && (
          <div style={{ marginTop: 10 }}>
            <Text type="secondary" style={{ display: "block" }}>
              📍 Lat: {coords.latitude}
            </Text>
            <Text type="secondary" style={{ display: "block" }}>
              📍 Lng: {coords.longitude}
            </Text>
          </div>
        )}

        <div style={{ margin: "20px 0" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isClockedIn ? "green" : "red",
            }}
          >
            {isClockedIn ? "You are Clocked In" : "You are Clocked Out"}
          </Text>
        </div>

        <Space direction="vertical" style={{ width: "100%" }}>
          {!isClockedIn ? (
            <Button
              type="primary"
              size="large"
              icon={<LoginOutlined />}
              onClick={getLocationAndClockIn}
              block
              style={{ borderRadius: 8 }}
              disabled={loading}
            >
              {loading ? <Spin /> : "Clock In"}
            </Button>
          ) : (
            <Button
              danger
              size="large"
              icon={<LogoutOutlined />}
              onClick={handleClockOut}
              block
              style={{ borderRadius: 8 }}
            >
              Clock Out
            </Button>
          )}
        </Space>
      </Card>
    </div>
  );
}
