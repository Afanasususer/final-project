"use strict";

// scheduler.js
var cron = require("node-cron");

var Task = require("./models/taskModel");

var ScheduledTask = require("./models/scheduledTaskSchema");

var moment = require("moment"); // Run every minute


cron.schedule("* * * * *", function _callee() {
  var dueTasks, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, scheduledTask, newTask;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(ScheduledTask.find({
            scheduleTime: {
              $lte: moment().toISOString()
            }
          }));

        case 3:
          dueTasks = _context.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 7;
          _iterator = dueTasks[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 19;
            break;
          }

          scheduledTask = _step.value;
          // Create the task
          newTask = new Task(scheduledTask.taskData);
          _context.next = 14;
          return regeneratorRuntime.awrap(newTask.save());

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(ScheduledTask.findByIdAndDelete(scheduledTask._id));

        case 16:
          _iteratorNormalCompletion = true;
          _context.next = 9;
          break;

        case 19:
          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 25:
          _context.prev = 25;
          _context.prev = 26;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 28:
          _context.prev = 28;

          if (!_didIteratorError) {
            _context.next = 31;
            break;
          }

          throw _iteratorError;

        case 31:
          return _context.finish(28);

        case 32:
          return _context.finish(25);

        case 33:
          _context.next = 38;
          break;

        case 35:
          _context.prev = 35;
          _context.t1 = _context["catch"](0);
          console.error("Error processing scheduled tasks:", _context.t1);

        case 38:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 35], [7, 21, 25, 33], [26,, 28, 32]]);
});