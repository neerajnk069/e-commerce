const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  countryCode: { type: Number, required: false },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: false },
  otp: { type: String, required: false },
  socketId: { type: String, required: false },
  otpExpire: { type: Date },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 0,
    Comment: "0 for Inactive, 1 for active",
  },
  loginAt: { type: Date },
  logoutAt: { type: Date },
  image: { type: String },
  role: {
    type: Number,
    enum: [0, 1], // 0 = admin, 1 = user
    default: 1,
  },
});

module.exports = mongoose.model("user", userSchema);
