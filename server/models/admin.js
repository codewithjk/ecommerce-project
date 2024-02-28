const mongoose = require("mongoose");

const { Schema } = mongoose;

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_Admin: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("admin", adminSchema);
