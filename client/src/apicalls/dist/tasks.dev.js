"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateScheduledTask = exports.DeleteScheduledTask = exports.GetScheduledTasks = exports.UploadImage = exports.DeleteTask = exports.UpdateTask = exports.GetAllTasks = exports.CreateTask = void 0;

var _ = require(".");

var CreateTask = function CreateTask(task) {
  return regeneratorRuntime.async(function CreateTask$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", (0, _.apiRequest)("post", "/api/tasks/create-task", task));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.CreateTask = CreateTask;

var GetAllTasks = function GetAllTasks(filters) {
  return regeneratorRuntime.async(function GetAllTasks$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", (0, _.apiRequest)("post", "/api/tasks/get-all-tasks", filters));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.GetAllTasks = GetAllTasks;

var UpdateTask = function UpdateTask(task) {
  return regeneratorRuntime.async(function UpdateTask$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", (0, _.apiRequest)("post", "/api/tasks/update-task", task));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.UpdateTask = UpdateTask;

var DeleteTask = function DeleteTask(id) {
  return regeneratorRuntime.async(function DeleteTask$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", (0, _.apiRequest)("post", "/api/tasks/delete-task", {
            _id: id
          }));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.DeleteTask = DeleteTask;

var UploadImage = function UploadImage(payload) {
  return regeneratorRuntime.async(function UploadImage$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", (0, _.apiRequest)("post", "/api/tasks/upload-image", payload));

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // show schdeuled tasks 
// Existing functions...


exports.UploadImage = UploadImage;

var GetScheduledTasks = function GetScheduledTasks() {
  return regeneratorRuntime.async(function GetScheduledTasks$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", (0, _.apiRequest)("get", "/api/tasks/scheduled-tasks"));

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // show schedule task is done الحمدلله donc had hna kolchi lhamdla 5edam mezyan blasst ma knt kan5azen tasks 
// scheduales ghy f array weli kan5azenhoom f database haka kandmn bli maghadich ydi3o w ghaybqaw dima kay-
// nin hta lhad lcomment hada lhamdlah kolchi fine kan9der nafficher schedualed tasks without any problem


exports.GetScheduledTasks = GetScheduledTasks;

var DeleteScheduledTask = function DeleteScheduledTask(id) {
  return regeneratorRuntime.async(function DeleteScheduledTask$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          return _context7.abrupt("return", (0, _.apiRequest)("post", "/api/tasks/delete-scheduled-task", {
            _id: id
          }));

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.DeleteScheduledTask = DeleteScheduledTask;

var UpdateScheduledTask = function UpdateScheduledTask(task) {
  return regeneratorRuntime.async(function UpdateScheduledTask$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          return _context8.abrupt("return", (0, _.apiRequest)("post", "/api/tasks/update-scheduled-task", task));

        case 1:
        case "end":
          return _context8.stop();
      }
    }
  });
}; // update and delete scheduale tasks added seccuessfully
//  i will start working on kol wahed ychof its own schedule tasks 
//  ghadi nbda n5dem 3la dead line  
//  ghadi nbd ngad issue dyal images 
// before schedule edit update 


exports.UpdateScheduledTask = UpdateScheduledTask;