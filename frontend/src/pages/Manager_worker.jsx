import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Card, Spin, message, Popconfirm } from "antd";
import axios from "axios";

export default function ManagerWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("https://lief-clock-app.onrender.com/api/manager/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const workerData = res.data.workers.map((w, index) => ({
        key: w.email, // use email as key for deletion
        name: w.name,
        email: w.email,
        role: w.role,
        status: w.permitted ? "Active" : "Inactive",
        joinDate: new Date(w.createdAt).toLocaleDateString(),
      }));

      setWorkers(workerData);
    } catch (err) {
      console.error("Error fetching workers:", err);
      message.error("Failed to load workers list");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (workerEmail) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/manager/workers/${workerEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Worker removed successfully");
      setWorkers((prev) => prev.filter((w) => w.key !== workerEmail));
    } catch (err) {
      console.error("Error removing worker:", err);
      message.error("Failed to remove worker");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
    { title: "Join Date", dataIndex: "joinDate", key: "joinDate" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Remove Worker"
          description="Are you sure you want to remove this worker?"
          onConfirm={() => handleRemove(record.email)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            Remove
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title="👥 Workers List" style={{ margin: 20, minHeight: "90vh" }}>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      ) : (
        <Table
          columns={columns}
          dataSource={workers}
          bordered
          pagination={{ pageSize: 5 }}
        />
      )}
    </Card>
  );
}
