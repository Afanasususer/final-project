import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import { Helmet } from "react-helmet-async";


function Login() {
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();
  const [deactivationMessage, setDeactivationMessage] = useState("");

  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await LoginUser(values);
      dispatch(SetButtonLoading(false));

      if (response.success) {
        localStorage.setItem("token", response.data);
        message.success(response.message);
        window.location.href = "/";
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      if (error.message.includes("Your account has been deactivated.")) {
        setDeactivationMessage(error.message);
      } else {
        setDeactivationMessage(""); // Clear the deactivation message
        message.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  return (

  <>
    <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="grid grid-cols-2 login-page">
        {/* hada houa li fih l3onwan w description . ghadi nbedlo b ness dyal register . */}
        <div className="relative h-screen flex flex-col justify-center items-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-900 to-black opacity-70"></div>
            <img
              src="pexels-cottonbro-7430332.jpg"
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
    
        {/*  hada li fih lform  */}
        <div className="flex justify-center items-center">
          <div className="w-[420px]">
            <h1
              className="text-2xl text-gray-700 uppercase"
              style={{
                fontSize: "30.6px",
                cursor: "none",
              }}
            >
              LOGIN TO YOUR ACCOUNT
            </h1>
            <Divider />
            <Form layout="vertical" onFinish={onFinish}>
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
                help="Password is case-sensitive"
                className="mt-9"
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
    
              <Button
                className="mt-7 h-9 ButtonR"
                style={{ boxShadow: "none" }}
                type="primary"
                htmlType="submit"
                block
                loading={buttonLoading}
              >
                {buttonLoading ? "Loading" : "Login"}
              </Button>
    
              <div className="flex justify-center mt-4">
                <span style={{ textAlign: "center", marginTop: "0px" }}>
                  Don't have an account?{" "}
                  <Link
                    className="ps-1"
                    style={{ textDecoration: "none" }}
                    to="/register"
                  >
                    Register
                  </Link>
                </span>
              </div>
    
              <div className="flex justify-center mt-2 underline forgotPass">
                <span>
                  <Link to="http://localhost:3000/forgotPassword">
                    Forgot Password ?
                  </Link>
                </span>
              </div>
    
              {/* Conditionally render the deactivation message if it exists */}
              {deactivationMessage && (
                <div className="flex justify-center mt-2">
                  <div
                    style={{
                      backgroundColor: "#fff3cd",
                      color: "black",
                      padding: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: deactivationMessage.replace(
                          /<a href='\/'>Click here to reactivate<\/a>/g,
                          `<a href="/accountActivate" style="color: blue; text-decoration: underline;"> Click here to reactivate</a>`
                        ),
                      }}
                    />
                  </div>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
  </>
  );
}

export default Login;
// hada kolo lcode jdid li mn wra Original ila derty ctrl+z ghadi tel9a lqdim li kan original






// done with login page alhamdullilah

//  ghadi n7ayed dak scroll inchaelah .. .. 





//  im here to fix last sign in ..