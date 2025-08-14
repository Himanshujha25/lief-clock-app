import React, { useState } from "react";
import { Button, Typography, InputNumber, message } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

export default function SetLocation() {
  const [coords, setCoords] = useState(null);
  const [radius, setRadius] = useState(1000); // default radius
  const [loading, setLoading] = useState(false);

  const handleSetLocation = () => {
    if (!navigator.geolocation) {
      message.error("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCoords({ latitude, longitude });

        try {
          const token = localStorage.getItem("token"); // Manager's JWT

          await axios.post(
            "https://lief-clock-app.onrender.com/api/manager/set-location",
            { latitude, longitude, radius },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          message.success("Location saved successfully!");
        } catch (err) {
          console.error(err);
          message.error(err.response?.data?.message || "Failed to save location.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        message.error("Unable to fetch location: " + error.message);
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Set Manager Location</Title>

      <div style={{ marginBottom: 16 }}>
        <Text strong>Radius (meters): </Text>
        <InputNumber
          min={100}
          max={10000}
          value={radius}
          onChange={(value) => setRadius(value)}
        />
      </div>

      <Button type="primary" onClick={handleSetLocation} loading={loading} style={{ marginBottom: 16 }}>
        Set Location
      </Button>

      {coords && (
        <div>
          <Text strong>Latitude:</Text> {coords.latitude} <br />
          <Text strong>Longitude:</Text> {coords.longitude}
        </div>
      )}
    </div>
  );
}
