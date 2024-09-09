const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const ScheduledTask = require('../models/scheduledTaskModel');
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

router.post('/get-dashboard-data', async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error('User not found');
    }

    const userId = user._id.toString();

    // Fetch all projects where the user is a member
    const allProjects = await Project.find({ 'members.user': userId }).populate('owner members.user');

    // Filter projects where the user is the owner
    const ownedProjects = allProjects.filter(project => project.owner && project.owner._id.toString() === userId);

    // Filter projects where the user is an admin
    const adminProjects = allProjects.filter(project =>
      project.members.some(member => member.user && member.user._id.toString() === userId && member.role === 'admin')
    );

    // Filter projects where the user is an employee
    const employeeProjects = allProjects.filter(project =>
      project.members.some(member => member.user && member.user._id.toString() === userId && member.role === 'employee')
    );

    // Filter active and inactive projects
    const activeProjects = allProjects.filter(project => project.status.toLowerCase() === 'active');
    const inactiveProjects = allProjects.filter(project => project.status.toLowerCase() !== 'active');

    // Fetch all tasks related to projects where the user is a member
    const projectIds = allProjects.map(project => project._id);
    const allTasks = await Task.find({ project: { $in: projectIds } }).populate('project');

    const tasksAssignedToUser = allTasks.filter(task => task.assignedTo && task.assignedTo._id.toString() === userId);
    const tasksCreatedByUser = allTasks.filter(task => task.assignedBy && task.assignedBy._id.toString() === userId);

    // Fetch all scheduled tasks created by the user
    const scheduledTasks = await ScheduledTask.find({ createdBy: userId });

    // Calculate the interval between the first and last scheduled tasks
    const scheduledTasksInterval = scheduledTasks.length > 0
      ? `${new Date(scheduledTasks[0].scheduledTime).toLocaleString()} - ${new Date(scheduledTasks[scheduledTasks.length - 1].scheduledTime).toLocaleString()}`
      : 'No scheduled tasks';

    res.send({
      success: true,
      data: {
        totalProjects: allProjects.length,
        ownedProjects: ownedProjects.length,
        adminProjects: adminProjects.length,
        employeeProjects: employeeProjects.length,
        activeProjects: activeProjects.length,
        inactiveProjects: inactiveProjects.length,
        projectStatus: [
          { name: 'Active', value: activeProjects.length },
          { name: 'Inactive', value: inactiveProjects.length },
        ],
        taskDistribution: [
          { name: 'Assigned to Me', value: tasksAssignedToUser.length },
          { name: 'Created by Me', value: tasksCreatedByUser.length },
        ],
        scheduledTasks,
        scheduledTasksInterval,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
