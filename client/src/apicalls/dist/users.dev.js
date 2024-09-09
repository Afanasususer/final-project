"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteAccount = exports.SinginUser = exports.GetLoggedInUser = exports.LoginUser = exports.RegisterUser = void 0;

var _require = require("."),
    apiRequest = _require.apiRequest;

var RegisterUser = function RegisterUser(payload) {
  return regeneratorRuntime.async(function RegisterUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", apiRequest('post', '/api/users/register', payload));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.RegisterUser = RegisterUser;

var LoginUser = function LoginUser(payload) {
  return regeneratorRuntime.async(function LoginUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", apiRequest('post', '/api/users/login', payload));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.LoginUser = LoginUser;

var GetLoggedInUser = function GetLoggedInUser() {
  return regeneratorRuntime.async(function GetLoggedInUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", apiRequest('get', '/api/users/get-logged-in-user'));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // fakeUser


exports.GetLoggedInUser = GetLoggedInUser;

var SinginUser = function SinginUser(payload) {
  return regeneratorRuntime.async(function SinginUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", apiRequest('post', '/api/users/login/new', payload));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // Delete user account


exports.SinginUser = SinginUser;

var DeleteAccount = function DeleteAccount() {
  return regeneratorRuntime.async(function DeleteAccount$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", apiRequest('delete', '/api/users/delete-account'));

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.DeleteAccount = DeleteAccount;