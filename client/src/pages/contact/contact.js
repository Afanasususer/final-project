import React from "react";
import { useState } from "react";

import { Form, Input, Button, message as antdMessage } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";



const Contact = () => {
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Submit");
  const [buttonType, setButtonType] = useState("primary");

  const onFinish = (values) => {
    console.log(values);
    axios.post('/send-email', values)
    .then(res => {
      console.log("meqloubin")
    })
    .catch(res => {
      // hta dert redirect hta f lend point dyal lbackend w 9lebthoom hna 3ad 5edmat lmessage w redirect
      antdMessage.success("Thank you for contacting us. We will get back to you as soon as possible.");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect after 2 seconds
      setButtonText("Message Sent");
      setButtonType("success");
    });
  };

  return (
    <>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-gradient-to-r from-gray-300 to-gray-400" >
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg overflow-hidden w-full max-w-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-700 text-center">Contact Us</h2>
          <p className="text-center text-gray-600 mb-6">
            Have any questions or concerns? We're always ready to help! Send us a message, and we will get back to you as soon as possible.
          </p>
          <Form
            name="contact"
            id="contact"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              id="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                  type: "email",
                },
              ]}
            >
              <Input
                placeholder="Enter your email"
                className="p-2 rounded border"
              />
            </Form.Item>
            <Form.Item
              name="message"
              id="message"
              label="Message"
              rules={[{ required: true, message: "Please input your message!" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter your message"
                className="p-2 rounded border"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                style={{ backgroundColor: buttonType === "success" ? "#52c41a" : undefined, borderColor: buttonType === "success" ? "#52c41a" : undefined }}
      
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Contact;


// hada houa lfinal code lahmdlah + gadit hta f lend point li f server >> done >> done  

//  9bel ma nhayed lbackground image .. ana hna kmera tanya kandssigni .. .. .. 