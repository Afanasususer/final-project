"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var router = require("express").Router();

var Task = require("../models/taskModel");

var Project = require("../models/projectModel");

var User = require("../models/userModel");

var authMiddleware = require("../middlewares/authMiddleware");

var cloudinary = require("../config/cloudinaryConfig");

var multer = require("multer");

var cron = require('node-cron');

var moment = require('moment'); // To handle date and time comparison


var ScheduledTask = require("../models/scheduledTaskModel"); // Import the ScheduledTask model


var jwt = require("jsonwebtoken"); // **********************


var _require = require("../helpers/notificationHelper"),
    addNotification = _require.addNotification; // Import the helper function
//********************** */
// db ghadi ndoz n5dem 3la notif ywssal inchaelah
// create a task
// Create a Map to store the cron jobs


var cronJobs = new Map();
router.post("/create-task", authMiddleware, function _callee2(req, res) {
  var newTask, token, decoded, _req$body, scheduledTime, taskData, scheduledTask, job;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!(req.body.scheduledTime === null)) {
            _context2.next = 8;
            break;
          }

          newTask = new Task(req.body);
          _context2.next = 5;
          return regeneratorRuntime.awrap(newTask.save());

        case 5:
          res.send({
            success: true,
            message: "Task created successfully",
            data: newTask
          });
          _context2.next = 17;
          break;

        case 8:
          token = req.cookies.jwt;
          decoded = jwt.verify(token, process.env.jwt_secret);
          _req$body = req.body, scheduledTime = _req$body.scheduledTime, taskData = _objectWithoutProperties(_req$body, ["scheduledTime"]);
          scheduledTask = new ScheduledTask({
            scheduledTime: scheduledTime,
            taskData: taskData,
            createdBy: decoded.userId // Assign createdBy from decoded token

          });
          _context2.next = 14;
          return regeneratorRuntime.awrap(scheduledTask.save());

        case 14:
          job = cron.schedule('* * * * *', function _callee() {
            var now, scheduledMoment, task, _newTask, project;

            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    now = moment();
                    scheduledMoment = moment(scheduledTask.scheduledTime);
                    _context.next = 4;
                    return regeneratorRuntime.awrap(ScheduledTask.findById(scheduledTask._id));

                  case 4:
                    task = _context.sent;

                    if (task) {
                      _context.next = 8;
                      break;
                    }

                    // Task was deleted
                    this.stop();
                    return _context.abrupt("return");

                  case 8:
                    if (!(now.isSameOrAfter(scheduledMoment) && !task.created)) {
                      _context.next = 21;
                      break;
                    }

                    _newTask = new Task(task.taskData);
                    _context.next = 12;
                    return regeneratorRuntime.awrap(_newTask.save());

                  case 12:
                    console.log('Scheduled task created successfully at:', now.format());
                    task.created = true;
                    _context.next = 16;
                    return regeneratorRuntime.awrap(task.save());

                  case 16:
                    _context.next = 18;
                    return regeneratorRuntime.awrap(Project.findById(task.taskData.project).select('name'));

                  case 18:
                    project = _context.sent;
                    addNotification({
                      title: "You have been assigned a new task in ".concat(project.name),
                      user: task.taskData.assignedTo,
                      onClick: "/project/".concat(task.taskData.project),
                      description: task.taskData.description
                    }); // *************************************

                    this.stop();

                  case 21:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, this);
          });
          cronJobs.set(scheduledTask._id.toString(), job);
          res.send({
            success: true,
            message: "Task will be created at the scheduled time",
            scheduledTime: scheduledTime
          });

        case 17:
          _context2.next = 22;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          res.send({
            success: false,
            message: _context2.t0.message
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 19]]);
}); // Get all scheduled tasks

