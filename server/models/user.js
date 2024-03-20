const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  avatar: {
    type: String,
    default: "/static/images/avatar-1.jpg",
  },
  facebookId: {
    type: String,
  },
  googleId: {
    type: String,
  },
  status: {
    type: String,
    default: "Active",
  },
  resetPasswordExpires: { type: Date },
  updated: Date,
  created_at: {
    type: Date,
    default: Date.now,
  },
  refferalCode: {
    type: String,
  },
  coupons: { type: Array },
});

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel };
