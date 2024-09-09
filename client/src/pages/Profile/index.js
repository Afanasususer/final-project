import React from "react";
import { Tabs } from "antd";
import { ProjectOutlined, ScheduleOutlined, SettingOutlined, DashboardOutlined, CalendarOutlined } from '@ant-design/icons';
import Projects from "./Projects";
import General from "./General";
import Scheduled from "./Scheduled/Scheduled";
import DashboardUser from "./dashboardUeser/DashboardUser";
import Calendar from "./calendar/calendar";
import { Helmet } from "react-helmet-async";


function Profile() {
  return (

  <>
    <Helmet>
        <title>Profile</title>
      </Helmet>
      <Tabs defaultActiveKey="1" centered className="profile-tabs">
        <Tabs.TabPane
          tab={
            <span>
              <DashboardOutlined />
              Scheduled Tasks
            </span>
          }
          key="1"
        >
          <Scheduled />
        </Tabs.TabPane>
    
        <Tabs.TabPane
          tab={
            <span>
              <ScheduleOutlined />
              My Projects
            </span>
          }
          key="2"
        >
          <Projects />
        </Tabs.TabPane>
    
        <Tabs.TabPane
          tab={
            <span>
              <ProjectOutlined />
              My Dashboard
            </span>
          }
          key="3"
        >
          <DashboardUser />
        </Tabs.TabPane>
    
        <Tabs.TabPane
          tab={
            <span>
              <CalendarOutlined />
              Calendar
            </span>
          }
          key="4"
        >
          <Calendar />
        </Tabs.TabPane>
    
        <Tabs.TabPane
          tab={
            <span>
              <SettingOutlined />
              General Information
            </span>
          }
          key="5"
        >
          <General />
        </Tabs.TabPane>
      </Tabs>
  </>
  );
}

export default Profile;
