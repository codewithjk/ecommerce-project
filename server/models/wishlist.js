const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  items: {
    type: [mongoose.Schema.Types.ObjectId],
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const wishlistModel = mongoose.model("wishlist", wishlistSchema);
module.exports = { wishlistModel };
