import React, { useState } from 'react';
import { Calendar, Modal, Form, Input, DatePicker, Button, message, Select, Tag, List } from 'antd';
import moment from 'moment';
import 'tailwindcss/tailwind.css';

const { Option } = Select;

const Agenda = ({ projectId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('month');

  const handleSelectDate = (value) => {
    setSelectedDate(value);
    setShowModal(true);
  };

  const handleAddTask = (values) => {
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id ? { ...editingTask, ...values, deadline: values.deadline.toISOString() } : task
      );
      setTasks(updatedTasks);
      message.success('Task updated successfully');
    } else {
      // Add new task
      const newTask = {
        ...values,
        projectId,
        deadline: values.deadline.toISOString(),
        id: Math.random().toString(36).substr(2, 9), // Generate a unique ID for the task
      };
      setTasks([...tasks, newTask]);
      message.success('Task added successfully');
    }
    setShowModal(false);
    form.resetFields();
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      name: task.name,
      description: task.description,
      deadline: moment(task.deadline),
      priority: task.priority,
    });
    setShowModal(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    message.success('Task deleted successfully');
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const dayTasks = tasks.filter(task => moment(task.deadline).format('YYYY-MM-DD') === formattedDate);

    return (
      <ul className="events">
        {dayTasks.map(item => (
          <li key={item.id}>
            <Tag color={item.priority === 'important' ? 'red' : 'green'}>
              {item.name}
            </Tag>
          </li>
        ))}
      </ul>
    );
  };

  const headerRender = ({ value, onChange }) => {
    return (
      <div style={{ padding: 8, display: 'flex', justifyContent: 'flex-start' }}>
        <Button 
          onClick={() => setViewMode('month')} 
          disabled={viewMode === 'month'}
          className="mr-2 bg-blue-500 text-white"
        >
          Month
        </Button>
        <Button 
          onClick={() => setViewMode('year')} 
          disabled={viewMode === 'year'} 
          className="bg-blue-500 text-white"
        >
          Year
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">Agenda</h1>
      <p className="text-lg mb-4">Click on any day to schedule a task</p>
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={handleSelectDate}
        className="bg-white rounded-lg shadow-md"
        headerRender={headerRender}
        mode={viewMode}
      />
      <List
        className="mt-4"
        header={<div className="text-lg font-semibold">Tasks</div>}
        bordered
        dataSource={tasks}
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEditTask(item)}>Edit</Button>,
              <Button type="link" danger onClick={() => handleDeleteTask(item.id)}>Delete</Button>
            ]}
          >
            <List.Item.Meta
              title={<span className={`text-${item.priority === 'important' ? 'red' : 'green'}-500`}>{item.name}</span>}
              description={item.description}
            />
            <div>{moment(item.deadline).format('YYYY-MM-DD HH:mm')}</div>
          </List.Item>
        )}
      />
      <Modal
        title={editingTask ? "Edit Task" : "Add Task"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddTask}>
          <Form.Item
            label="Task Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the task name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter the task description' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[{ required: true, message: 'Please select the deadline' }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Please select the priority' }]}
          >
            <Select>
              <Option value="normal">Normal</Option>
              <Option value="important">Important</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full ButtonR mt-4">
              {editingTask ? "Update Task" : "Add Task"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Agenda;
//  done finnaly lhamdllah i fix it  .. .. .. .. 