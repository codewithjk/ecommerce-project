const { productModel } = require("../models/product");
const { categoryModel } = require("../models/category");
const { userModel } = require("../models/user");
const { reviewModal } = require("../models/review");
const mongoose = require("mongoose");

const getAllProducts = async () => {
  return await productModel.find();
};
const getAllUsers = async () => {
  return await userModel.find();
};
const getOneProduct = async (id) => {
  const product = await productModel.findById(id);
  return product;
};
const getAllCategories = async () => {
  const categories = await categoryModel.find();
  return categories;
};
const deleteCategory = async (id) => {
  const deletedCategory = await categoryModel.findByIdAndDelete(id);
  return deletedCategory;
};

const getAllReviews = async (id) => {
  try {
    const objId = new mongoose.Types.ObjectId(id);
    const reviews = await reviewModal.aggregate([
      { $match: { product: objId } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          userName: "$userDetails.firstName",
          message: 1,
          rating: 1,
          created: 1,
        },
      },
    ]);
    return reviews;
  } catch (error) {
    console.log(error);
  }
};

const getAllProductByCategory = async (objId) => {
  const products = await productModel.find({ category: objId });
  return products;
};

module.exports = {
  getAllProducts,
  getOneProduct,
  deleteCategory,
  getAllUsers,
  getAllReviews,
  getAllCategories,
  getAllProductByCategory,
};
