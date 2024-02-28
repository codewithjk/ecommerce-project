const mongoose = require("mongoose");

connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => console.log("db connected"));
  } catch (error) {
    throw error;
  }
};

module.exports = {
  connectDB,
};
