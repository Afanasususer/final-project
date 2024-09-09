// dashboard/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Card, Statistic, Table, Divider } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { UserOutlined, ProjectOutlined, TeamOutlined } from '@ant-design/icons';
import { GetAllTasks } from "../../../apicalls/tasks";
import { SetLoading } from "../../../redux/loadersSlice";
import moment from "moment";

const Dashboard = ({ project }) => {
  const [tasks, setTasks] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    if (project) {
      getTasks();
    }
  }, [project]);

  const getTasks = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks({ project: project._id });
      dispatch(SetLoading(false));
      if (response.success) {
        setTasks(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      console.error(error);
    }
  };

  const taskData = tasks.map((task) => ({
    key: task._id,
    name: task.name,
    status: task.status,
    assignedBy: task.assignedBy ? `${task.assignedBy.firstName} ${task.assignedBy.lastName}` : "Unknown",
    assignedTo: task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : "Unknown",
    deadline: moment(task.deadline).format("YYYY-MM-DD HH:mm:ss"),
  }));

  const adminCount = project?.members?.filter((member) => member.role === "admin").length || 0;
  const employeeCount = project?.members?.filter((member) => member.role === "employee").length || 0;

  const tasksByAdmin = tasks.reduce((acc, task) => {
    const adminName = task.assignedBy ? `${task.assignedBy.firstName} ${task.assignedBy.lastName}` : "Unknown";
    if (!acc[adminName]) {
      acc[adminName] = 0;
    }
    acc[adminName]++;
    return acc;
  }, {});

  const tasksByAdminData = Object.keys(tasksByAdmin).map((admin) => ({
    name: admin,
    value: tasksByAdmin[admin],
  }));

  // Prepare data for the new chart
  const totalTasks = tasks.length;
  const progressData = tasks
    .filter(task => task.status === 'closed')
    .reduce((acc, task) => {
      const date = moment(task.closedAt || task.updatedAt).format("YYYY-MM-DD");
      const existingEntry = acc.find(entry => entry.date === date);
      if (existingEntry) {
        existingEntry.closedCount++;
      } else {
        acc.push({ date, closedCount: 1 });
      }
      return acc;
    }, [])
    .map((entry, index, array) => {
      const cumulativeClosed = array.slice(0, index + 1).reduce((sum, e) => sum + e.closedCount, 0);
      return {
        date: entry.date,
        percentComplete: (cumulativeClosed / totalTasks) * 100,
        cumulativeClosed,
      };
    });

  // Calculate task status percentages
  const statusCounts = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = 0;
    }
    acc[task.status]++;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(status => ({
    status,
    percent: (statusCounts[status] / totalTasks) * 100,
  }));

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Admins" value={adminCount} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Employees" value={employeeCount} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total Tasks" value={tasks.length} prefix={<ProjectOutlined />} />
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Tasks Assigned by Admin">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={tasksByAdminData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
                  {tasksByAdminData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Project Progress Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                <Tooltip formatter={(value, name) => name === "percentComplete" ? `${value.toFixed(2)}%` : value} />
                <Legend />
                <Line type="monotone" dataKey="percentComplete" stroke="#8884d8" name="Percent Complete" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="cumulativeClosed" stroke="#82ca9d" name="Cumulative Closed Tasks" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Task Status Overview">
            <ResponsiveContainer width="95%" height={300}>
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                <YAxis type="category" dataKey="status" />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Bar dataKey="percent" fill="#8884d8" label={{ position: 'inside', fill: '#fff', formatter: (value) => `${value.toFixed(2)}%` }}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Card title="Task Details">
        <Table
          columns={[
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Status', dataIndex: 'status', key: 'status' },
            { title: 'Assigned By', dataIndex: 'assignedBy', key: 'assignedBy' },
            { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo' },
            { title: 'Deadline', dataIndex: 'deadline', key: 'deadline' },
          ]}
          dataSource={taskData}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}

export default Dashboard;
//  hna mn ba3d ma bedlt dak chart li makontch fahmo b wahed akhor dyal lprogress >> & zedt akhor fih 
// kola status ch7al nissba dyalha 

//  li 9bl mn had lcode houa lassli li 9bl .. .. .. 