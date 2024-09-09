import React, { useEffect, useState } from "react";
import {
  Card as AntCard,
  Modal,
  Select,
  Upload,
  Button,
  List,
  Popconfirm,
  message,
  Avatar as AntAvatar,
  Image as AntImage,
  Typography,
  Input,
} from "antd";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;
const { Text, Title } = Typography;
const { TextArea, Search } = Input;

function FileSharing({ project, user }) {
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [memberFilter, setMemberFilter] = useState("all");

  useEffect(() => {
    const storedFiles = localStorage.getItem(`files_${project._id}`);
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles));
    }
  }, [project._id]);

  const handleFileUpload = () => {
    if (
      !selectedMember ||
      fileList.length === 0 ||
      !title.trim() ||
      !description.trim()
    ) {
      message.error("Please fill out all fields and select a file.");
      return;
    }

    const file = fileList[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const newFile = {
        id: Date.now(),
        name: file.name,
        url: e.target.result,
        type: file.type,
        sender: user,
        recipient: selectedMember,
        title: title,
        description: description,
        timestamp: new Date().toISOString(),
      };

      const updatedFiles = [...uploadedFiles, newFile];
      setUploadedFiles(updatedFiles);
      localStorage.setItem(
        `files_${project._id}`,
        JSON.stringify(updatedFiles)
      );
      setFileList([]);
      setFileModalVisible(false);
      setTitle("");
      setDescription("");
    };

    reader.readAsDataURL(file);
  };

  const handleFileDelete = (fileId) => {
    const updatedFiles = uploadedFiles.filter((file) => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    localStorage.setItem(`files_${project._id}`, JSON.stringify(updatedFiles));
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  const renderPreviewContent = () => {
    if (!previewFile) return null;

    if (previewFile.type.startsWith("image/")) {
      return (
        <AntImage
          src={previewFile.url}
          alt={previewFile.name}
          style={{ width: "100%" }}
        />
      );
    } else if (previewFile.type === "application/pdf") {
      return (
        <embed
          src={previewFile.url}
          type="application/pdf"
          width="100%"
          height="600px"
        />
      );
    } else {
      return <p>Preview not available for this file type.</p>;
    }
  };

  // Filter files to only include those sent by or to the current user
  const sentFiles = uploadedFiles.filter(
    (file) =>
      file.sender._id === user._id &&
      (memberFilter === "all" || file.recipient._id === memberFilter)
  );
  const receivedFiles = uploadedFiles.filter(
    (file) =>
      file.recipient._id === user._id &&
      (memberFilter === "all" || file.sender._id === memberFilter)
  );
  const filteredSentFiles = sentFiles.filter(
    (file) =>
      file.title && file.title.toLowerCase().includes(searchTitle.toLowerCase())
  );
  const filteredReceivedFiles = receivedFiles.filter(
    (file) =>
      file.title && file.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <AntCard bordered={false} className="rounded-lg p-4">
      <Title level={2} className="text-center text-blue-500 mb-6">
        Assignment Submission
      </Title>
      <Text type="secondary" className="block text-center mb-6">
        Use this page to send your assignments to the person who gave you the
        task. You can also see the assignments you've received.
      </Text>

      <div className="flex items-center mb-6">
        <Search
          placeholder="Search by title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="flex-grow mr-4"
        />
        <Select
          placeholder="Filter by member"
          style={{ width: 200, marginRight: 16 }}
          onChange={(value) => setMemberFilter(value)}
          defaultValue="all"
        >
          <Option value="all">All</Option>
          {project.members.map((member) => (
            <Option key={member.user._id} value={member.user._id}>
              {member.user.firstName} {member.user.lastName}{" "}
              <span style={{ color: "#999", fontSize: "0.85em" }}>
                ({member.user.email}, {member.role})
              </span>
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={() => setFileModalVisible(true)}
          style={{ backgroundColor: "#4A90E2", borderColor: "#4A90E2" }}
        >
          Share a File
        </Button>
      </div>

      <Title level={4} className="text-blue-500 mb-2">
        Sent Files
      </Title>
      <List
        itemLayout="horizontal"
        dataSource={filteredSentFiles}
        renderItem={(file) => (
          <List.Item
            actions={[
              <Popconfirm
                title="Are you sure you want to delete this file?"
                onConfirm={() => handleFileDelete(file.id)}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className="text-red-500 hover:text-red-700" />
              </Popconfirm>,
            ]}
            className="hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <List.Item.Meta
              avatar={
                <AntAvatar src={user.profileImage} alt={user.firstName} />
              }
              title={
                <Button
                  type="link"
                  onClick={() => handlePreview(file)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {file.title}
                </Button>
              }
              description={`Sent to ${file.recipient.firstName} ${
                file.recipient.lastName
              } at ${moment(file.timestamp).format("MMMM Do YYYY, h:mm:ss a")}`}
            />
          </List.Item>
        )}
      />

      <div className="my-12"></div>

      <Title level={4} className="text-blue-500 mb-2">
        Received Files
      </Title>
      <List
        itemLayout="horizontal"
        dataSource={filteredReceivedFiles}
        renderItem={(file) => (
          <List.Item className="hover:bg-gray-100 rounded-lg transition-all duration-200">
            <List.Item.Meta
              avatar={
                <AntAvatar
                  src={file.sender.profileImage}
                  alt={file.sender.firstName}
                />
              }
              title={
                <Button
                  type="link"
                  onClick={() => handlePreview(file)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {file.title}
                </Button>
              }
              description={`Sent by ${file.sender.firstName} ${
                file.sender.lastName
              } at ${moment(file.timestamp).format("MMMM Do YYYY, h:mm:ss a")}`}
            />
          </List.Item>
        )}
      />

      <Modal
        title="Share a File"
        visible={fileModalVisible}
        onCancel={() => setFileModalVisible(false)}
        onOk={handleFileUpload}
        centered
        className="rounded-lg"
      >
        <Select
          placeholder="Select a member"
          style={{ width: "100%", marginBottom: 16 }}
          onChange={(value) =>
            setSelectedMember(
              project.members.find((member) => member.user._id === value).user
            )
          }
        >
          {project.members.map((member) => (
            <Option key={member.user._id} value={member.user._id}>
              {member.user.firstName} {member.user.lastName}{" "}
              <span style={{ color: "#999", fontSize: "0.85em" }}>
                ({member.user.email}, {member.role})
              </span>
            </Option>
          ))}
        </Select>

        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <TextArea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
          Please note: PDF file sizes should be small for better performance.
        </Text>

        <Upload.Dragger
          fileList={fileList}
          beforeUpload={(file) => {
            setFileList([file]);
            return false;
          }}
          onRemove={() => setFileList([])}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      </Modal>

      <Modal
        title="   "
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
      >
        <Title level={5}>{previewFile ? previewFile.title : "Preview"}</Title>
        <Text>{previewFile ? previewFile.description : ""}</Text>
        {renderPreviewContent()}
      </Modal>
    </AntCard>
  );
}

export default FileSharing;
