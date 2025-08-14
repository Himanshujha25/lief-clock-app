// src/pages/ManagerAttendance.jsx
import React, { useState } from "react";
import { Card, Input, Button, Table, Spin, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ManagerAttendance() {
  const [email, setEmail] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchAttendance = async () => {
  if (!email) {
    message.warning("Please enter worker's email");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`http://localhost:5000/api/manager/workers?email=${encodeURIComponent(email)}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});


    const contentType = res.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      message.error("Server returned an unexpected response.");
      setAttendanceData([]);
      setLoading(false);
      return;
    }

    if (!res.ok) {
      message.error(data.message || "Failed to fetch attendance");
      setAttendanceData([]);
    } else {
      setAttendanceData(data);
    }
  } catch (err) {
    console.error(err);
    message.error("Error fetching attendance");
  } finally {
    setLoading(false);
  }
};


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

  // Chart.js Data
  const chartData = {
    labels: attendanceData.map(item => item.date),
    datasets: [
      {
        label: "Total Hours Worked",
        data: attendanceData.map(item => parseFloat(item.totalHours)),
        backgroundColor: "rgba(24, 144, 255, 0.6)",
        borderColor: "rgba(24, 144, 255, 1)",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Attendance Overview (Hours per Day)",
        font: { size: 18 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value} hrs`
        }
      }
    }
  };

  return (
    <Card title="📊 Manager Attendance Search" style={{ margin: 20 }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: 20 }}>
        <Input
          placeholder="Enter worker's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={fetchAttendance}>
          Search
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <>
          {attendanceData.length > 0 && (
            <>
              <div style={{ background: "#fff", padding: 20, marginBottom: 20, borderRadius: 8 }}>
                <Bar data={chartData} options={chartOptions} />
              </div>

              <Table
                columns={columns}
                dataSource={attendanceData.map((item, idx) => ({
                  ...item,
                  key: idx,
                }))}
                bordered
                pagination={{ pageSize: 7 }}
              />
            </>
          )}
        </>
      )}
    </Card>
  );
}
