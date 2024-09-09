import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import "tailwindcss/tailwind.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";


const ChangePassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;

    try {
      setLoading(true);

      // check password
      if (newPassword !== confirmPassword) {
        message.error("New password and confirm password do not match.");
        setLoading(false);
        return;
      }

      // do post request using axios
      const response = await axios.post("/ChangePasswordTwo", values);
      if (response.data.success) {
        message.success("Password changed successfully!");
        navigate("/profile");
        form.resetFields(); // had lcode mohim ghadi nhtajo mn ba3d dyal anah kimsa7 data dyal wahed lform
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (

  <>
    <Helmet>
        <title>Change Password</title>
      </Helmet>
      <div className="flex items-center justify-center mt-3">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Change Password
          </h2>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password!",
                },
              ]}
            >
              <Input.Password className="rounded-md" />
            </Form.Item>
    
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter your new password!" },
              ]}
            >
              <Input.Password className="rounded-md" />
            </Form.Item>
    
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm your new password!" },
              ]}
            >
              <Input.Password className="rounded-md" />
            </Form.Item>
    
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
          <div className="text-center mt-4">
            <Link to="/protectedForgotPassword" className="text-blue-600 hover:underline">
              I don't remember my password
            </Link>
          </div>
        </div>
      </div>
  </>
  );
};

export default ChangePassword;


//  after desined li 9bel mn hada houa lassli .. .. .. 