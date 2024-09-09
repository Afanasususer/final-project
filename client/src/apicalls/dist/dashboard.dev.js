"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDashboardData = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getDashboardData = function getDashboardData(userId) {
  var response;
  return regeneratorRuntime.async(function getDashboardData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post('/api/dashboard/get-dashboard-data', {
            userId: userId
          }));

        case 3:
          response = _context.sent;
          return _context.abrupt("return", response.data);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching dashboard data:', _context.t0);
          return _context.abrupt("return", {
            success: false,
            message: _context.t0.message
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getDashboardData = getDashboardData;