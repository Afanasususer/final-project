import { Button, Input, message, Table, Tag, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProject, GetAllProjects } from "../../../apicalls/projects";
import { SetLoading } from "../../../redux/loadersSlice";
import { getDateFormat } from "../../../utils/helpers";
import ProjectForm from "./ProjectForm";
import { useNavigate } from "react-router-dom";
import { Pie } from "@ant-design/charts";
import { Helmet } from "react-helmet-async";


const { Option } = Select;

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [show, setShow] = useState(false);
  const [isStatisticsModalVisible, setIsStatisticsModalVisible] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllProjects({ owner: user._id });
      if (response.success) {
        setProjects(response.data);
        setFilteredProjects(response.data);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onDelete = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteProject(id);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const countStatus = (status) => {
    return projects.filter((project) => project.status === status).length;
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
    { type: 'Active', value: countStatus("active") },
    { type: 'Completed', value: countStatus("complete") },
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

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    if (value === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((project) => project.status === value));
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => <span className="truncate block max-w-xs">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => {
        let color;
        if (text === "active") {
          color = "yellow";
        } else if (text === "complete") {
          color = "green";
        } else {
          color = "volcano"; // default color for other statuses
        }
        return <Tag color={color}>{text.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-4">
            <i
              className="ri-eye-line text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => navigate(`/project/${record._id}`)}
            ></i>
            <i
              className="ri-delete-bin-line text-red-500 hover:text-red-700 cursor-pointer"
              onClick={() => onDelete(record._id)}
            ></i>
            <i
              className="ri-pencil-line text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => {
                setSelectedProject(record);
                setShow(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  return (

<>
<Helmet>
        <title>Profile</title>
      </Helmet>
      <div>
        <div className="flex justify-between items-center mb-4 p-6">
          <h2 className="text-2xl font-semibold">
            Projects (On going: {countStatus("active")}, Completed: {countStatus("complete")})
          </h2>
          <Button
            type="default"
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-600 transition duration-200"
            onClick={showStatisticsModal}
          >
            Statistics
          </Button>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-400 rounded-md p-2 w-full"
          />
        </div>
        <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <label htmlFor="statusFilter" className="text-gray-700 mr-2">
                Status:
              </label>
            <Select
              defaultValue="all"
              onChange={handleFilterChange}
              style={{ width: '150px' }}
            >
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="complete">Completed</Option>
            </Select>
        </div>
          <Button
            type="default"
            className="custom-button bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-200"
            onClick={() => {
              setSelectedProject(null);
              setShow(true);
            }}
          >
            Add Project
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredProjects.filter((project) => {
            if (searchQuery) {
              return project.name.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
          })}
          className="mt-4"
          pagination={{ pageSize: 4 }}
        />
        {projects.length === 0 && (
          <div className="flex justify-center">
            <h1 className="text-primary text-xl mt-48 font-black opacity-50">
              {searchQuery ? "No results" : "You have no projects yet"}
            </h1>
          </div>
        )}
        {show && (
          <ProjectForm
            show={show}
            setShow={setShow}
            reloadData={getData}
            project={selectedProject}
          />
        )}
        <Modal
          title="Project Statistics"
          visible={isStatisticsModalVisible}
          onOk={handleStatisticsModalOk}
          onCancel={handleStatisticsModalCancel}
          footer={null}
          centered
          width={700} // Increased the width of the modal
          bodyStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <Pie {...pieConfig} />
          </div>
        </Modal>
      </div>
</>
  );
}

export default Projects;
