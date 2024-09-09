// import React, { useEffect, useState } from "react";
// import { Table, message,Button, Modal, Form, Input, DatePicker } from "antd";
// import { useDispatch } from "react-redux";
// import { SetLoading } from "../../../redux/loadersSlice";
// import { GetScheduledTasks, DeleteScheduledTask, UpdateScheduledTask } from "../../../apicalls/tasks";
// import moment from "moment";

// function ScheduledTasksPage() {
//   const [scheduledTasks, setScheduledTasks] = useState([]);
//   const [editTask, setEditTask] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const dispatch = useDispatch();

//   const fetchScheduledTasks = async () => {
//     try {
//       dispatch(SetLoading(true));
//       const response = await GetScheduledTasks();
//       dispatch(SetLoading(false));
//       console.log(response); // Log the response to debug
//       if (response.success) {
//         setScheduledTasks(response.data || []);
//       } else {
//         message.error(response.message || "Failed to fetch scheduled tasks");
//       }
//     } catch (error) {
//       dispatch(SetLoading(false));
//       message.error(error.message);
//     }
//   };



//   const handleDelete = async (id) => {
//     try {
//       dispatch(SetLoading(true));
//       const response = await DeleteScheduledTask(id);
//       dispatch(SetLoading(false));
//       if (response.success) {
//         message.success(response.message);
//         fetchScheduledTasks();
//       } else {
//         message.error(response.message);
//       }
//     } catch (error) {
//       dispatch(SetLoading(false));
//       message.error(error.message);
//     }
//   };

//   const handleEdit = (task) => {
//     setEditTask(task);
//     setShowModal(true);
//   };

//   const handleUpdate = async (values) => {
//     try {
//       dispatch(SetLoading(true));
//       const updatedTask = {
//         ...editTask,
//         scheduledTime: values.scheduledTime.format("YYYY-MM-DD HH:mm:ss"),
//         taskData: {
//           ...editTask.taskData,
//           ...values,
//         },
//       };
//       const response = await UpdateScheduledTask(updatedTask);
//       dispatch(SetLoading(false));
//       if (response.success) {
//         message.success(response.message);
//         fetchScheduledTasks();
//         setShowModal(false);
//       } else {
//         message.error(response.message);
//       }
//       // hada ana zedto bch ydir reload fch ndir update w zedtha hta f oncancel
//       window.location.reload();  
//     } catch (error) {
//       dispatch(SetLoading(false));
//       message.error(error.message);
//     }
//   };



  
// // *******************************
// const truncateDescription = (description) => {
//   const maxLength = 50; // Adjust the max length as needed
//   return description.length > maxLength
//     ? description.substring(0, maxLength) + "..."
//     : description;
// };
// // *******************************

//   useEffect(() => {
//     fetchScheduledTasks();
//   }, []);

//   const columns = [
//     {
//       title: "Task Name",
//       dataIndex: ["taskData", "name"], // Access nested properties using array notation
//     },
//     {
//       title: "Task Description",
//       dataIndex: ["taskData", "description"], // Access nested properties using array notation
//     // ************
//     render: (description) => (
//       <div className="description-clamp">{truncateDescription(description)}</div>
//     ),
//     // ***************
//     },
//     {
//       title: "Scheduled Time",
//       dataIndex: "scheduledTime",
//       render: (scheduledTime) => moment(scheduledTime).format("YYYY-MM-DD HH:mm:ss"),
//     },
//     {
//       title: "Status",
//       dataIndex: "created",
//       render: (created) => (created ? "Created" : "Pending"),
//     },


//     {
//       title: "Actions",
//       render: (text, record) => (
//         <div>

//           {/* *********************** */}
//           {!record.created && (
//             <Button type="link" onClick={() => handleEdit(record)}>
//               Edit
//             </Button>
//           )}
//           {/* *********************** */}

//           <Button type="link" danger onClick={() => handleDelete(record._id)}>
//             Delete
//           </Button>
//         </div>
//       ),
//     },



//   ];

//   return (
//     <div>
//       <h2>Scheduled Tasks</h2>
//       <Table columns={columns} dataSource={scheduledTasks} rowKey="scheduledTime" />

//       <Modal
//         title="Edit Scheduled Task"
//         open={showModal}
//         onCancel={() => {setShowModal(false); window.location.reload();
//         }}
//         footer={null}
//       >
//         <Form
//           initialValues={{
//             name: editTask?.taskData?.name,
//             description: editTask?.taskData?.description,
//             scheduledTime: editTask ? moment(editTask.scheduledTime) : null,
//           }}
//           onFinish={handleUpdate}
//         >
//           <Form.Item label="Task Name" name="name">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Task Description" name="description">
//             <Input.TextArea />
//           </Form.Item>
//           <Form.Item label="Scheduled Time" name="scheduledTime">
//             <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Update
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

// {/* ****************************** to show only first line in discription*/}
// <style jsx="true">{`
//         .description-clamp {
//           overflow: hidden;
//           display: -webkit-box;
//           -webkit-line-clamp: 1; /* Number of lines to show */
//           -webkit-box-orient: vertical;
//           white-space: pre-wrap; /* Preserve whitespace and line breaks */
//            max-width: 200px; /* Adjust max width as needed */
//         }
//       `}</style>
// {/* ****************************** */}




//     </div>
//   );
// }

// export default ScheduledTasksPage;
// // show schedule task is done الحمدلله donc had hna kolchi lhamdla 5edam mezyan blasst ma knt kan5azen tasks 
// // scheduales ghy f array weli kan5azenhoom f database haka kandmn bli maghadich ydi3o w ghaybqaw dima kay-
// // nin hta lhad lcomment hada lhamdlah kolchi fine kan9der nafficher schedualed tasks without any problem
// // update and delete scheduale tasks added seccuessfully




// // i will start working on every one can see only thier schedule tasks 


// // lhamdlah lhad l2an kola user kichof ghy schedule task li houa dayehom, and fch task kiweli created dak
// // edit button makatb9ach bayna, and fch kandir kanhel lmodel dyal update w kansedo soit b cancel soit b 
// // update kidir liya refresh bch fch nhel nupdate task akhor tle3 liya data dyal hadek task 



// //  daba gahdi ndewz scheduled l profile