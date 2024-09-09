import moment from "moment";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import ProjectStatistics from "../../../components/ProjectStatistics";

import {
  Button,
  message,
  Modal,
  Table,
  Select,
  Tabs,
  Image,
  Input,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteTask, GetAllTasks, UpdateTask } from "../../../apicalls/tasks";
// hada zedto lcheckbox
import { UpdateProjectStatus } from "../../../apicalls/projects";
import { SetLoading } from "../../../redux/loadersSlice";
import { getDateFormat } from "../../../utils/helpers";
import Divider from "../../../components/Divider";
import TaskForm from "./TaskForm";
import { AddNotification } from "../../../apicalls/notifications";
const { Option } = Select; // Destructure Option from Select
const { TabPane } = Tabs;

function Tasks({ project }) {
  const [filters, setFilters] = useState({
    status: "all",
    assignedTo: "all",
    assignedBy: "all",
  });
  const [showViewTask, setShowViewTask] = React.useState(false);
  const { user } = useSelector((state) => state.users);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [task, setTask] = React.useState(null);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  //  hado bc hyrloade only lcomponenet

  const dispatch = useDispatch();

  // Load notifiedTaskIds from local storage
  const [notifiedTaskIds, setNotifiedTaskIds] = useState(() => {
    const savedNotifiedTaskIds = localStorage.getItem("notifiedTaskIds");
    return new Set(
      savedNotifiedTaskIds ? JSON.parse(savedNotifiedTaskIds) : []
    );
  });

  const isOwner = project.members.some(
    (member) => member.role === "owner" && member.user._id === user._id
  );
  const isEmployee = project.members.some(
    (member) => member.role === "employee" && member.user._id === user._id
  );

  //  hadi talta bch nsared notif w ghir mera wehda
  const getTasks = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks({
        project: project._id,
        ...filters,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        const fetchedTasks = response.data;
        setTasks(fetchedTasks);

        // Check for tasks with past deadlines and notify
        const currentDate = moment();
        const newNotifiedTaskIds = new Set(notifiedTaskIds);

        fetchedTasks.forEach((task) => {
          const taskDeadline = moment(task.deadline);
          if (
            currentDate.isAfter(taskDeadline) &&
            task.status !== "completed" &&
            task.status !== "closed"
          ) {
            if (!newNotifiedTaskIds.has(task._id)) {
              // Log task info for debugging
              console.log(
                `Notifying for task: ${task.name}, assigned by: ${task.assignedBy._id}, assigned to: ${task.assignedTo._id}`
              );

              // Ensure notifications are sent to unique users
              const uniqueUsers = new Set();

              if (task.assignedBy._id !== task.assignedTo._id) {
                uniqueUsers.add(task.assignedBy._id);
              }
              uniqueUsers.add(task.assignedTo._id);

              uniqueUsers.forEach((userId) => {
                AddNotification({
                  title: "Task Deadline Passed",
                  description: `The deadline for task "${task.name}" has passed and it is not completed.`,
                  user: userId,
                  onClick: `/project/${project._id}`,
                });
              });

              newNotifiedTaskIds.add(task._id);
            }
          }
        });

        setNotifiedTaskIds(newNotifiedTaskIds);
        localStorage.setItem(
          "notifiedTaskIds",
          JSON.stringify(Array.from(newNotifiedTaskIds))
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const taskToDelete = tasks.find((task) => task._id === id);
      if (
        !isOwner &&
        taskToDelete.assignedTo._id !== user._id &&
        taskToDelete.assignedBy._id !== user._id
      ) {
        message.error("You are not authorized to make this action");
        return;
      }
      dispatch(SetLoading(true));
      const response = await DeleteTask(id);
      if (response.success) {
        getTasks();
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  // for check box
  const handleProjectStatusChange = async (e) => {
    const newStatus = e.target.checked ? "complete" : "active";
    try {
      dispatch(SetLoading(true));
      const response = await UpdateProjectStatus(project._id, newStatus);
      dispatch(SetLoading(false));
      if (response.success) {
        message.success("Project status updated successfully");
        window.location.reload();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async ({ task, status }) => {
    try {
      const isAssignedByCurrentUser = task.assignedBy._id === user._id;
      const isAssignedToCurrentUser = task.assignedTo._id === user._id;

      // Check if the current user is the assigner
      const isCurrentUserAssigner = task.assignedBy._id === user._id;

      // Allow the owner to update the task status to closed
      if (!isOwner && !isAssignedByCurrentUser && !isAssignedToCurrentUser) {
        message.error("You are not authorized to make this action");
        return;
      }

      dispatch(SetLoading(true));
      const response = await UpdateTask({
        _id: task._id,
        status,
      });

      if (response.success) {
        getTasks();
        message.success(response.message);

        // Send notifications accordingly, excluding assigner
        if (!isCurrentUserAssigner) {
          AddNotification({
            title: "Task Status Updated",
            description: `${task.name} status has been updated to ${status}`,
            user: task.assignedBy._id,
            onClick: `/project/${project._id}`,
          });
        }

        if (task.assignedTo && task.assignedTo._id !== user._id) {
          AddNotification({
            title: "Task Status Updated",
            description: `${task.name} status has been updated to ${status}`,
            user: task.assignedTo._id,
            onClick: `/project/${project._id}`,
          });
        }
      } else {
        throw new Error(response.message);
      }

      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  // hadi for disable status

  // *******************************************

  // React.useEffect(() => {
  //   getTasks();
  // }, []);
  

  // useEffect(() => {
  //   let filtered = tasks;

  //   if (searchTerm) {
  //     filtered = filtered.filter((task) =>
  //       task.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   setTasks(filtered);
  // }, [searchTerm, tasks]);



  useEffect(() => {
    getTasks();
  }, [filters]);


  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // column after design
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
      title: "Assigned To",
      dataIndex: "assignedTo",
      render: (text, record) => {
        const assignedTo = record.assignedTo
          ? `${record.assignedTo.firstName} ${record.assignedTo.lastName}`
          : "Projectevo User";
        return assignedTo;
      },
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
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline) => moment(deadline).format("YYYY-MM-DD HH:mm:ss"),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        const currentDate = moment();
        const taskDeadline = moment(record.deadline);
        const isPastDeadline =
          currentDate.isAfter(taskDeadline) &&
          record.status !== "completed" &&
          record.status !== "closed";
  
        const canChangeStatus =
          (record.status !== "closed" ||
            record.assignedBy._id === user._id ||
            isOwner) &&
          !isPastDeadline;
  
        return (
          <Select
            value={record.status}
            onChange={(value) => {
              onStatusUpdate({
                task: record,
                status: value,
              });
            }}
            disabled={!canChangeStatus}
            className="ml-2"
            style={{ width: 150 }}
          >
            <Option value="pending">Pending</Option>
            <Option value="inprogress">In Progress</Option>
            <Option value="completed">Completed</Option>
            {(record.assignedBy._id === user._id || isOwner) && (
              <Option value="closed">Closed</Option>
            )}
          </Select>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const isAuthorized =
          (record.assignedTo && record.assignedTo._id === user._id) ||
          (record.assignedBy && record.assignedBy._id === user._id) ||
          isOwner;
        const isAdminTask = project.members.some(
          (member) =>
            member.user._id ===
              (record.assignedTo ? record.assignedTo._id : null) &&
            member.role === "admin"
        );
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              className="custom-button bg-blue-500 text-white"
              onClick={() => {
                if (!isAuthorized || (isAdminTask && !isOwner)) {
                  message.error("You are not authorized to make this action");
                  return;
                }
                setTask(record);
                setShowTaskForm(true);
              }}
            >
              Edit
            </Button>

            <Button
              type="primary"
              className="custom-button bg-red-500 text-white"
              danger
              onClick={() => {
                if (!isAuthorized || (isAdminTask && !isOwner)) {
                  message.error("You are not authorized to make this action");
                  return;
                }
                deleteTask(record._id);
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
  // ****************************************************

  if (isEmployee) {
    columns.pop();
  }


  // hadi commentitha 3la wed notification kitsared 2 merat   
  // useEffect(() => {
  //   getTasks();
  // }, [filters]);

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        {isOwner && (
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="projectStatus"
              className="mr-2 custom-checkbox"
              checked={project.status === "complete"}
              onChange={handleProjectStatusChange}
            />
            <label htmlFor="projectStatus" className="text-gray-700">
              Mark Project as Complete
            </label>
          </div>
        )}
        {!isEmployee && (
          <div className="flex justify-end gap-4">
            <Button
              type="default"
              onClick={() => setShowTaskForm(true)}
              // className="custom-button"
              className="flex items-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 hover:text-white transition duration-200"
            >
              Add Task
            </Button>
            <Button
              type="default"
              onClick={() => setShowStatisticsModal(true)}
              className="flex items-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-600 hover:text-white transition duration-200"
            >
              Statistics
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-5 mt-5 items-center">
  <Input
    placeholder="Search tasks by name"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="custom-input p-2 border rounded-lg shadow-sm hover:border-blue-400 focus:border-blue-500 transition duration-200"
  />
  <div className="flex items-center">
    <span className="text-gray-600">Status:</span>
    <Select
      value={filters.status}
      onChange={(value) => {
        setFilters({
          ...filters,
          status: value,
        });
      }}
      className="ml-2"
      style={{ width: 150 }}
    >
      <Option value="all">All</Option>
      <Option value="pending">Pending</Option>
      <Option value="inprogress">In Progress</Option>
      <Option value="completed">Completed</Option>
      <Option value="closed">Closed</Option>
    </Select>
  </div>
  <div className="flex items-center">
    <span className="text-gray-600">Assigned By:</span>
    <Select
      value={filters.assignedBy}
      onChange={(value) => {
        setFilters({
          ...filters,
          assignedBy: value,
        });
      }}
      className="ml-2"
      style={{ width: 150 }}
    >
      <Option value="all">All</Option>
      {project.members
        .filter((m) => m.role === "admin" || m.role === "owner")
        .map((m) => (
          <Option value={m.user._id} key={m.user._id}>
            {m.user.firstName + " " + m.user.lastName}
          </Option>
        ))}
    </Select>
  </div>
  <div className="flex items-center">
    <span className="text-gray-600">Assigned To:</span>
    <Select
      value={filters.assignedTo}
      onChange={(value) => {
        setFilters({
          ...filters,
          assignedTo: value,
        });
      }}
      className="ml-2"
      style={{ width: 150 }}
    >
      <Option value="all">All</Option>
      {project.members
        .filter((m) => m.role === "employee")
        .map((m) => (
          <Option value={m.user._id} key={m.user._id}>
            {m.user.firstName + " " + m.user.lastName}
          </Option>
        ))}
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
        //  hada lmodel jidid bch halit lproblem dyal loverFlow
        <div>
          {/* ... rest of the code */}
          <Modal
            title={
              <span className="text-lg font-semibold text-gray-700">
                Task Details
              </span>
            }
            open={showViewTask}
            onCancel={() => {
              setShowViewTask(false);
              window.location.reload();
            }}
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

          <style jsx>{`
            .modal-content {
              max-height: 60vh;
              overflow-y: auto;
            }
            .modal-content img {
              margin: 5px;
            }
            .text-lg {
              font-size: 1.125rem;
              line-height: 1.75rem;
            }
            .font-semibold {
              font-weight: 600;
            }
            .text-gray-700 {
              color: #4a5568;
            }
            .text-primary {
              color: #2d3748;
            }
            .text-sm {
              font-size: 0.875rem;
              line-height: 1.25rem;
            }
            .text-gray-500 {
              color: #a0aec0;
            }
            .flex {
              display: flex;
            }
            .flex-col {
              flex-direction: column;
            }
            .space-y-2 > :not([hidden]) ~ :not([hidden]) {
              --tw-space-y-reverse: 0;
              margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
              margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
            }
            .gap-4 {
              gap: 1rem;
            }
            .mt-2 {
              margin-top: 0.5rem;
            }
            .w-32 {
              width: 8rem;
            }
            .h-32 {
              height: 8rem;
            }
            .object-cover {
              object-fit: cover;
            }
            .p-1 {
              padding: 0.25rem;
            }
            .border {
              border-width: 1px;
            }
            .border-solid {
              border-style: solid;
            }
            .rounded {
              border-radius: 0.25rem;
            }
            .border-gray-300 {
              border-color: #e2e8f0;
            }
            .shadow-sm {
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }
          `}</style>
          {/* new model fo chart  */}
        </div>
      )}
      <Modal
        title="Project Statistics"
        open={showStatisticsModal}
        onCancel={() => setShowStatisticsModal(false)}
        footer={null}
        centered
      >
        <ProjectStatistics tasks={tasks} />
      </Modal>
    </div>
  );
}

export default Tasks;
// lcode lassli

//  ghadi nbda n5dem 3la dead line

// after design >> lcode lassli >> lhad l2an awel teghyr houa bdelt lcolumn kaml + gadit fin kayn nqati homer
//  gadit lbutton dyal at task zedt lih class name + gadit l tabs li west mn lmodel li kidir show ldata +
// gadit hta drop down li already west mn column ..
//  lhamdlah gadit hta dak completeed

// lhamdullilah dert kolchi hna
// done lhamdlah
