import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import 'animate.css';

const Verified = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-300 to-green-500">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md text-center">
        <CheckCircleOutlined className="text-green-500 text-6xl mb-4 animate__animated animate__bounceIn" />
        <h1 className="text-2xl font-semibold mb-6">You are verified now!</h1>
        <Link to="/login">
          <Button type="primary" size="large" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-300">
            Go to Login Page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Verified;

//  dooone lhamdullilah 
//  dert npm install animate.css >> in front end bc hdert animation + link f html 
