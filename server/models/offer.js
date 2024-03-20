const mongoose = require("mongoose");

// Define the schema for the offer model
const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories", // Reference to the Category model
    required: true,
  },
});

// Create the Offer model
const offerModel = mongoose.model("offer", offerSchema);

module.exports = { offerModel };
