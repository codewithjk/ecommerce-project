const mongoose = require("mongoose");

const { Schema } = mongoose;

const otpSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  otp: {
    type: String,
    required: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
    expires: "5m",
    set: (created_at) => new Date(created_at),
    get: (created_at) => created_at.getTime(),
  },
});

module.exports = mongoose.model("otp", otpSchema);
