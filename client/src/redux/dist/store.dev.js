"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _usersSlice = _interopRequireDefault(require("./usersSlice"));

var _loadersSlice = _interopRequireDefault(require("./loadersSlice"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var store = (0, _toolkit.configureStore)({
  reducer: {
    users: _usersSlice["default"],
    loaders: _loadersSlice["default"]
  }
});
var _default = store; //  im here to fix last sign in .. .. ..

exports["default"] = _default;