router.get("/scheduled-tasks", authMiddleware, function _callee3(req, res) {
  var token, decoded, _scheduledTasks;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          token = req.cookies.jwt;
          decoded = jwt.verify(token, process.env.jwt_secret);
          _context3.next = 5;
          return regeneratorRuntime.awrap(ScheduledTask.find({
            createdBy: decoded.userId
          }));

        case 5:
          _scheduledTasks = _context3.sent;
          res.send({
            success: true,
            message: "Scheduled tasks fetched successfully",
            data: _scheduledTasks
          });
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.send({
            success: false,
            message: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // Delete scheduled task

router.post("/delete-scheduled-task", authMiddleware, function _callee4(req, res) {
  var jobId, job;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          jobId = req.body._id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ScheduledTask.findByIdAndDelete(jobId));

        case 4:
          job = cronJobs.get(jobId);

          if (job) {
            job.stop();
            cronJobs["delete"](jobId);
          }

          res.send({
            success: true,
            message: "Scheduled task deleted successfully"
          });
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.send({
            success: false,
            message: _context4.t0.message
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // Update scheduled task

router.post("/update-scheduled-task", authMiddleware, function _callee6(req, res) {
  var _req$body2, _id, scheduledTime, taskData, scheduledTask, existingJob, job;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$body2 = req.body, _id = _req$body2._id, scheduledTime = _req$body2.scheduledTime, taskData = _req$body2.taskData; // Find the existing scheduled task

          _context6.next = 4;
          return regeneratorRuntime.awrap(ScheduledTask.findById(_id));

        case 4:
          scheduledTask = _context6.sent;

          if (scheduledTask) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.send({
            success: false,
            message: "Scheduled task not found"
          }));

        case 7:
          // Stop the existing cron job if it exists
          existingJob = cronJobs.get(_id);

          if (existingJob) {
            existingJob.stop();
            cronJobs["delete"](_id);
          } // Update the scheduled task in the database


          scheduledTask.scheduledTime = scheduledTime;
          scheduledTask.taskData = taskData;
          _context6.next = 13;
          return regeneratorRuntime.awrap(scheduledTask.save());

        case 13:
          // Schedule a new cron job with the updated time
          job = cron.schedule('* * * * *', function _callee5() {
            var now, scheduledMoment, task, newTask;
            return regeneratorRuntime.async(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    now = moment();
                    scheduledMoment = moment(scheduledTask.scheduledTime);
                    _context5.next = 4;
                    return regeneratorRuntime.awrap(ScheduledTask.findById(scheduledTask._id));

                  case 4:
                    task = _context5.sent;

                    if (task) {
                      _context5.next = 8;
                      break;
                    }

                    // Task was deleted
                    this.stop();
                    return _context5.abrupt("return");

                  case 8:
                    if (!(now.isSameOrAfter(scheduledMoment) && !task.created)) {
                      _context5.next = 17;
                      break;
                    }

                    newTask = new Task(task.taskData);
                    _context5.next = 12;
                    return regeneratorRuntime.awrap(newTask.save());

                  case 12:
                    console.log('Scheduled task created successfully at:', now.format());
                    task.created = true;
                    _context5.next = 16;
                    return regeneratorRuntime.awrap(task.save());

                  case 16:
                    this.stop();

                  case 17:
                  case "end":
                    return _context5.stop();
                }
              }
            }, null, this);
          }); // Save the new cron job in the map

          cronJobs.set(scheduledTask._id.toString(), job);
          res.send({
            success: true,
            message: "Scheduled task updated successfully"
          });
          _context6.next = 21;
          break;

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](0);
          res.send({
            success: false,
            message: _context6.t0.message
          });

        case 21:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 18]]);
}); // get all tasks

router.post("/get-all-tasks", authMiddleware, function _callee7(req, res) {
  var tasks;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          Object.keys(req.body).forEach(function (key) {
            if (req.body[key] === "all") {
              delete req.body[key];
            }
          });
          delete req.body["userId"];
          _context7.next = 5;
          return regeneratorRuntime.awrap(Task.find(req.body).populate("assignedTo").populate("assignedBy").populate("project").sort({
            createdAt: -1
          }));

        case 5:
          tasks = _context7.sent;
          res.send({
            success: true,
            message: "Tasks fetched successfully",
            data: tasks
          });
          _context7.next = 12;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          res.send({
            success: false,
            message: _context7.t0.message
          });

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // update task
// router.post("/update-task", authMiddleware, async (req, res) => {
//   try {
//     await Task.findByIdAndUpdate(req.body._id, req.body);
//     res.send({
//       success: true,
//       message: "Task updated successfully",
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });
// update task

router.post("/update-task", authMiddleware, function _callee8(req, res) {
  var existingTask, oldStatus, newStatus, task;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(Task.findById(req.body._id));

        case 3:
          existingTask = _context8.sent;

          if (existingTask) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", res.send({
            success: false,
            message: "Task not found"
          }));

        case 6:
          oldStatus = existingTask.status;
          newStatus = req.body.status;
          _context8.next = 10;
          return regeneratorRuntime.awrap(Task.findByIdAndUpdate(req.body._id, req.body));

        case 10:
          if (!(oldStatus === newStatus || newStatus === undefined)) {
            _context8.next = 15;
            break;
          }

          _context8.next = 13;
          return regeneratorRuntime.awrap(Task.findById(req.body._id).populate('assignedTo'));

        case 13:
          task = _context8.sent;

          if (task.assignedTo) {
            addNotification({
              title: 'Task Updated',
              user: task.assignedTo._id,
              onClick: "/project/".concat(existingTask.project),
              description: "The task \"".concat(task.name, "\" information has been updated.")
            });
          }

        case 15:
          res.send({
            success: true,
            message: "Task updated successfully"
          });
          _context8.next = 21;
          break;

        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](0);
          res.send({
            success: false,
            message: _context8.t0.message
          });

        case 21:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 18]]);
}); // delete task

