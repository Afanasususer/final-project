"use strict";

var mongoose = require("mongoose");

var scheduledTaskSchema = new mongoose.Schema({
  scheduledTime: {
    type: Date,
    required: true
  },
  taskData: {
    type: Object,
    required: true
  },
  created: {
    type: Boolean,
    "default": false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Reference to the User model
    required: true
  }
});
module.exports = mongoose.model("ScheduledTask", scheduledTaskSchema); //  daba gahdi ndewz scheduled l profile
// before schedule edit update