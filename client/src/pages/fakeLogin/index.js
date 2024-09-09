import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, Navigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { SinginUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";

function Singin() {
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await SinginUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        localStorage.setItem("token", response.data);
        message.success(response.message);
        // window.location.href = "/login/new"; // Change this line to the current pathname
        Navigate("/login/new");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      // window.location.href = "/login/new"; // Change this line to the current pathname
    }
  }, []);

  return (
    <div className="grid grid-cols-2">
      <div className="bg-primary h-screen flex flex-col justify-center items-center">
        <div>
          <h1 className="text-7xl text-white">SHEY-TRACKER</h1>
          <span className=" text-white mt-5">
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/login"
            >
              One place to track all your business records
            </Link>
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-[420px]">
          <h1 className="text-2xl text-gray-700">LOGIN TO YOUR ACCOUNT</h1>
          <Divider />
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Email" name="email" rules={getAntdFormInputRules}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={getAntdFormInputRules}
            >
              <Input type="password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={buttonLoading}
            >
              {buttonLoading ? "Loading" : "Login"}
            </Button>

            <div className="flex justify-center mt-5">
              <span>
                Don't have an account? <Link to="/register">Register</Link>
              </span>
            </div>
            <div className="flex justify-center mt-2 underline forgotPass">
              <span>
                <Link to="http://localhost:5000/forgot-password">
                  Forgot Password ?
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Singin;
