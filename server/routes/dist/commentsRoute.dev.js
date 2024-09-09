"use strict";

var express = require("express");

var router = express.Router();

var Project = require("../models/projectModel"); // Get comments for a project


router.get('/:projectId/comments', function _callee(req, res) {
  var project;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Project.findById(req.params.projectId).populate('comments.user', 'firstName lastName profileImage'));

        case 3:
          project = _context.sent;

          if (project) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Project not found"
          }));

        case 6:
          res.status(200).json(project.comments);
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Error fetching comments",
            error: _context.t0
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // Add a new comment

router.post('/:projectId/comments', function _callee2(req, res) {
  var project, newComment, updatedProject;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Project.findById(req.params.projectId));

        case 3:
          project = _context2.sent;

          if (project) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Project not found"
          }));

        case 6:
          newComment = {
            comment: req.body.comment,
            user: req.body.user
          };
          project.comments.push(newComment);
          _context2.next = 10;
          return regeneratorRuntime.awrap(project.save());

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(Project.findById(req.params.projectId).populate('comments.user', 'firstName lastName profileImage'));

        case 12:
          updatedProject = _context2.sent;
          res.status(201).json(updatedProject.comments);
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Error adding comment",
            error: _context2.t0
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
module.exports = router;