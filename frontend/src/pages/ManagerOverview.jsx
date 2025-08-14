import React, { useEffect, useState } from "react";
import { Card, Typography, Spin, Table } from "antd";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle } = Typography;

export default function ManagerOverview() {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/manager/overview", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOverviewData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) return <Spin />;

  if (!overviewData) return <p>Error loading data</p>;

  const { avgHoursPerDay, peoplePerDay, totalHoursPerStaff } = overviewData;

  return (
    <div style={{ padding: 24 }}>
      <AntTitle level={3}>Manager Dashboard Overview</AntTitle>

      {/* Average Hours Per Day */}
      <Card style={{ marginBottom: 24 }}>
        <AntTitle level={4}>Average Hours per Person Each Day</AntTitle>
        <Line
          data={{
            labels: avgHoursPerDay.map((d) => d.date),
            datasets: [
              {
                label: "Avg Hours",
                data: avgHoursPerDay.map((d) => d.avgHours),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.3
              }
            ]
          }}
        />
      </Card>

      {/* People Clocking Each Day */}
      <Card style={{ marginBottom: 24 }}>
        <AntTitle level={4}>Number of People Clocking In Each Day</AntTitle>
        <Bar
          data={{
            labels: peoplePerDay.map((d) => d.date),
            datasets: [
              {
                label: "People Count",
                data: peoplePerDay.map((d) => d.count),
                backgroundColor: "rgba(153, 102, 255, 0.6)"
              }
            ]
          }}
        />
      </Card>

      {/* Total Hours Per Staff */}
      <Card>
        <AntTitle level={4}>Total Hours Worked Per Staff (Last 7 Days)</AntTitle>
        <Table
          columns={[
            { title: "Staff Name", dataIndex: "name", key: "name" },
            { title: "Total Hours", dataIndex: "totalHours", key: "totalHours" }
          ]}
          dataSource={totalHoursPerStaff.map((s, i) => ({
            key: i,
            ...s
          }))}
          pagination={false}
        />
      </Card>
    </div>
  );
}
