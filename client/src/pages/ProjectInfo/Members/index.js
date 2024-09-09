import { Button, message, Table, Tag, Select, Input, Avatar } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RemoveMemberFromProject } from "../../../apicalls/projects";
import { SetLoading } from "../../../redux/loadersSlice";
import MemberForm from "./MemberForm";
import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

function Members({ project, reloadData }) {
  const [role, setRole] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [showMemberForm, setShowMemberForm] = React.useState(false);
  const { user } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const isOwner = project.owner._id === user._id;

  const deleteMember = async (memberId) => {
    try {
      dispatch(SetLoading(true));
      const response = await RemoveMemberFromProject({
        projectId: project._id,
        memberId,
      });
      if (response.success) {
        if (memberId !== user._id) {
          reloadData();
        }
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Profile",
      dataIndex: "profileImage",
      render: (text, record) => (
        <Avatar src={record.user.profileImage || "avatar.png"} size="large" />
      ),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      render: (text, record) => (
        <span>
          {record.user.firstName}{" "}
          {record.user.isDesable && (
            <Tag color="red" className="ml-2">
              Deactivated
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      render: (text, record) => record.user.lastName,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => record.user.email,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => record.role.toUpperCase(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <div className="flex items-center">
          <span
            className={`w-2.5 h-2.5 rounded-full mr-2 ${
              record.user.isDesable || !record.user.online ? "bg-red-500" : "bg-green-500"
            }`}
          ></span>
          {record.user.isDesable || !record.user.online ? "Offline" : "Online"}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        if (isOwner || record.user._id === user._id) {
          return (
            <Button type="link" danger onClick={() => deleteMember(record._id)} icon={<DeleteOutlined />}>
              Remove
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-2"
        />
        <div className="flex justify-between items-center mt-5 mb-4">
          <div className="w-48">
            <span className="text-gray-700">Select Role</span>
            <Select
              onChange={(value) => setRole(value)}
              value={role}
              className="w-full"
            >
              <Option value="">All</Option>
              <Option value="employee">Employee</Option>
              <Option value="admin">Admin</Option>
              <Option value="owner">Owner</Option>
            </Select>
          </div>
          {isOwner && (
            <Button
              type="default"
              onClick={() => setShowMemberForm(true)}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-200"
            >
              Add Member
            </Button>
          )}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={project.members.filter((member) => {
          const matchesRole = role === "" || member.role === role;
          const matchesSearch =
            member.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            member.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            member.user.email.toLowerCase().includes(search.toLowerCase());
          return matchesRole && matchesSearch;
        })}
        className="mt-4"
        pagination={{ pageSize: 4 }}
      />

      {showMemberForm && (
        <MemberForm
          showMemberForm={showMemberForm}
          setShowMemberForm={setShowMemberForm}
          reloadData={reloadData}
          project={project}
        />
      )}
    </div>
  );
}

export default Members;


//  hadi lhamdllah zedt biha online w offline f table w halit lmochkila dyal fx kikon deactivated .. maytla3ch 
// onlina had xi f halat ila fach deactivite laccount dert refsresh w machi logout .. .. .. 



//  ghadi nbda n5dem inchaelah 3la lproblem dyal fch wahed luser kidir remove l rasso .. .. .. 
//  jit bch n5dem 3la redirect mn ba3d ma wahed y5arej rasso mnwahed lproject .. .. .. l9it lerr kiji mn index
// dya project info .. .. .. 