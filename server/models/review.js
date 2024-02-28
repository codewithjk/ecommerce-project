const mongoose = require("mongoose");

const { Schema } = mongoose;

const reviewSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const reviewModal = mongoose.model("review", reviewSchema);

module.exports = { reviewModal };
