import { Form, Input, message, Modal, Select } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { AddMemberToProject } from "../../../apicalls/projects";
import { SetLoading } from "../../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../../utils/helpers";

const { Option } = Select;

function MemberForm({
  showMemberForm,
  setShowMemberForm,
  reloadData,
  project,
}) {
  const formRef = React.useRef(null);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      // check if email already exists
      const emailExists = project.members.find(
        (member) => member.user.email === values.email
      );
      if (emailExists) {
        throw new Error("User is already a member of this project");
      } else {
        dispatch(SetLoading(true));
        const response = await AddMemberToProject({
          projectId: project._id,
          email: values.email,
          role: values.role,
        });
        dispatch(SetLoading(false));
        if (response.success) {
          message.success(response.message);
          reloadData();
          setShowMemberForm(false);
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  return (
    <Modal
      title="ADD MEMBER"
      open={showMemberForm}
      onCancel={() => setShowMemberForm(false)}
      centered
      okText="Add"
      onOk={() => {
        formRef.current.submit();
      }}
      okButtonProps={{
        className:
          "bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 hover:text-white transition duration-200",
      }}
      className="p-4 rounded-lg"
    >
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={getAntdFormInputRules}
          className="mb-4"
        >
          <Input placeholder="Email" className="rounded-lg" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={getAntdFormInputRules}
          className="mb-4"
        >
          <Select
            placeholder="Select Role"
            className="rounded-lg"
          >
            <Option value="admin">Admin</Option>
            <Option value="employee">Employee</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MemberForm;
