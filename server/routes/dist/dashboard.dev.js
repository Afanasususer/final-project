"use strict";

var express = require('express');

var router = express.Router();

var Project = require('../models/projectModel');

var Task = require('../models/taskModel');

var ScheduledTask = require('../models/scheduledTaskModel');

var User = require("../models/userModel");

var jwt = require("jsonwebtoken");

router.post('/get-dashboard-data', function _callee(req, res) {
  var token, decoded, user, userId, allProjects, ownedProjects, adminProjects, employeeProjects, activeProjects, inactiveProjects, projectIds, allTasks, tasksAssignedToUser, tasksCreatedByUser, scheduledTasks, scheduledTasksInterval;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.cookies.jwt;
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          _context.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            _id: decoded.userId
          }));

        case 5:
          user = _context.sent;

          if (user) {
            _context.next = 8;
            break;
          }

          throw new Error('User not found');

        case 8:
          userId = user._id.toString(); // Fetch all projects where the user is a member

          _context.next = 11;
          return regeneratorRuntime.awrap(Project.find({
            'members.user': userId
          }).populate('owner members.user'));

        case 11:
          allProjects = _context.sent;
          // Filter projects where the user is the owner
          ownedProjects = allProjects.filter(function (project) {
            return project.owner && project.owner._id.toString() === userId;
          }); // Filter projects where the user is an admin

          adminProjects = allProjects.filter(function (project) {
            return project.members.some(function (member) {
              return member.user && member.user._id.toString() === userId && member.role === 'admin';
            });
          }); // Filter projects where the user is an employee

          employeeProjects = allProjects.filter(function (project) {
            return project.members.some(function (member) {
              return member.user && member.user._id.toString() === userId && member.role === 'employee';
            });
          }); // Filter active and inactive projects

          activeProjects = allProjects.filter(function (project) {
            return project.status.toLowerCase() === 'active';
          });
          inactiveProjects = allProjects.filter(function (project) {
            return project.status.toLowerCase() !== 'active';
          }); // Fetch all tasks related to projects where the user is a member

          projectIds = allProjects.map(function (project) {
            return project._id;
          });
          _context.next = 20;
          return regeneratorRuntime.awrap(Task.find({
            project: {
              $in: projectIds
            }
          }).populate('project'));

        case 20:
          allTasks = _context.sent;
          tasksAssignedToUser = allTasks.filter(function (task) {
            return task.assignedTo && task.assignedTo._id.toString() === userId;
          });
          tasksCreatedByUser = allTasks.filter(function (task) {
            return task.assignedBy && task.assignedBy._id.toString() === userId;
          }); // Fetch all scheduled tasks created by the user

          _context.next = 25;
          return regeneratorRuntime.awrap(ScheduledTask.find({
            createdBy: userId
          }));

        case 25:
          scheduledTasks = _context.sent;
          // Calculate the interval between the first and last scheduled tasks
          scheduledTasksInterval = scheduledTasks.length > 0 ? "".concat(new Date(scheduledTasks[0].scheduledTime).toLocaleString(), " - ").concat(new Date(scheduledTasks[scheduledTasks.length - 1].scheduledTime).toLocaleString()) : 'No scheduled tasks';
          res.send({
            success: true,
            data: {
              totalProjects: allProjects.length,
              ownedProjects: ownedProjects.length,
              adminProjects: adminProjects.length,
              employeeProjects: employeeProjects.length,
              activeProjects: activeProjects.length,
              inactiveProjects: inactiveProjects.length,
              projectStatus: [{
                name: 'Active',
                value: activeProjects.length
              }, {
                name: 'Inactive',
                value: inactiveProjects.length
              }],
              taskDistribution: [{
                name: 'Assigned to Me',
                value: tasksAssignedToUser.length
              }, {
                name: 'Created by Me',
                value: tasksCreatedByUser.length
              }],
              scheduledTasks: scheduledTasks,
              scheduledTasksInterval: scheduledTasksInterval
            }
          });
          _context.next = 34;
          break;

        case 30:
          _context.prev = 30;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching dashboard data:', _context.t0);
          res.status(500).send({
            success: false,
            message: _context.t0.message
          });

        case 34:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 30]]);
});
module.exports = router;