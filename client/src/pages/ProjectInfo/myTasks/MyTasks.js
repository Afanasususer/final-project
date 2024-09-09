import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  Table,
  Select,
  Input,
  Button,
  message,
  Modal,
  Divider,
  Image,
  Tabs,
} from "antd";
import TaskForm from "../Tasks/TaskForm";
import { getDateFormat } from "../../../utils/helpers";
import { SetLoading } from "../../../redux/loadersSlice";
import { GetAllTasks } from "../../../apicalls/tasks";

const { Option } = Select;
const { TabPane } = Tabs;

function MyTasks({ project }) {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
  });
  const [showViewTask, setShowViewTask] = useState(false);
  const { user } = useSelector((state) => state.users);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [task, setTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorities, setPriorities] = useState(() => {
    const savedPriorities = localStorage.getItem("priorities");
    return savedPriorities ? JSON.parse(savedPriorities) : {};
  });

  const dispatch = useDispatch();

  const getTasks = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks({
        project: project._id,
        assignedTo: user._id,
        ...filters,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        let fetchedTasks = response.data;

        // Update fetched tasks with priorities from localStorage
        fetchedTasks = fetchedTasks.map((task) => ({
          ...task,
          priority: priorities[task._id] || task.priority || "medium",
        }));

        setTasks(fetchedTasks);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const onPriorityUpdate = (taskId, priority) => {
    const updatedPriorities = { ...priorities, [taskId]: priority };
    setPriorities(updatedPriorities);
    localStorage.setItem("priorities", JSON.stringify(updatedPriorities));

    // Update the tasks state with the new priority
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, priority } : task
    );
    setTasks(updatedTasks);

    message.success("Priority updated successfully");
  };

  useEffect(() => {
    getTasks();
  }, [filters]);

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span
          className="underline text-[14px] cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200 font-semibold"
          onClick={() => {
            setTask(record);
            setShowViewTask(true);
          }}
        >
          {record.name}
        </span>
      ),
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy",
      render: (text, record) => {
        const assignedBy = record.assignedBy
          ? `${record.assignedBy.firstName} ${record.assignedBy.lastName}`
          : "Projectevo User";
        return assignedBy;
      },
    },
    {
      title: "Assigned On",
      dataIndex: "createdAt",
      render: (text, record) => getDateFormat(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => record.status,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (text, record) => (
        <Select
          value={priorities[record._id] || "medium"}
          onChange={(value) => onPriorityUpdate(record._id, value)}
          className="ml-2"
          style={{ width: 120 }}
        >
          <Option value="low">Low</Option>
          <Option value="medium">Medium</Option>
          <Option value="high">High</Option>
          <Option value="critical">Critical</Option>
        </Select>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      render: (deadline) => moment(deadline).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <Input
          placeholder="Search tasks by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="custom-input mr-8 p-2 border rounded-lg shadow-sm hover:border-blue-400 focus:border-blue-500 transition duration-200"
        />
        <div className="flex items-center">
          <span className="text-gray-600">Priority:</span>
          <Select
            value={filters.priority}
            onChange={(value) => setFilters({ ...filters, priority: value })}
            className="ml-2"
            style={{ width: 150 }}
          >
            <Option value="all">All</Option>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
            <Option value="critical">Critical</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTasks}
        className="mt-5"
        pagination={{ pageSize: 4 }}
      />

      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
          reloadData={getTasks}
          task={task}
        />
      )}

      {showViewTask && (
        <Modal
          title={
            <span className="text-lg font-semibold text-gray-700">
              Task Details
            </span>
          }
          open={showViewTask}
          onCancel={() => setShowViewTask(false)}
          centered
          footer={null}
          width={700}
          bodyStyle={{ padding: "20px" }}
        >
          <Divider />
          <Tabs defaultActiveKey="1" className="custom-tabs" centered>
            <TabPane
              tab={
                <span className="text-base font-medium ant-tabs-tab">
                  Details
                </span>
              }
              key="1"
            >
              <div className="flex flex-col space-y-2">
                <span className="text-lg font-semibold text-primary">
                  {task.name}
                </span>
                <span className="text-sm text-gray-500">
                  {task.description}
                </span>
              </div>
            </TabPane>
            {task.attachments && task.attachments.length > 0 && (
              <TabPane
                tab={
                  <span className="text-base font-medium ant-tabs-tab">
                    Attachments
                  </span>
                }
                key="2"
              >
                <div
                  className="flex flex-wrap gap-4 mt-2"
                  style={{ maxHeight: "60vh", overflowY: "auto" }}
                >
                  <Image.PreviewGroup>
                    {task.attachments.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`attachment-${index}`}
                        className="w-32 h-32 object-cover mt-2 p-1 border border-solid rounded border-gray-300 shadow-sm"
                      />
                    ))}
                  </Image.PreviewGroup>
                </div>
              </TabPane>
            )}
          </Tabs>
        </Modal>
      )}
    </div>
  );
}

export default MyTasks;
