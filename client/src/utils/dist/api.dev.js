"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetScheduledTasks = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _antd = require("antd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiRequest = function apiRequest(method, endpoint) {
  var data,
      token,
      response,
      _args = arguments;
  return regeneratorRuntime.async(function apiRequest$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = _args.length > 2 && _args[2] !== undefined ? _args[2] : null;
          _context.prev = 1;
          token = localStorage.getItem("token");
          _context.next = 5;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: method,
            url: "/api".concat(endpoint),
            data: data,
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 5:
          response = _context.sent;
          return _context.abrupt("return", response.data);

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);

          _antd.message.error(_context.t0.message || "Something went wrong!");

          throw _context.t0;

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

var GetScheduledTasks = function GetScheduledTasks() {
  return regeneratorRuntime.async(function GetScheduledTasks$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", apiRequest("get", "/tasks/scheduled-tasks"));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // Add other API functions as needed


exports.GetScheduledTasks = GetScheduledTasks;