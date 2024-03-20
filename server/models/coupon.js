const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  title: { type: String, required: true },
  limit: { type: Number, required: true },
  condition: { type: String, required: true }, //condition to claim
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  discount: { type: Number, required: true },
  count: { type: Number, require: true },
  image: { type: String },
});

const couponModel = mongoose.model("coupon", couponSchema);

module.exports = { couponModel };
