import { Form, Input, message, Modal, Divider } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { CreateProject, EditProject } from "../../../apicalls/projects";

function ProjectForm({ show, setShow, reloadData, project }) {
  const formRef = React.useRef(null);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (project) {
        // edit project
        values._id = project._id;
        response = await EditProject(values);
      } else {
        // create project
        values.owner = user._id;
        values.members = [
          {
            user: user._id,
            role: "owner",
          },
        ];
        response = await CreateProject(values);
      }
     
      if (response.success) {
        message.success(response.message);
        reloadData();
        setShow(false);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
    }
  };
  return (
    <Modal
      title={project ? "EDIT PROJRCT" : "CREATE PROJECT"}
      open={show}
      onCancel={() => setShow(false)}
      centered
      width={700}
      onOk={() => {
        formRef.current.submit();
      }}
      okText="Save"
      okButtonProps={{
        className:
          "bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 hover:text-white transition duration-200",
      }}
    >
                          <Divider className="mb-5" />

      <Form
        layout="vertical"
        ref={formRef}
        onFinish={onFinish}
        initialValues={project}
      >
        <Form.Item label="Project Name" name="name">
          <Input placeholder="Project Name" />
        </Form.Item>
        <Form.Item label="Project Description" name="description">
          <TextArea placeholder="Project Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProjectForm;
//  lcode lassli 9bl desgin .. ..


//  design done lhamdullilah