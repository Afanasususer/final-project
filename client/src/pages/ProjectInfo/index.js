import {
  message,
  Tabs,
  Typography,
  Row,
  Col,
  Card as AntCard,
  Avatar as AntAvatar,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GetProjectById } from "../../apicalls/projects";
import { SetLoading } from "../../redux/loadersSlice";
import { getDateFormat } from "../../utils/helpers";
import Members from "./Members";
import Tasks from "./Tasks";
import Comments from "../../components/Comments";
import Taskk from "./myTasks/MyTasks";
import Dashboard from "./dashboard/Dashboard";
import Agenda from "./agenda/Agenda";
import Attachments from "./attachments/attachments";

import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";


import AvatarGroup from "@mui/material/AvatarGroup";
import {
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  IdcardOutlined,
  OrderedListOutlined,
  UsergroupAddOutlined,
  CommentOutlined,
  CheckCircleOutlined,
  BarChartOutlined, // New icon for Dashboard
  FileDoneOutlined,
  CalendarOutlined,FileOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function ProjectInfo() {
  const [currentUserRole, setCurrentUserRole] = useState("");
  const { user } = useSelector((state) => state.users);
  const [project, setProject] = useState(null);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();


  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectById(params.id);
      dispatch(SetLoading(false));
      if (response.success) {
        setProject(response.data);
        const currentUser = response.data.members.find(
          (member) => member.user._id === user._id
        );
        setCurrentUserRole(currentUser.role);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      // hada houa likifir dak lerror fch xi user ki5arej rasso .. .. 
      navigate("/");
//  donc hna getlih ytchker lmessage dyal lerror ila kan houa likitla3li f remove memebr maybynoch 
      if (error.message !== "Cannot read properties of undefined (reading 'role')") {
        message.error(error.message);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    project && (
      <>
        <Helmet>
          <title>{project?.name}</title>
        </Helmet>
        <div className="p-3">
          <AntCard
            className="mb-6"
            bordered={false}
            style={{ borderRadius: 8, padding: "16px 24px" }}
          >
            <Title level={2} className="uppercase text-blue-500">
              {project?.name}
            </Title>
            <Text className="text-gray-600">{project?.description}</Text>
            <Row gutter={[16, 16]} className="mt-7">
              <Col span={12}>
                <div className="flex flex-col">
                  <Title level={5} className="text-gray-700 flex items-center">
                    <FileDoneOutlined className="mr-2" /> Status
                  </Title>
                  <Text className="text-gray-600 uppercase">
                    {project.status === "active" ? "Active" : "Complete"}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col">
                  <Title level={5} className="text-gray-700 flex items-center">
                    <IdcardOutlined className="mr-2" /> Role
                  </Title>
                  <Text className="text-gray-600 uppercase">
                    {currentUserRole}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col">
                  <Title level={5} className="text-gray-700 flex items-center">
                    <ClockCircleOutlined className="mr-2" /> Created At
                  </Title>
                  <Text className="text-gray-600">
                    {getDateFormat(project.createdAt)}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col">
                  <Title level={5} className="text-gray-700 flex items-center">
                    <UserOutlined className="mr-2" /> Created By
                  </Title>
                  <Text className="text-gray-600">
                    {project.owner.firstName} {project.owner.lastName}
                  </Text>
                </div>
              </Col>
              <Col span={24}>
                <div className="flex flex-col">
                  <Title level={5} className="text-gray-700 flex items-center">
                    <TeamOutlined className="mr-2" /> Team Members
                  </Title>
                  <AvatarGroup max={4}>
                    {project.members.map((member) => (
                      <AntAvatar
                        key={member.user._id}
                        src={member.user.profileImage}
                      />
                    ))}
                  </AvatarGroup>
                </div>
              </Col>
            </Row>
          </AntCard>

          <Tabs defaultActiveKey="1" className="custom-tabs" centered>
            <TabPane
              tab={
                <span className="custom-tab">
                  <OrderedListOutlined /> Tasks
                </span>
              }
              key="1"
            >
              <AntCard bordered={false} style={{ borderRadius: 8 }}>
                <Tasks project={project} />
              </AntCard>
            </TabPane>
            <TabPane
              tab={
                <span className="custom-tab">
                  <UsergroupAddOutlined /> Members
                </span>
              }
              key="2"
            >
              <AntCard bordered={false} style={{ borderRadius: 8 }}>
                <Members project={project} reloadData={getData} />
              </AntCard>
            </TabPane>

            {user._id !== project.owner._id && (
              <TabPane
                tab={
                  <span className="custom-tab">
                    <CheckCircleOutlined /> My Tasks
                  </span>
                }
                key="3"
              >
                <AntCard bordered={false} style={{ borderRadius: 8 }}>
                  <Taskk project={project} user={user} />
                </AntCard>
              </TabPane>
            )}

            <TabPane
              tab={
                <span className="custom-tab">
                  <CommentOutlined /> Comments
                </span>
              }
              key="4"
            >
              <Comments project={project} user={user} />
            </TabPane>

            {user._id === project.owner._id && (
              <TabPane
                tab={
                  <span className="custom-tab">
                    <BarChartOutlined /> Dashboard
                  </span>
                }
                key="5"
              >
                <Dashboard project={project} user={user} />
              </TabPane>
            )}

            <TabPane
              tab={
                <span className="custom-tab">
                  <CalendarOutlined /> Agenda
                </span>
              }
              key="6"
            >
              <Agenda project={project} user={user} />
            </TabPane>



            <TabPane
              tab={
                <span className="custom-tab">
                  <FileOutlined /> File Sharing
                </span>
              }
              key="7"
            >
              <Attachments project={project} user={user} />
            </TabPane>




          </Tabs>
        </div>
      </>
    )
  );
}

export default ProjectInfo;

//  im working on logo problem now .. .. ..

//  9bl mn agenda .. .. ..
