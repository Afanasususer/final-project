import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Tabs,
  Upload,
  DatePicker,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddNotification } from "../../../apicalls/notifications";
import { CreateTask, UpdateTask, UploadImage } from "../../../apicalls/tasks";
import { SetLoading } from "../../../redux/loadersSlice";
// ***************************************
import axios from "axios";
import moment from "moment";
// ***************************************

function TaskForm({
  showTaskForm,
  setShowTaskForm,
  project,
  task,
  reloadData,
}) {
  const [selectedTab, setSelectedTab] = useState("1");
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => state.users);
  const formRef = useRef(null);
  // **************************** bezaf dyal images
  // const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  // ********************************************
  const [images, setImages] = useState(task?.attachments || []);
  const [taskId, setTaskId] = useState(task?._id || null);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response = null;

      // ******************************************************************
      const formattedScheduledTime = values.scheduledTime
        ? values.scheduledTime.format("YYYY-MM-DD HH:mm:ss")
        : null;

      const formattedDeadline = values.deadline
        ? values.deadline.format("YYYY-MM-DD HH:mm:ss")
        : null;
      // ******************************************************************

      if (task) {
        // Update task
        response = await UpdateTask({
          ...values,
          project: project._id,
          assignedTo: task.assignedTo._id,
          _id: task._id,
          // **************
          deadline: formattedDeadline,
          // **************
        });
      } else {
        if (email === user.email) {
          throw new Error("Cannot assign a task to yourself.");
        }

        const assignedToMember = project.members.find(
          (member) => member.user.email === email
        );

        if (!assignedToMember) {
          throw new Error("No member found with the provided email.");
        }

        if (assignedToMember.user.isDesable) {
          throw new Error("Cannot assign task to a deactivated account.");
        }

        // *********************

        // Check if the assignee is the owner
        const isAssigneeOwner = project.owner._id === assignedToMember.user._id;

        if (isAssigneeOwner) {
          throw new Error("Cannot assign a task to the owner.");
        }

        // Check if both users are admins

        // Check if the current user is the owner
        const isOwner = project.owner._id === user._id;

        // If the current user is not the owner, consider them an admin
        const isAssignerAdmin = !isOwner;
        const isAssigneeAdmin = assignedToMember?.role === "admin";

        console.log("Is Assigner Admin:", isAssignerAdmin);
        console.log("Assignee Role:", assignedToMember?.role);

        if (isAssignerAdmin && isAssigneeAdmin) {
          throw new Error("Admin cannot assign a task to another admin.");
        }

        // **********************

        const assignedToUserId = assignedToMember.user._id;
        const assignedBy = user._id;
        response = await CreateTask({
          ...values,
          project: project._id,
          assignedTo: assignedToUserId,
          assignedBy,
          // ************************************************
          scheduledTime: formattedScheduledTime,
          deadline: formattedDeadline,

          // ***************************************
        });

        setTaskId(response.data._id);

        // Send notification to the assigned employee
        AddNotification({
          title: `You have been assigned a new task in ${project.name}`,
          user: assignedToUserId,
          onClick: `/project/${project._id}`,
          description: values.name,
          //  dert blastt desceiption >> name bch fch task ytassigna bla ma ytla3 description dyalo yt3 name .. .. 
        });
      }

      if (response.success) {
        // hna dert taghyr 3la wed bzf dyal images
        if (files.length > 0) {
          await uploadImages(taskId || response.data._id, !!task);
        }
        reloadData();
        message.success(response.message);
        setShowTaskForm(false);
      }

      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      if (error.message.includes("Cannot read properties of undefined (reading '_id')")) {
        message.success("Task scheduled successfully. It will be created at the specified time.");
        setShowTaskForm(false);
      } else {
        message.error(error.message);

      }

    }
  };

  const validateEmail = () => {
    const employeesInProject = project.members.filter(
      (member) => member.role === "employee" || member.role === "admin"
    );
    const isEmailValid = employeesInProject.find(
      (employee) => employee.user.email === email
    );
    return isEmailValid ? true : false;
  };

  // const uploadImage = async (taskId, isUpdate) => {
  //   try {
  //     if (!taskId) throw new Error("Invalid task ID for image upload.");
  //     dispatch(SetLoading(true));
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("taskId", taskId);
  //     const response = await UploadImage(formData);
  //     if (response.success) {
  //       if (isUpdate) {
  //         message.success(response.message);
  //       }
  //       setImages([...images, response.data]);
  //       reloadData();
  //     } else {
  //       throw new Error(response.message);
  //     }
  //     dispatch(SetLoading(false));
  //   } catch (error) {
  //     dispatch(SetLoading(false));
  //     message.error(error.message);
  //   }
  // };

  //  upload image jdida dyal bezaf dyal images
  const uploadImages = async (taskId, isUpdate) => {
    try {
      if (!taskId) throw new Error("Invalid task ID for image upload.");
      dispatch(SetLoading(true));
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("taskId", taskId);
      const response = await UploadImage(formData);
      if (response.success) {
        if (isUpdate) {
          message.success(response.message);
        }
        setImages([...images, ...response.data]);
        reloadData();
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const deleteImage = async (image) => {
    try {
      dispatch(SetLoading(true));
      const attachments = images.filter((img) => img !== image);
      const response = await UpdateTask({
        ...task,
        attachments,
      });
      if (response.success) {
        message.success(response.message);
        setImages(attachments);
        reloadData();
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const isOwner = project.owner._id === user._id;

  return (
    <Modal
      title={task ? "UPDATE TASK" : "CREATE TASK"}
      open={showTaskForm}
      onCancel={() => {
        setShowTaskForm(false);
        if (task) {
          window.location.reload();
        }
      }}
      centered
      onOk={() => {
        formRef.current.submit();
        if (task) {
          window.location.reload();
        }
      }}
      okText={task ? "UPDATE" : "CREATE"}
      okButtonProps={{
        className:
          "bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 hover:text-white transition duration-200",
      }}
      width={800}
      {...(selectedTab === "2" && { footer: null })}
    >
      <Tabs
        activeKey={selectedTab}
        onChange={(key) => setSelectedTab(key)}
        centered
      >
        <Tabs.TabPane className="ant-tabs-ink-bar-a" tab="Task Details" key="1">
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            initialValues={{
              ...task,
              assignedTo: task ? task.assignedTo.email : "",
              // ************************************************************
              scheduledTime: task ? moment(task.scheduledTime) : null,
              deadline: task ? moment(task.deadline) : null,

              // ***************************************************************
            }}
          >
            <Form.Item label="Task Name" name="name">
              <Input placeholder="Enter name of task"/>
            </Form.Item>

            <Form.Item label="Task Description" name="description">
              <TextArea placeholder="Enter Description of task"/>
            </Form.Item>

            <Form.Item label="Assign To" name="assignedTo">
              <Input
                placeholder="Enter email of the employee"
                onChange={(e) => setEmail(e.target.value)}
                disabled={task ? true : false}
              />
            </Form.Item>

            {email && !validateEmail() && (
              <div className="bg-red-700 text-sm p-2 rounded">
                {isOwner && (
                  <span className="text-white">
                    Email is not valid or employee / admin is not in the project
                  </span>
                )}

                {!isOwner && (
                  <span className="text-white">
                    Email is not valid or employee is not in the project
                  </span>
                )}
              </div>
            )}

            {/* ================================================================ */}
            <div className="flex justify-between">

            {!task && (
              <Form.Item label="Scheduled Time" name="scheduledTime">
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
            )}

            <Form.Item label="Deadline" name="deadline">
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            </div>

            {/* ///////////////////////////////////////////////////////////////////// */}
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Attachments" key="2">
          {/*  ta had lcode zedto mn ajl design w mayfotch loverfllow */}
          <div
            className="flex flex-wrap gap-3 mb-5"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {/* {images.map((image) => {
              return (
                <div
                  className="flex gap-3 p-2 border border-solid rounded border-gray-500 items-end"
                  key={image}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-20 h-20 object-cover mt-2"
                  />
                  <i
                    className="ri-delete-bin-line"
                    onClick={() => deleteImage(image)}
                  ></i>
                </div>
              );
            })} */}

            {/*  new images to solve problem of overflow */}
            {images.map((image) => (
              <div key={image} className="relative">
                <img src={image} alt="" className="w-20 h-20 object-cover" />
                <i
                  className="ri-delete-bin-line absolute top-0 right-0 cursor-pointer"
                  onClick={() => deleteImage(image)}
                ></i>
              </div>
            ))}
          </div>
          {/* <Upload
            beforeUpload={() => false}
            onChange={(info) => {
              setFile(info.file);
            }}
            listType="picture"
          >
            <Button type="dashed">Upload Images</Button>
          </Upload> */}

          {/*  upload jdida dyal bezaf dyal images  */}

          <Upload
            beforeUpload={() => false}
            multiple
            onChange={(info) => {
              setFiles(info.fileList.map((file) => file.originFileObj));
            }}
            listType="picture"
          >
            <Button type="dashed">Upload Images</Button>
          </Upload>

          {task && (
            <div className="flex justify-end mt-4 gap-5">
              <Button type="default" onClick={() => setShowTaskForm(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                // onClick={() => {
                //   if (taskId || task) {
                //     uploadImage(taskId || task._id, !!task); // Pass the isUpdate flag
                //   } else {
                //     message.error("Please create the task first.");
                //   }
                // }}

                // onclick jidida bch ngad bezaf dyal images
                onClick={() => {
                  if (task) {
                    uploadImages(task._id, true);
                  }
                }}
                // disabled={!file}
              >
                Update Attachments
              </Button>
            </div>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default TaskForm;
//  so had lcode :
// awel haja khademliya attachments f create a task
// tani haja hayedliya upload and cancel buttons mn attachment fch kanbghy ncree task w 5alahom f update
// talet haja fch wahed luser kibghy yassigne task l rasso maki5alihch kitla3lo error message
// rabe3 haja fch kancree task gotlo mabych dak lmessage dyal image upload succesfully

// man5alich wahed l'admin yassigne task l owner aw li xi admin bhalo
// == dertha lhamdlah 3an tariq anani t2aked bli lrole dyal li t3ta lih admin, w li 3tah mxi owner ya3ni
// idan admin donc ytafficha dak lmessage dyal admin cant assigne task to an admin ..
// hta anah may5alich wahed luser yassigner task l owner is done
// === lhamdullilah
// za2id anani nzid nfekkar chwiya f update wach khass tgad fiha xi haja .. had xi li banli hta l daba
// == b nessba l update 5elitha kif ma hiya its so good

// nshuf ila 9derrt ngad mn b3ed anani nebqa ndewz ezaf dyal images f update w create

// before notification for scheduale task ..

//  ghadi nbda n5dem 3la dead line

//  ghadi nbd ngad issue dyal images

// before schedule edit update

//  berfore desiging the page

// design done lhamdullilah

//  ghanbda nshuf mal logic >> i fix it alhamdullilah kan lmochkil f catch dyal l onfini
//  done lhamdullilah ..