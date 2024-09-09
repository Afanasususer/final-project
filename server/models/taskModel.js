const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true, 
      default: "pending",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    attachments: {
      type: Array,
      default : []
    },
    deadline: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("tasks", taskSchema);
//  original codes before scheduale task 



//  ghadi nbda n5dem 3la dead line 



//  ghadi n5de 3la edit dyal schedule task 