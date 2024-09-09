"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteAllNotifications = exports.MarkNotificationAsRead = exports.GetAllNotifications = exports.AddNotification = void 0;

var _require = require("."),
    apiRequest = _require.apiRequest;

var AddNotification = function AddNotification(notification) {
  return regeneratorRuntime.async(function AddNotification$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", apiRequest("post", "/api/notifications/add-notification", notification));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.AddNotification = AddNotification;

var GetAllNotifications = function GetAllNotifications() {
  return regeneratorRuntime.async(function GetAllNotifications$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", apiRequest("get", "/api/notifications/get-all-notifications"));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.GetAllNotifications = GetAllNotifications;

var MarkNotificationAsRead = function MarkNotificationAsRead(id) {
  return regeneratorRuntime.async(function MarkNotificationAsRead$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", apiRequest("post", "/api/notifications/mark-as-read"));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.MarkNotificationAsRead = MarkNotificationAsRead;

var DeleteAllNotifications = function DeleteAllNotifications() {
  return regeneratorRuntime.async(function DeleteAllNotifications$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", apiRequest("delete", "/api/notifications/delete-all-notifications"));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.DeleteAllNotifications = DeleteAllNotifications;