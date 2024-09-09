import React from 'react';
import { Button, message, Typography, Card } from "antd";
import { DeleteAccount } from "../../apicalls/users";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";


const { Title, Text } = Typography;

const DltAccount = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await DeleteAccount();
      if (response.success) {
        message.success("Account deactivated successfully");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  return (

    <>
      <Helmet>
        <title>Deactivate Account</title>
      </Helmet>
      <div className="flex justify-center items-center pt-14 pb-14 mt-8 screen bg-gradient-to-t from-white to-gray-100">
        <Card className="w-full max-w-md p-8 shadow-lg rounded-lg">
          <div className="flex justify-center mb-6">
            <img src="3f021816-bde1-4634-80b3-52d7f762bc6b-cover-removebg.png" alt="Logo" className="h-16" /> {/* Adjust the path to your logo */}
          </div>
          <Title level={3} className="text-center mb-6">Deactivate Account</Title>
          <Text className="text-center mb-4">
            Are you sure you want to deactivate your account?
          </Text>
          <Button
            type="primary"
            danger
            className="w-full h-12 text-lg mt-7"
            onClick={handleDelete}
          >
            Deactivate My Account
          </Button>
        </Card>
      </div>
    </>
  );
}

export default DltAccount;


// had lcode mn ba3d design w li 9bel houa 9bl design .. .. .. im done now lhamdlah .. .. 