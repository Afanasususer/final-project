import React, { useState } from "react";
import { Button, Modal, message, Input, Divider } from "antd";
import { EditOutlined } from "@ant-design/icons";
import GeneralForm from "./GeneralForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

function Index() {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [newFirstName, setNewFirstName] = useState(user.firstName);
  const [newLastName, setNewLastName] = useState(user.lastName);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      axios
        .post("/del-password")
        .then(
          message.success("message has sent to your email"),
          setConfirmDeleteVisible(false)
        );
    } catch (error) {
      message.error(error.message);
    }
  };

  const changePassword = async () => {
    try {
      await axios.post("/ChangePassword");
      navigate("/internChangePassword");
    } catch (error) {
      navigate("/internChangePassword");
    }
  };

  const handleNameOk = async () => {
    try {
      await axios.post("/ChangeName", {
        firstName: newFirstName,
        lastName: newLastName,
      });
      setIsNameModalVisible(false);
      message.success("Name has been updated");
    } catch (error) {
      setIsNameModalVisible(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-16 bg-transparent">
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-5xl bg-slate-100 relative bg-gradient-to-t from-gray-100 via-white to-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <EditOutlined
            onClick={() => setIsNameModalVisible(true)}
            className="ml-6 cursor-pointer text-xl hover:text-blue-500 transition-colors duration-200"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="flex flex-col items-center justify-between relative">
            <div className="relative w-48 h-48 mb-4">
              <div className="circle border-4 border-gray-300 rounded-full overflow-hidden w-full h-full">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                    onClick={() => setIsImageModalVisible(true)}
                  />
                ) : (
                  <img
                    src="avatar.png"
                    alt="profile"
                    className="w-full h-full object-cover"
                    onClick={() => setIsImageModalVisible(true)}
                  />
                )}
              </div>
              <span
                className={`absolute bottom-6 right-8 w-6 h-6 rounded-full border-2 border-white ${
                  user.online ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ transform: "translate(50%, 50%)" }}
              ></span>
            </div>
            <Button
              type="default"
              className="bg-slate-50 text-black font-semibold py-2 px-4 shadow hover:bg-green-400 hover:text-black transition duration-200 ml-2"
              onClick={() => {
                setShow(true);
              }}
            >
              Change Profile
            </Button>
          </div>

          <div className="flex flex-col justify-between">
            <div className="mb-4 pb-2.5">
              <p className="text-lg font-medium">
                <span className="font-bold">First Name:</span> {user.firstName}
              </p>
              <p className="text-lg font-medium">
                <span className="font-bold">Last Name:</span> {user.lastName}
              </p>
              <p className="text-lg font-medium">
                <span className="font-bold">Email:</span> {user.email}
              </p>
              <p className="text-lg font-medium">
                <span className="font-bold">Member Since:</span>{" "}
                {moment(user.createdAt).format("MMMM Do, YYYY")}
              </p>
              <p className="text-lg font-medium">
                <span className="font-bold">Last Sign In:</span>{" "}
                {moment(user.lastSignIn).fromNow()}
              </p>
              <p className="text-lg font-medium">
                <span className="font-bold">Account Status:</span>{" "}
                {user.verified ? (
                  <span className="text-green-600 font-bold">Verified</span>
                ) : (
                  <span className="text-red-600 font-bold">Not Verified</span>
                )}
              </p>
            </div>
            <div className="flex items-center justify-start mt-4">
              <Button
                type="danger"
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-red-600 transition duration-200 mr-2"
                onClick={() => setConfirmDeleteVisible(true)}
              >
                Deactivate Account
              </Button>
              <Button
                className="bg-yellow-500 text-black font-semibold py-2 px-4 shadow hover:bg-yellow-600 hover:text-black transition duration-200 ml-2"
                onClick={changePassword}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>

        <Modal
          title="Confirm Account Deletion"
          centered
          visible={confirmDeleteVisible}
          onOk={handleDeleteAccount}
          onCancel={() => setConfirmDeleteVisible(false)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Divider />

          <div className="mt-4">
            <p>
              By deactivating your account, you are temporarily suspending your
              access to our services. If you do not reactivate your account
              within 90 days, it will be permanently deleted along with all
              associated data.{" "}
            </p>
            <p>
              Are you sure you want to proceed with deactivating your account?
            </p>
          </div>
        </Modal>

        <Modal
          title="Change Your Name"
          centered
          visible={isNameModalVisible}
          onOk={handleNameOk}
          onCancel={() => setIsNameModalVisible(false)}
        >
          <Divider />

          <div className="mt-4 mb-8">
            <label className="block font-semibold mb-2">First Name:</label>

            <Input
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
              placeholder="First Name"
              className="mb-2"
            />
            <label className="block font-semibold mb-2 mt-2">Last Name:</label>

            <Input
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
        </Modal>

        <Modal
          visible={isImageModalVisible}
          footer={null}
          onCancel={() => setIsImageModalVisible(false)}
          centered
          bodyStyle={{ padding: 0 }}
        >
          <img
            src={user.profileImage || "avatar.png"}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </Modal>

        {show && <GeneralForm show={show} setShow={setShow} />}
      </div>
    </div>
  );
}

export default Index;
//  hada lcode jdid lhamdllah zedto mn ba3d ma zedt red dot and hetit lpen lfoo9 f top .. .. ..

//  >> done lhamdullilah .. .. ..

//  jit nagd reload data ... fch nbdl lprofile  .. .. ..

//  jit ngad last sign in .. .. .. blach last sign li 3andi m5eyra, katbyenlk imta akhir mera derty
// sing in houa ah besah dima fch ghadi d5el ghadi tla3lk a few momnet .. .
// wallakin fch ghatkon f app moda twila ghadi tweli te3raf ch7al w nta online ...

//  nfixi last sign in hiya b rassha .. .. .. .. .. .. .. .. .. ... .. ..

//  ghadi n7awel is desible l verifiedd ... ....


//  done lhamdllah .. .. verified done .. .. .. 