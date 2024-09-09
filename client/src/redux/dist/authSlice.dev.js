"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.logout = exports.loginUser = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _axios = _interopRequireDefault(require("axios"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Async thunk to handle login
var loginUser = (0, _toolkit.createAsyncThunk)("auth/loginUser", function _callee(credentials, _ref) {
  var rejectWithValue, _ref2, data, userWithLastSignIn;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          rejectWithValue = _ref.rejectWithValue;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post("/login", credentials));

        case 4:
          _ref2 = _context.sent;
          data = _ref2.data;
          userWithLastSignIn = _objectSpread({}, data.user, {
            lastSignIn: (0, _moment["default"])().toISOString()
          });
          return _context.abrupt("return", userWithLastSignIn);

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", rejectWithValue(_context.t0.response.data));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
exports.loginUser = loginUser;
var authSlice = (0, _toolkit.createSlice)({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    logout: function logout(state) {
      state.user = null;
    }
  },
  extraReducers: function extraReducers(builder) {
    builder.addCase(loginUser.pending, function (state) {
      state.loading = true;
      state.error = null;
    }).addCase(loginUser.fulfilled, function (state, action) {
      state.loading = false;
      state.user = action.payload;
    }).addCase(loginUser.rejected, function (state, action) {
      state.loading = false;
      state.error = action.payload;
    });
  }
});
var logout = authSlice.actions.logout;
exports.logout = logout;
var _default = authSlice.reducer;
exports["default"] = _default;