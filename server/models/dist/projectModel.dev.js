"use strict";

var mongoose = require("mongoose");

var memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  role: {
    type: String,
    required: true
  }
});
var projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    "default": "active"
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  members: [memberSchema]
}, {
  timestamps: true
});
module.exports = mongoose.model("projects", projectSchema); // after add comment section