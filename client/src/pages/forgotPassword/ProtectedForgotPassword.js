import React from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";



const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log(values);
    axios.post('/forgot-password', values)
      .then((res) => message.error("Failed to send password reset link."))
      .catch(() => {message.success("Password reset link sent to your email."); navigate("/profile")})
  }

  return (

  <>
    <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <div className="flex justify-center items-center bg-gradient-to-b from-white to-gray-200 overflow-hidden pb-0">
        <Card className="w-full max-w-md p-8 shadow-lg rounded-lg mt-14 mb-12">
          <Title level={2} className="text-center mb-6">Forgot Password</Title>
          <div className="text-center mb-4">
            <Text>We noticed you are logged in as <strong>{user?.email}</strong></Text>
            <br />
            <Text>If this is your email, please use it to reset your password.</Text>
          </div>
          <Form
            name="forgot_password"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full ButtonR" size="large">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
  </>
  );
};

export default ForgotPassword;


//  hado lcodat after design .. .. .. lahmdullilah .. .. .. 