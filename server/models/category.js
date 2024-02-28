const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema({
  title: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const categoryModel = mongoose.model("categorie", categorySchema);

module.exports = { categoryModel };
