import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Tag,
  Select,
} from "antd";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import {
  GetScheduledTasks,
  DeleteScheduledTask,
  UpdateScheduledTask,
} from "../../../apicalls/tasks";
import { useNavigate } from "react-router-dom";
import { Pie } from "@ant-design/charts";

import moment from "moment";

const { Option } = Select;

function ScheduledTasksPage() {
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isStatisticsModalVisible, setIsStatisticsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchScheduledTasks = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetScheduledTasks();
      dispatch(SetLoading(false));
      if (response.success) {
        // Sort tasks by scheduled time in descending order
        const sortedTasks = response.data.sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
        setScheduledTasks(sortedTasks || []);
        setFilteredTasks(sortedTasks || []);
      } else {
        message.error(response.message || "Failed to fetch scheduled tasks");
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };
  

  useEffect(() => {
    fetchScheduledTasks();
  }, []);

  useEffect(() => {
    let filtered = scheduledTasks;

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.taskData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.taskData.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((task) => {
        if (statusFilter === "created") return task.created;
        if (statusFilter === "pending") return !task.created;
        return true;
      });
    }

    if (priorityFilter) {
      filtered = filtered.filter(
        (task) => task.taskData.priority === priorityFilter
      );
    }

    setFilteredTasks(filtered);
  }, [searchTerm, statusFilter, priorityFilter, scheduledTasks]);

  const handleDelete = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteScheduledTask(id);
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
        fetchScheduledTasks();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleUpdate = async (values) => {
    try {
      dispatch(SetLoading(true));
      const updatedTask = {
        ...editTask,
        scheduledTime: values.scheduledTime.format("YYYY-MM-DD HH:mm:ss"),
        taskData: {
          ...editTask.taskData,
          ...values,
        },
      };
      const response = await UpdateScheduledTask(updatedTask);
      dispatch(SetLoading(false));
      if (response.success) {
        message.success(response.message);
        fetchScheduledTasks();
        setShowModal(false);
      } else {
        message.error(response.message);
      }
      window.location.reload();
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const handlePriorityChange = async (task, priority) => {
    try {
      dispatch(SetLoading(true));
      const updatedTask = { ...task, taskData: { ...task.taskData, priority } };
      const response = await UpdateScheduledTask(updatedTask);
      dispatch(SetLoading(false));
      if (response.success) {
        message.success("Priority updated successfully");
        fetchScheduledTasks();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };
  

  const truncateDescription = (description) => {
    const maxLength = 50; // Adjust the max length as needed
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const countStatus = (status) => {
    return scheduledTasks.filter((task) => {
      if (status === "created") return task.created;
      if (status === "pending") return !task.created;
      return false;
    }).length;
  };

  const showStatisticsModal = () => {
    setIsStatisticsModalVisible(true);
  };
  
  const handleStatisticsModalOk = () => {
    setIsStatisticsModalVisible(false);
  };
  
  const handleStatisticsModalCancel = () => {
    setIsStatisticsModalVisible(false);
  };
  
  const statisticsData = [
    { type: 'Created', value: countStatus("created") },
    { type: 'Pending', value: countStatus("pending") },
  ];
  
  const pieConfig = {
    appendPadding: 10,
    data: statisticsData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
  };
  

  const columns = [
    {
      title: "Task Name",
      dataIndex: ["taskData", "name"],
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Task Description",
      dataIndex: ["taskData", "description"],
      render: (description) => (
        <div className="description-clamp">
          {truncateDescription(description)}
        </div>
      ),
    },
    {
      title: "Scheduled Time",
      dataIndex: "scheduledTime",
      render: (scheduledTime) =>
        moment(scheduledTime).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Priority",
      dataIndex: ["taskData", "priority"],
      render: (priority, task) => (
        <Select
          value={priority || "None"}
          onChange={(value) => handlePriorityChange(task, value)}
        >
          <Option value="None">None</Option>
          <Option value="High">High</Option>
          <Option value="Medium">Medium</Option>
          <Option value="Low">Low</Option>
        </Select>
      ),
    },
    {
      title: "Status",
      dataIndex: "created",
      render: (created) => (
        <Tag color={created ? "green" : "volcano"}>
          {created ? "Created" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div className="flex gap-2">
          {!record.created && (
            <Button
              type="link"
              onClick={() => handleEdit(record)}
              className="text-blue-500"
            >
              Edit
            </Button>
          )}
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Scheduled Tasks</h2>
      <div className="flex flex-col mb-4">
        <Input
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4"
          style={{ height: "40px" }}
        />
        <div className="flex justify-end items-center gap-4">
          <div className="flex items-center">
            <label className="mr-2">Status:</label>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              className="w-60"
              style={{ height: "40px" }}
            >
              <Option value="">All</Option>
              <Option value="pending">Pending</Option>
              <Option value="created">Created</Option>
            </Select>
          </div>
          <div className="flex items-center">
            <label className="mr-2">Priority:</label>
            <Select
              placeholder="Filter by priority"
              value={priorityFilter}
              onChange={(value) => setPriorityFilter(value)}
              className="w-60"
              style={{ height: "40px" }}
            >
              <Option value="">All</Option>
              <Option value="None">None</Option>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredTasks}
        rowKey="scheduledTime"
        pagination={{ pageSize: 4 }}
        className="mb-6"
      />
      <div className="flex justify-between items-center mb-4">
  <Button
    type="primary"
    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-200"
    onClick={() => navigate("/")}
  >
    Schedule a New Task
  </Button>
  <Button
    type="default"
    className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-600 transition duration-200"
    onClick={showStatisticsModal}
  >
    Statistics
  </Button>
</div>
<Modal
  title="Task Statistics"
  visible={isStatisticsModalVisible}
  onOk={handleStatisticsModalOk}
  onCancel={handleStatisticsModalCancel}
  footer={null}
  centered
  width={700}
  bodyStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}
>
  <div className="w-full h-full flex justify-center items-center">
    <Pie {...pieConfig} />
  </div>
</Modal>

      <Modal
        title="Edit Scheduled Task"
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          window.location.reload();
        }}
        footer={null}
        centered
      >
        <Form
          layout="vertical"
          initialValues={{
            name: editTask?.taskData?.name,
            description: editTask?.taskData?.description,
            scheduledTime: editTask ? moment(editTask.scheduledTime) : null,
          }}
          onFinish={handleUpdate}
        >
          <Form.Item label="Task Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Task Description" name="description">
            <Input.TextArea className="rounded-lg" />
          </Form.Item>
          <Form.Item label="Scheduled Time" name="scheduledTime">
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              className="w-full"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-200"
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <style jsx="true">{`
        .description-clamp {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          white-space: pre-wrap;
          max-width: 200px;
        }
      `}</style>
    </div>
  );
  
}

export default ScheduledTasksPage;
// that's the latest good one  .. .. 
//  daba ghadi ngad statistics .. .. 

//  sttistics done  .. .. lhamdullilah .. .. 