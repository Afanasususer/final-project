const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    profileImage: String,
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    isDesable: { type: Boolean, default: false },
    deactivatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
