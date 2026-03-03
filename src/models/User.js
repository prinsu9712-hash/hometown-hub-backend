const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, select: false },
  hometown: String,
  role: {
    type: String,
    enum: ["USER", "MODERATOR", "ADMIN"],
    default: "USER"
  },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);