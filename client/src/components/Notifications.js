// import { message, Modal } from "antd";
// import moment from "moment";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   DeleteAllNotifications,
//   MarkNotificationAsRead,
// } from "../apicalls/notifications";
// import { SetLoading } from "../redux/loadersSlice";
// import { SetNotifications } from "../redux/usersSlice";

// function Notifications({ showNotifications, setShowNotifications }) {
//   const { notifications } = useSelector((state) => state.users);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const readNotifications = async () => {
//     try {
//       const response = await MarkNotificationAsRead();
//       if (response.success) {
//         console.log(response.data);
//         dispatch(SetNotifications(response.data));
//       }
//     } catch (error) {
//       message.error(error.message);
//     }
//   };

//   const deleteAllNotifications = async () => {
//     try {
//       dispatch(SetLoading(true));
//       const response = await DeleteAllNotifications();
//       dispatch(SetLoading(false));
//       if (response.success) {
//         dispatch(SetNotifications([]));
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error) {
//       dispatch(SetLoading(false));
//       message.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (notifications.length > 0) {
//       readNotifications();
//     }
//   }, [notifications]);

//   return (
//     <Modal
//       title="NOTIFICATIONS"
//       open={showNotifications}
//       onCancel={() => setShowNotifications(false)}
//       centered
//       footer={null}
//       width={1000}
//     >
//       <div className="flex flex-col gap-5 mt-5">
//         {notifications.length > 0 ? (
//           <div className="flex justify-end">
//             <span
//               className="text-[15px] underline cursor-pointer"
//               onClick={deleteAllNotifications}
//             >
//               Delete All
//             </span>
//           </div>
//         )
//         : (
//           <div className="flex justify-center">
//             <span className="text-[15px]">No Notifications</span>
//           </div>
//         )
//       }
//         {notifications.map((notification) => (
//           <div
//             className="flex justify-between items-end border border-solid p-2 roudned cursor-pointer"
//             onClick={() => {
//               setShowNotifications(false);
//               navigate(notification.onClick);
//             }}
//           >
//             <div className="flex flex-col">
//               <span className="text-md font-semibold  text-gray-700">
//                 {notification.title}
//               </span>
//               <span className="text-sm">{notification.description}</span>
//             </div>
//             <div>
//               <span className="text-sm">
//                 {moment(notification.createdAt).fromNow()}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </Modal>
//   );
// }

// export default Notifications;


//  ghadi ndesgine daba .. .. 



















// hada houa design jdid : 

import { message, Modal, Button } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DeleteAllNotifications,
  MarkNotificationAsRead,
} from "../apicalls/notifications";
import { SetLoading } from "../redux/loadersSlice";
import { SetNotifications } from "../redux/usersSlice";

function Notifications({ showNotifications, setShowNotifications }) {
  const { notifications } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const readNotifications = async () => {
    try {
      const response = await MarkNotificationAsRead();
      if (response.success) {
        dispatch(SetNotifications(response.data));
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteAllNotifications();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetNotifications([]));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (notifications.length > 0) {
      readNotifications();
    }
  }, [notifications]);

  return (
    <Modal
      title=""
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      centered
      footer={null}
      width={700}
      bodyStyle={{ padding: 0 }}
    >
      <div className="p-6">
        {notifications.length > 0 ? (
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Notifications</span>
            <Button
              type="text"
              className="text-red-500"
              onClick={deleteAllNotifications}
            >
              Delete All
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg font-semibold text-gray-500">
              No Notifications
            </span>
          </div>
        )}
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="flex justify-between items-start p-4 mb-2 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-all"
              onClick={() => {
                setShowNotifications(false);
                navigate(notification.onClick);
              }}
            >
              <div>
                <div className="text-md font-semibold text-gray-800">
                  {notification.title}
                </div>
                <div className="text-sm text-gray-600">
                  {notification.description}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {moment(notification.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default Notifications;