router.post("/delete-task", authMiddleware, function _callee9(req, res) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(Task.findByIdAndDelete(req.body._id));

        case 3:
          res.send({
            success: true,
            message: "Task deleted successfully"
          });
          _context9.next = 9;
          break;

        case 6:
          _context9.prev = 6;
          _context9.t0 = _context9["catch"](0);
          res.send({
            success: false,
            message: _context9.t0.message
          });

        case 9:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 6]]);
}); // create multer storage

var storage = multer.diskStorage({
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
}); // /////////////////////////// hada awel far9
// Create multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads'); // Define the destination folder where files will be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Define the file name
//   },
// });
//////////////////////////////////
// router.post("/upload-image", authMiddleware, multer({ storage: storage }).single("file"), async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "tasks",
//     });
//     const imageURL = result.secure_url;
//     await Task.findOneAndUpdate(
//       { _id: req.body.taskId },
//       {
//         $push: {
//           attachments: imageURL,
//         },
//       }
//     );
//     res.send({
//       success: true,
//       message: "Image uploaded successfully",
//       data: imageURL,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });
//  new one for multiple images 
// const storage = multer.diskStorage({});

var upload = multer({
  storage: storage
});
router.post("/upload-image", authMiddleware, upload.array("files", 10), function _callee11(req, res) {
  var _task$attachments, taskId, files, imageUploadPromises, uploadedImages, task;

  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          taskId = req.body.taskId;
          files = req.files;
          imageUploadPromises = files.map(function _callee10(file) {
            var result;
            return regeneratorRuntime.async(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.next = 2;
                    return regeneratorRuntime.awrap(cloudinary.uploader.upload(file.path, {
                      folder: "tasks"
                    }));

                  case 2:
                    result = _context10.sent;
                    return _context10.abrupt("return", result.secure_url);

                  case 4:
                  case "end":
                    return _context10.stop();
                }
              }
            });
          });
          _context11.next = 6;
          return regeneratorRuntime.awrap(Promise.all(imageUploadPromises));

        case 6:
          uploadedImages = _context11.sent;
          _context11.next = 9;
          return regeneratorRuntime.awrap(Task.findById(taskId));

        case 9:
          task = _context11.sent;

          (_task$attachments = task.attachments).push.apply(_task$attachments, _toConsumableArray(uploadedImages));

          _context11.next = 13;
          return regeneratorRuntime.awrap(task.save());

        case 13:
          res.send({
            success: true,
            message: "Images uploaded successfully",
            data: uploadedImages
          });
          _context11.next = 19;
          break;

        case 16:
          _context11.prev = 16;
          _context11.t0 = _context11["catch"](0);
          res.send({
            success: false,
            message: _context11.t0.message
          });

        case 19:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 16]]);
}); // **********************************************************************
// Delete a scheduled task

router["delete"]("/scheduled-task/:id", authMiddleware, function (req, res) {
  try {
    var taskId = req.params.id;
    scheduledTasks = scheduledTasks.filter(function (task) {
      return task._id !== taskId;
    });
    res.send({
      success: true,
      message: "Scheduled task deleted successfully"
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
}); // Edit a scheduled task

router.put("/scheduled-task/:id", authMiddleware, function (req, res) {
  try {
    var taskId = req.params.id;
    var updatedTask = req.body;
    scheduledTasks = scheduledTasks.map(function (task) {
      return task._id === taskId ? _objectSpread({}, task, {}, updatedTask) : task;
    });
    res.send({
      success: true,
      message: "Scheduled task updated successfully",
      data: updatedTask
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
});
module.exports = router; // original code before schedule task now
// show schedule task is done الحمدلله donc had hna kolchi lhamdla 5edam mezyan blasst ma knt kan5azen tasks 
// scheduales ghy f array weli kan5azenhoom f database haka kandmn bli maghadich ydi3o w ghaybqaw dima kay-
// nin hta lhad lcomment hada lhamdlah kolchi fine kan9der nafficher schedualed tasks without any problem
// update and delete scheduale tasks added seccuessfully
// lhamdlah sla7t lmochkila dyal anah fch wahed task kictrea, katweli created w n9der nms7o mn schedule
//  .. wallakin ana khalito ma ytmsa7ch bghito ybqa w tweli tal3a created 
// now ill start fix delete .. 
// i fixed delete schedule task lhamdullilah .. 
// now ill start fix update date of schedule in edit 
// now i will start working on every one can see only they scheduale task im still here 
//  daba gahdi ndewz scheduled l profile
//  i will start fixing the error message in create scheduale task 
// ghadi nebda n5dem 3la notif f schedule task inchaelah .. 
//  ghadi nbda n5dem 3la dead line
//  ghadi nbd ngad issue dyal images 
// before schedule edit update
//  ana hna bch n5dem 3la fch yo9a3 update lwahd task ytserd wahed notif l user li te3ta lih had task .. ..