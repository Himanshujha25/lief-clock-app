// src/pages/WorkerAttendance.jsx
import React, { useEffect, useState } from "react";
import { Table, Card, Spin, message } from "antd";

export default function WorkerAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/my-attendance", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // send JWT
      },

    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error fetching attendance");
        }
        setAttendanceData(data.attendance || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Attendance fetch error:", err);
        message.error(err.message);
        setLoading(false);
      });
  }, []);

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Sessions",
      dataIndex: "sessions",
      key: "sessions",
      render: (sessions) => (
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {sessions.map((s, idx) => (
            <li key={idx}>
              <strong>In:</strong> {s.clockIn || "N/A"} <br />
              <strong>Out:</strong> {s.clockOut || "N/A"} <br />
              <strong>Duration:</strong> {s.duration}
              {s.note && <em style={{ color: "red" }}> ({s.note})</em>}
            </li>
          ))}
        </ul>
      ),
    },
    { title: "Total Hours", dataIndex: "totalHours", key: "totalHours" },
  ];

  return (
    <Card title="📅 My Attendance" style={{ margin: 20, minHeight: "90vh" }}>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Table
          columns={columns}
          dataSource={attendanceData.map((item, idx) => ({
            ...item,
            key: idx,
          }))}
          bordered
          pagination={{ pageSize: 7 }}
        />
      )}
    </Card>
  );
}
