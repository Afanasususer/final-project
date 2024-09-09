"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.SetNotifications = exports.SetAllUsers = exports.SetUser = void 0;

var _toolkit = require("@reduxjs/toolkit");

var usersSlice = (0, _toolkit.createSlice)({
  name: "users",
  initialState: {
    user: null,
    allUsers: [],
    notifications: []
  },
  reducers: {
    SetUser: function SetUser(state, action) {
      state.user = action.payload;
    },
    SetAllUsers: function SetAllUsers(state, action) {
      state.allUsers = action.payload;
    },
    SetNotifications: function SetNotifications(state, action) {
      state.notifications = action.payload;
    }
  }
});
var _usersSlice$actions = usersSlice.actions,
    SetUser = _usersSlice$actions.SetUser,
    SetAllUsers = _usersSlice$actions.SetAllUsers,
    SetNotifications = _usersSlice$actions.SetNotifications;
exports.SetNotifications = SetNotifications;
exports.SetAllUsers = SetAllUsers;
exports.SetUser = SetUser;
var _default = usersSlice.reducer; // original code
//  original code .. .. 

exports["default"] = _default;