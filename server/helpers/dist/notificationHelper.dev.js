"use strict";

var Notification = require("../models/notificationsModel"); // Assuming you have a notification model
// Function to add a notification


var addNotification = function addNotification(_ref) {
  var title, user, onClick, description, newNotification;
  return regeneratorRuntime.async(function addNotification$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          title = _ref.title, user = _ref.user, onClick = _ref.onClick, description = _ref.description;
          _context.prev = 1;
          newNotification = new Notification({
            title: title,
            user: user,
            onClick: onClick,
            description: description,
            read: false
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(newNotification.save());

        case 5:
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          console.error("Error sending notification:", _context.t0.message);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
};

module.exports = {
  addNotification: addNotification
};