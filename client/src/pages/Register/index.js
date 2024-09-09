import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";

function Register() {
  const navigate = useNavigate();
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await RegisterUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        message.success(response.message);
        navigate("/login");
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
      navigate("/");
    }
  }, []);

  return (
    <div className="grid grid-cols-2 min-h-screen login-page">
      {/* hada ness li fih lform */}
      <div className="flex justify-center items-center">
        <div className="w-[420px]">
          <h1
            className="text-2xl text-gray-700 uppercase"
            style={{
              fontSize: "32px",
              cursor: "none",
            }}
          >
            Lets get you started
          </h1>
          <Divider className="bg-neutral-300	" />
          <Form className="mt-3" layout="vertical" onFinish={onFinish}>
            <Form.Item
              required
              help="please enter your first name (e.g., John)"
              label="First Name"
              name="firstName"
              rules={getAntdFormInputRules}
            >
              <Input
                className="mt-0 h-10 bg-slate-50	"
                placeholder="Enter your first name"
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              required
              className="mt-7"
              help="please enter your last name (e.g., Smith)"
              rules={getAntdFormInputRules}
            >
              <Input
                className="mt-0 h-10 bg-slate-50	"
                placeholder="Enter your last name"
              />
            </Form.Item>

            <Form.Item
              required
              className="mt-7"
              help="john.doe@example.com"
              label="Email"
              name="email"
              rules={getAntdFormInputRules}
            >
              <Input
                className="mt-0 h-10 bg-slate-50	"
                placeholder="Enter your email"
              />
            </Form.Item>

            <Form.Item
              required
              help="password must be at least 8 characters "
              className="mt-7"
              label="Password"
              name="password"
              rules={getAntdFormInputRules}
            >
              <Input
                type="password"
                className="mt-0 h-10 bg-slate-50"
                placeholder="Enter your password"
              />
            </Form.Item>

            {/* re-enter password */}
            <Form.Item
              required
              help="Password is case-sensitive"
              className="mt-7"
              label="Confirm Password"
              name="confirmPassword"
              rules={getAntdFormInputRules}
            >
              <Input
                type="password"
                className="mt-0 h-10 bg-slate-50"
                placeholder="Confirm Your Password"
              />
            </Form.Item>

            <Button
              className="mt-3 h-9 ButtonR"
              style={{ boxShadow: "none" }}
              type="primary"
              htmlType="submit"
              block
              loading={buttonLoading}
            >
              {buttonLoading ? "Loading" : "Register"}
            </Button>

            <div className="flex justify-center mt-1">
              <span style={{ textAlign: "center", marginTop: "6px", marginBottom: "2px" }}>
                Already have an account?{" "}
                <Link
                  className="ps-3"
                  style={{ textDecoration: "none" }}
                  to="/login"
                >
                  Login
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>

      {/* hada ness li fih title w description done with second half alhamdullilah*/}
      <div className="relative h-screen flex flex-col justify-center items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-900 to-black opacity-70"></div>
          <img
            src="pexels-cottonbro-7437495.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h1
            style={{ cursor: "none" }}
            className="text-7xl text-white font-medium mb-2 projectevo"
          >
            ProjectEvo
          </h1>
          <span className="text-gray-300 text-lg projectevo ps-1">
            Streamline task and project management with ease
          </span>
        </div>
      </div>
      
    </div>
  );
}

export default Register;

/* done lhamdullillah with register page  */


//  done lhamdullilah .. .. .. 