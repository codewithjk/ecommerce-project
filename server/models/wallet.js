const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  history: {
    type: Array,
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

const walletModel = mongoose.model("wallet", walletSchema);
module.exports = { walletModel };
