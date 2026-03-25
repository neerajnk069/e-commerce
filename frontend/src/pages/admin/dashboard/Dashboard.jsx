import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import socket from "../../../socket";

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    monthlySales: [],
  });

  useEffect(() => {
    if (!auth) {
      navigate("/", { replace: true });
    }
  }, [auth, navigate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // admin data

    if (user) {
      socket.emit("registerUser", {
        userId: user._id,
        role: user.role, // 0 = admin
      });
    }
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = auth?.token;

        const res = await axios.get(
          "http://localhost:8000/api/adminDashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (res.data.success) {
          setData({
            totalUsers: res.data.body.totalUsers || 0,
            totalOrders:
              res.data.body.pendingOrders +
                res.data.body.deliveredOrders +
                res.data.body.cancelledOrders || 0,
            totalRevenue:
              res.data.body.monthlySales.reduce(
                (sum, m) => sum + m.revenue,
                0,
              ) || 0,
            pendingOrders: res.data.body.pendingOrders,
            deliveredOrders: res.data.body.deliveredOrders,
            cancelledOrders: res.data.body.cancelledOrders,
            monthlySales: res.data.body.monthlySales,
          });
        }
      } catch (err) {
        console.log("Dashboard Error:", err);
      }
    };

    fetchDashboard();
  }, []);

  // Pie Chart Data
  const pieData = [
    { name: "Pending", value: data.pendingOrders },
    { name: "Delivered", value: data.deliveredOrders },
    { name: "Cancelled", value: data.cancelledOrders },
  ];

  const COLORS = ["#ffbb33", "#00C49F", "#FF4444"];

  return (
    <div className="container-fluid py-2">
      <div className="row">
        <div className="ms-3">
          <h3 className="mb-0 h4 font-weight-bolder">Dashboard</h3>
          <p className="mb-4">
            Check your store analytics, orders, and revenue summary.
          </p>
        </div>

        {/* Cards */}
        <div className="col-xl-3 col-sm-6 mb-4">
          <Link to="/user" style={{ textDecoration: "none" }}>
            <div className="card">
              <div className="card-header p-2 ps-3">
                <p className="text-sm mb-0 text-capitalize">Total Users</p>
                <h4 className="mb-0">{data.totalUsers}</h4>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-xl-3 col-sm-6 mb-4">
          <Link to="/order" style={{ textDecoration: "none" }}>
            <div className="card">
              <div className="card-header p-2 ps-3">
                <p className="text-sm mb-0 text-capitalize">Total Orders</p>
                <h4 className="mb-0">{data.totalOrders}</h4>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-xl-3 col-sm-6 mb-4">
          <div className="card">
            <div className="card-header p-2 ps-3">
              <p className="text-sm mb-0 text-capitalize">Revenue</p>
              <h4 className="mb-0">₹ {data.totalRevenue}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row mt-4">
        {/* Pie Chart */}
        <div className="col-xl-4 col-lg-6">
          <div className="card p-3">
            <h5 className="mb-3 text-center">Order Status</h5>
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                cx={150}
                cy={150}
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-xl-8 col-lg-6">
          <div className="card p-3">
            <h5 className="mb-3 text-center">Monthly Sales</h5>
            <BarChart
              width={600}
              height={300}
              data={data.monthlySales}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#82ca9d" />

              <Bar dataKey="revenue" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
