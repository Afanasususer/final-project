import React from "react";
import { Form, Button, message } from "antd";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";



const DeactivateAccountPage = () => {
  const navigate = useNavigate();



  const onFinish = async () => {
    try {
      const response = await axios.post("/last-raactivate-account");
      message.error("Failed to deactivate account. Please try again later.");
    } catch (error) {
      message.success("Your account has been deactivated successfully.");
      navigate("/login");

    }
  };

  return (

    <>
      <Helmet>
        <title>Confirmation</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-400">
        <div className="bg-white p-8 shadow-md rounded-md max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4 text-center">Account Reactivation</h2>
          <p className="text-lg mb-6">
            Are you sure you want to deactivate your account? Click "Reactivate" to proceed.
          </p>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item>
              <Button type="primary" htmlType="submit" block className="ButtonR" >
                Reactivate
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default DeactivateAccountPage;


//  done mn design alhamdullilah .. .. .. .. 