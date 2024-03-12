const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "categories",
  },
  images: {
    type: Array,
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  sizes: {
    type: Array,
  },
  total_stock: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const productModel = mongoose.model("product", productSchema);

module.exports = { productModel };
