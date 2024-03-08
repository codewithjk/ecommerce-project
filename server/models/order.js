const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  userData: {
    type: Object,
  },
  address: {
    type: Object,
  },
  method: {
    type: String,
  },
  products: { type: Array, required: true },
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returns",
    ],
    default: "Pending",
  },
  subTotal: {
    type: Number,
  },
  discount: {
    type: Number,
    default: 0,
  },
});

const orderModel = mongoose.model("order", orderSchema);

module.exports = { orderModel };
