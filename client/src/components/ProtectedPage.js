// import { message, Modal, Avatar, Badge } from "antd";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { GetLoggedInUser } from "../apicalls/users";
// import { SetNotifications, SetUser } from "../redux/usersSlice";
// import { SetLoading } from "../redux/loadersSlice";
// import { GetAllNotifications } from "../apicalls/notifications";
// import axios from 'axios';
// import Notifications from "./Notifications";

// function ProtectedPage({ children }) {
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [logoutModalVisible, setLogoutModalVisible] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, notifications } = useSelector((state) => state.users);

//   const getUser = async () => {
//     try {
//       dispatch(SetLoading(true));
//       const response = await GetLoggedInUser();
//       dispatch(SetLoading(false));
//       if (response.success) {
//         dispatch(SetUser(response.data));
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error) {
//       dispatch(SetLoading(false));
//       message.error(error.message);
//       localStorage.removeItem("token");
//       await axios.post('/clear-token');
//       navigate("/login");
//     }
//   };

//   const getNotifications = async () => {
//     try {
//       dispatch(SetLoading(true));
//       const response = await GetAllNotifications();
//       dispatch(SetLoading(false));
//       if (response.success) {
//         dispatch(SetNotifications(response.data));
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error) {
//       dispatch(SetLoading(false));
//       message.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       getUser();
//     } else {
//       navigate("/login");
//     }
//   }, []);

//   useEffect(() => {
//     if (user) {
//       getNotifications();
//     }
//   }, [user]);

//   const handleLogout = async () => {
//     try {
//       localStorage.removeItem("token");
//       await axios.post('/clear-token');
//       navigate("/login");
//     } catch (error) {
//       message.error('Failed to log out.');
//     }
//   };

//   const showLogoutModal = () => {
//     setLogoutModalVisible(true);
//   };

//   const handleOk = () => {
//     setLogoutModalVisible(false);
//     handleLogout();
//   };

//   const handleCancel = () => {
//     setLogoutModalVisible(false);
//   };

//   return (
//     user && (
//       <div>
//         <div className="flex justify-between items-center bg-primary text-white px-5 py-4">
//           <h1 className="text-2xl cursor-pointer" onClick={() => navigate("/")}>
//             PROJECTEVO
//           </h1>

//           <div className="flex items-center bg-white px-5 py-2 rounded">

//             {/*********************************** ************ hada li zedt */}
//             {user?.profileImage ? (
//             <Avatar src={user?.profileImage} size="large" className="mr-2" />
//           ) : (
//             <Avatar src="avatar.png" size="large" className="mr-2" />
//           )}
//             {/********************************************** * hada li zedt */}

//             <span
//               className="text-primary cursor-pointer underline mr-2"
//               onClick={() => navigate("/profile")}
//             >
//               {user?.firstName}
//             </span>
//             <Badge
//               count={
//                 notifications.filter((notification) => !notification.read)
//                   .length
//               }
//               className="cursor-pointer"
//             >
//               <Avatar
//                 shape="square"
//                 size="large"
//                 icon={
//                   <i className="ri-notification-line text-white rounded-full"></i>
//                 }
//                 onClick={() => {
//                   setShowNotifications(true);
//                 }}
//               />
//             </Badge>

//             <i
//               className="ri-logout-box-r-line ml-10 text-primary"
//               onClick={showLogoutModal}
//             ></i>
//           </div>
//         </div>
//         <div className="px-5 py-3">{children}</div>

//         {showNotifications && (
//           <Notifications
//             showNotifications={showNotifications}
//             setShowNotifications={setShowNotifications}
//             reloadNotifications={getNotifications}
//           />
//         )}

//         <Modal
//           title="Confirm Logout"
//           visible={logoutModalVisible}
//           onOk={handleOk}
//           onCancel={handleCancel}
//         >
//           <p>Are you sure you want to logout?</p>
//         </Modal>
//       </div>
//     )
//   );
// }

// export default ProtectedPage;
// // original code

import { message, Modal, Avatar, Badge, Tooltip, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetLoggedInUser } from "../apicalls/users";
import { SetNotifications, SetUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";
import { GetAllNotifications } from "../apicalls/notifications";
import axios from "axios";
import Notifications from "./Notifications";
import { BellOutlined, LogoutOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

function ProtectedPage({ children }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, notifications } = useSelector((state) => state.users);
  const location = useLocation();
  const isProjectInfoPage = location.pathname.includes("/project/");

  const getUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetLoggedInUser();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
      localStorage.removeItem("token");
      await axios.post("/clear-token");
      navigate("/login");
    }
  };

  const getNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllNotifications();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetNotifications(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      await axios.post("/clear-token");
      navigate("/login");
    } catch (error) {
      message.error("Failed to log out.");
    }
  };

  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const handleOk = () => {
    setLogoutModalVisible(false);
    handleLogout();
  };

  const handleCancel = () => {
    setLogoutModalVisible(false);
  };

  return (
    user && (
      <div>
        <div className="flex justify-between items-center bg-gray-900 text-white px-6 py-4 shadow-lg fixed w-full z-50">
          <div className="flex items-center space-x-3">
            {!isProjectInfoPage && (
              <img
                src="3f021816-bde1-4634-80b3-52d7f762bc6b-cover-removebg.png"
                alt="Logo"
                className="h-10 w-10 cursor-pointer"
                onClick={() => {
                  navigate("/");
                  window.location.reload();
                }}
              />
            )}

            <h1
              className="text-xl font-semibold cursor-pointer transition duration-300 hover:text-gray-400"
              onClick={() => {
                navigate("/");
                window.location.reload();
              }}
            >
              PROJECTEVO
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Tooltip title="Profile">
              {user?.profileImage ? (
                <Avatar
                  src={user?.profileImage}
                  size="large"
                  className="cursor-pointer transition duration-300 transform hover:scale-105"
                  onClick={() => navigate("/profile")}
                />
              ) : (
                <Avatar
                  src="avatar.png"
                  size="large"
                  className="cursor-pointer transition duration-300 transform hover:scale-105"
                  onClick={() => navigate("/profile")}
                />
              )}
            </Tooltip>

            <span
              className="text-white font-medium cursor-pointer transition duration-300 hover:text-gray-400"
              onClick={() => navigate("/profile")}
            >
              {user?.firstName}
            </span>

            <span
              className="text-white font-medium cursor-pointer transition duration-300 hover:text-gray-400"
              onClick={() => navigate("/aboutUs")}
            >
              About
            </span>

            <Tooltip title="Notifications" placement="bottom">
              <span className="relative">
                <Badge
                  count={
                    notifications.filter((notification) => !notification.read)
                      .length
                  }
                  className="cursor-pointer"
                  offset={[-5, 0]}
                >
                  <BellOutlined
                    style={{
                      fontSize: "24px",
                      color: "white",
                      transition: "color 0.3s",
                    }}
                    className="hover:text-gray-400 hover:animate-pulse"
                    onClick={() => setShowNotifications(true)}
                  />
                </Badge>
              </span>
            </Tooltip>

            <Tooltip title="Logout">
              <LogoutOutlined
                className="text-white cursor-pointer transition duration-300 hover:text-gray-400"
                style={{ fontSize: "24px" }}
                onClick={showLogoutModal}
              />
            </Tooltip>
          </div>
        </div>
        <div className="pt-20 px-5 py-3 bg-gradient-to-b from-white to-gray-100">{children}</div>

        {showNotifications && (
          <Notifications
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            reloadNotifications={getNotifications}
          />
        )}

        <Modal
          title="Confirm Logout"
          visible={logoutModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Yes, Log Out"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
          centered
        >
          <Divider />

          <p className="text-lg">Are you sure you want to logout?</p>
        </Modal>
      </div>
    )
  );
}

export default ProtectedPage;

// done alhamdullilah

//  ana hna mn ajl design l lmera tanya .. ..

//   done lhamdullilah .. .. .. ..

//  im here to work on logo problem .. .. .. .. .. .. .. ..

//   ana hna bch ngad lprolem dyal logo li makibanch f project info .. .. .. done alhamdullilah .. .. .. 


// zedt gadit background color >> lhamdullilah .. .. .. 

