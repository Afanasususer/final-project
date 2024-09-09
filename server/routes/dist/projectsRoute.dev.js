"use strict";

var router = require("express").Router();

var Project = require("../models/projectModel");

var authMiddleware = require("../middlewares/authMiddleware");

var User = require("../models/userModel"); // create a project


router.post("/create-project", authMiddleware, function _callee(req, res) {
  var newProject;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          newProject = new Project(req.body);
          _context.next = 4;
          return regeneratorRuntime.awrap(newProject.save());

        case 4:
          res.send({
            success: true,
            data: newProject,
            message: "Project created successfully"
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.send({
            error: _context.t0.message,
            success: false
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // get all projects

router.post("/get-all-projects", authMiddleware, function _callee2(req, res) {
  var projects;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Project.find({
            owner: req.body.userId
          }).sort({
            createdAt: -1
          }));

        case 3:
          projects = _context2.sent;
          res.send({
            success: true,
            data: projects
          });
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.send({
            error: _context2.t0.message,
            success: false
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // get project by id

router.post("/get-project-by-id", authMiddleware, function _callee3(req, res) {
  var project;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Project.findById(req.body._id).populate("owner").populate("members.user"));

        case 3:
          project = _context3.sent;
          res.send({
            success: true,
            data: project
          });
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.send({
            error: _context3.t0.message,
            success: false
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // get projects by role

router.post("/get-projects-by-role", authMiddleware, function _callee4(req, res) {
  var userId, projects;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = req.body.userId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Project.find({
            "members.user": userId
          }).sort({
            createdAt: -1
          }).populate("owner"));

        case 4:
          projects = _context4.sent;
          res.send({
            success: true,
            data: projects
          });
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          res.send({
            error: _context4.t0.message,
            success: false
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // edit a project

router.post("/edit-project", authMiddleware, function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Project.findByIdAndUpdate(req.body._id, req.body));

        case 3:
          res.send({
            success: true,
            message: "Project updated successfully"
          });
          _context5.next = 9;
          break;

        case 6:
          _context5.prev = 6;
          _context5.t0 = _context5["catch"](0);
          res.send({
            error: _context5.t0.message,
            success: false
          });

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 6]]);
}); // delete a project

router.post("/delete-project", authMiddleware, function _callee6(req, res) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Project.findByIdAndDelete(req.body._id));

        case 3:
          res.send({
            success: true,
            message: "Project deleted successfully"
          });
          _context6.next = 9;
          break;

        case 6:
          _context6.prev = 6;
          _context6.t0 = _context6["catch"](0);
          res.send({
            error: _context6.t0.message,
            success: false
          });

        case 9:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 6]]);
}); // add a member to a project

router.post("/add-member", authMiddleware, function _callee7(req, res) {
  var _req$body, email, role, projectId, user;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$body = req.body, email = _req$body.email, role = _req$body.role, projectId = _req$body.projectId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context7.sent;

          if (user) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", res.send({
            success: false,
            message: "User not found"
          }));

        case 7:
          _context7.next = 9;
          return regeneratorRuntime.awrap(Project.findByIdAndUpdate(projectId, {
            $push: {
              members: {
                user: user._id,
                role: role
              }
            }
          }));

        case 9:
          res.send({
            success: true,
            message: "Member added successfully"
          });
          _context7.next = 15;
          break;

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          res.send({
            error: _context7.t0.message,
            success: false
          });

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // remove a member from a project

router.post("/remove-member", authMiddleware, function _callee8(req, res) {
  var _req$body2, memberId, projectId, project;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body2 = req.body, memberId = _req$body2.memberId, projectId = _req$body2.projectId;
          _context8.next = 4;
          return regeneratorRuntime.awrap(Project.findById(projectId));

        case 4:
          project = _context8.sent;
          project.members.pull(memberId);
          _context8.next = 8;
          return regeneratorRuntime.awrap(project.save());

        case 8:
          res.send({
            success: true,
            message: "Member removed successfully"
          });
          _context8.next = 14;
          break;

        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](0);
          res.send({
            error: _context8.t0.message,
            success: false
          });

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 11]]);
}); // search home page 
// search projects by name

router.post("/search-projects", authMiddleware, function _callee9(req, res) {
  var searchQuery, userId, projects;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          searchQuery = req.body.searchQuery;
          userId = req.body.userId;
          _context9.next = 5;
          return regeneratorRuntime.awrap(Project.find({
            name: {
              $regex: searchQuery,
              $options: "i"
            },
            "members.user": userId
          }).populate("owner"));

        case 5:
          projects = _context9.sent;
          res.send({
            success: true,
            data: projects
          });
          _context9.next = 12;
          break;

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          res.send({
            error: _context9.t0.message,
            success: false
          });

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // forcheckbox in project info page
// routes/projects.js

router.post("/update-project-status", function _callee10(req, res) {
  var _req$body3, _id, status, project;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _req$body3 = req.body, _id = _req$body3._id, status = _req$body3.status;
          _context10.next = 4;
          return regeneratorRuntime.awrap(Project.findByIdAndUpdate(_id, {
            status: status
          }, {
            "new": true
          }));

        case 4:
          project = _context10.sent;

          if (project) {
            _context10.next = 7;
            break;
          }

          return _context10.abrupt("return", res.status(404).send({
            success: false,
            message: "Project not found"
          }));

        case 7:
          res.send({
            success: true,
            data: project
          });
          _context10.next = 13;
          break;

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](0);
          res.status(500).send({
            success: false,
            message: _context10.t0.message
          });

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = router;