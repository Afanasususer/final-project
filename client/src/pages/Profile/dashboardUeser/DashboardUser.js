import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Divider, Spin, Timeline } from "antd";
import {
  ProjectOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { getDashboardData } from "../../../apicalls/dashboard";
import "tailwindcss/tailwind.css";
import { Helmet } from "react-helmet-async";


const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardData(user._id);
        setData(result.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user._id) {
      fetchData();
    }
  }, [user._id]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (

  <>
    <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-r from-gray-100 via-white to-gray-100 p-6">
        <h1 className="text-4xl font-bold mb-6 text-black">Dashboard</h1>
        {data && (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card hoverable className="shadow-lg">
                  <Statistic title="Total Projects" value={data.totalProjects} prefix={<ProjectOutlined />} />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card hoverable className="shadow-lg">
                  <Statistic title="Owned Projects" value={data.ownedProjects} prefix={<UserOutlined />} />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card hoverable className="shadow-lg">
                  <Statistic title="Admin Projects" value={data.adminProjects} prefix={<TeamOutlined />} />
                </Card>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} md={8}>
                <Card hoverable className="shadow-lg">
                  <Statistic title="Employee Projects" value={data.employeeProjects} prefix={<TeamOutlined />} />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card hoverable className="shadow-lg">
                  <Statistic title="Active Projects" value={data.activeProjects} prefix={<CheckCircleOutlined />} />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card hoverable className="shadow-lg">
                  <Statistic title="Inactive Projects" value={data.inactiveProjects} prefix={<ClockCircleOutlined />} />
                </Card>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24} lg={12}>
                <Card hoverable className="shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Project Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.projectStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.projectStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card hoverable className="shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.taskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#82ca9d"
                        dataKey="value"
                      >
                        {data.taskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24}>
                <Card hoverable className="shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Scheduled Tasks</h3>
                  <Statistic title="Total Scheduled Tasks" value={data.scheduledTasks.length} prefix={<CalendarOutlined />} />
                  <Timeline>
                    {data.scheduledTasks.map((task, index) => (
                      <Timeline.Item key={index}>
                        {new Date(task.scheduledTime).toLocaleString()} - {task.taskData.name}
                      </Timeline.Item>
                    ))}
                  </Timeline>
                  <p className="text-md mt-4">Interval: {data.scheduledTasksInterval}</p>
                </Card>
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={24}>
                <Card hoverable className="shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Account Management Tips</h3>
                  <ul className="list-disc pl-5">
                    <li>Review your scheduled tasks and prioritize them based on deadlines.</li>
                    <li>Regularly update your project statuses to keep track of progress.</li>
                    <li>Ensure all team members are assigned appropriate roles in projects.</li>
                    <li>Set aside time each week to review your project goals and milestones.</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
  </>
  );
};

export default Dashboard;
