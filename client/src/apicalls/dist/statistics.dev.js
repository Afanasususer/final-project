"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserStatistics = exports.getProjectStatistics = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// apiCalls/statistics.js
var getProjectStatistics = function getProjectStatistics(userId) {
  return regeneratorRuntime.async(function getProjectStatistics$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("/api/projects/statistics/".concat(userId)));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getProjectStatistics = getProjectStatistics;

var getUserStatistics = function getUserStatistics(userId) {
  return regeneratorRuntime.async(function getUserStatistics$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("/api/users/statistics/".concat(userId)));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getUserStatistics = getUserStatistics;