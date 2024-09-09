import React, { useState } from 'react';
import { Form, Input, Button, message, Tooltip } from 'antd';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";




const ResetPassword = () => {
  const navigate = useNavigate();



  const onFinish = (values) => {
    console.log(values);
    axios.post('/newpassword', values)
    .then(res => {  
      message.error('Password reset failed. Please try again.');
      // homa haka khedmo meqlobin dont worry machi ana 9alebhoo mwla chi haja 
    })
    .catch(err => {
      console.error(err);
      message.success('Password reset successful!');
      navigate('/login'); // Redirect to the login page

    })  
}




  return (

  <>
    <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-300 to-gray-400">
        <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
            <img
              src="3f021816-bde1-4634-80b3-52d7f762bc6b-cover-removebg.png"
              alt="Logo"
              className="h-12"
            />{" "}
            {/* Replace with your logo path */}
          </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
          <Form
            name="reset_password"
            onFinish={onFinish}
            layout="vertical"
            className="space-y-4"
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your new password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Enter new password"   className="px-4 py-2 border rounded" />
            </Form.Item>
    
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[
                {
                  required: true,
                  message: 'Please confirm your new password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('The two passwords that you entered do not match!')
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Confirm new password" className="px-4 py-2 border rounded" />
            </Form.Item>
    
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-300 ButtonR"
              >
                Reset Password
              </Button>
            </Form.Item>
            <div className="text-center mt-4">
              <Link to="/login" className="text-blue-500 hover:text-blue-700">
                Back to Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
  </>
  );
};

export default ResetPassword;
// lcode lassli
// edited lhamdlah 5edama w kolchi 5edam mzyan 