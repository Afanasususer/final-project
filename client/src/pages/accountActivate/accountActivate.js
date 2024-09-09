import React from "react";
import { Form, Input, Button, message } from "antd";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";


const EmailFormPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email } = values;

    try {
      const response = await axios.post("/raactivate-account", { email });
      message.error("Failed to send email. Please try again later.");
    } catch (error) {
      message.success("Email has sent to your account !");
      navigate("/login");
    }
  };

  return (
  <>
    <Helmet>
        <title>Activate Account</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-400">
        <div className="bg-white p-8 shadow-md rounded-md max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4 text-center">Reactivate Your Account</h2>
          <Form
            name="basic"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input />
            </Form.Item>
    
            <Form.Item>
              <Button type="primary" htmlType="submit" block className="ButtonR">
                Reactivate
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
  </>
  );
};

export default EmailFormPage;


//  9bel design .. .. .. .. 