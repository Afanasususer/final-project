import React from "react";
import { Form, Input, message, Button, Modal } from "antd";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

import { SetLoading } from "../../../redux/loadersSlice";
import { useDispatch, useSelector } from "react-redux";

function GeneralForm({ show, setShow, reloadData }) {
  const dispatch = useDispatch();

  const [fileList, setFileList] = React.useState([]);

  const handleOk = () => {
    dispatch(SetLoading(true));

    const formElement = document.querySelector("form");
    const formData = new FormData(formElement);

    // Append files to the form data
    if (fileList.length > 0) {
      formData.append("avatar", fileList[0].originFileObj);
    }

    axios
      .post(formElement.action, formData)
      .then((response) => {
        message.success("Profile picture updated successfully!");
        setShow(false);
        reloadData();
        dispatch(SetLoading(false));
      })
      .catch((error) => {
        dispatch(SetLoading(false));

        // message.error("Error updating profile!");
      });
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <div>
      <Modal
        title="ADD PROFILE"
        open={show}
        onCancel={() => setShow(false)}
        centered
        width={700}
        okText="Change Profile"
        onOk={handleOk}
      >
        <form
          action="/update-profile"
          method="post"
          encType="multipart/form-data"
        >
          <Upload
            name="avatar"
            listType="picture"
            beforeUpload={() => false}
            onChange={handleFileChange}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </form>
      </Modal>
    </div>
  );
}

export default GeneralForm;



//  jit nzid refresh fch ytbdl lprofile .. .. .. .. .. .. .. .. .. .. 