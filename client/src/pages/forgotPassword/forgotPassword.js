import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";



const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log(values);
    axios
      .post("/forgot-password", values)
      .then((res) => message.error("Failed to send password reset link."))
      .catch(() => {message.success("Password reset link sent to your email."); navigate("/login")});
  };

  return (

    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-300 to-gray-400">
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Forgot Password
          </h2>
          <Form name="forgot_password" onFinish={onFinish} className="space-y-4">
            <Form.Item
              required
              help="Please ensure you enter the correct email address"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input
                placeholder="Enter Your Email Account Please"
                className="px-4 py-2 border rounded"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-300 ButtonR mt-6"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

//  lcode lassli


//  im done lhamdllah with the design of this page + i adde redirect in the server  