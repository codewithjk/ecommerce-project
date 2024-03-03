const { productModel } = require("../models/product");
const { categoryModel } = require("../models/category");
const { userModel } = require("../models/user");
const { reviewModal } = require("../models/review");
const { addressModel } = require("../models/address");
const { cartModel } = require("../models/cart");
const mongoose = require("mongoose");

const getAllProducts = async () => {
  return await productModel.find();
};
const getAllUsers = async () => {
  return await userModel.find();
};
const getUserByEmail = async (email) => {
  return await userModel.findOne({ email: email });
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
const getUserById = async (id) => {
  const user = await userModel.findOne(
    { _id: id },
    {
      firstName: 1,
      lastName: 1,
      email: 1,
      created: 1,
      phoneNumber: 1,
      created_at: 1,
      avatar: 1,
    }
  );
  return user;
};

const getAddressByUid = async (id) => {
  const addresses = await addressModel.find({ userId: id });
  return addresses;
};

//user profile
const updateAddress = async (id, data) => {
  const address = await addressModel.findByIdAndUpdate(id, data);
  return address;
};

const addAddress = async (data) => {
  const address = new addressModel(data);
  const result = await address.save();
  return result;
};
const updateProfile = async (id, data) => {
  const updatedProfile = await userModel.findByIdAndUpdate(id, data);
  return updatedProfile;
};

const getCartByUserId = async (userId) => {
  try {
    const cartItems = await cartModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Match cart for specific user
      { $unwind: "$items" }, // Unwind cart items array
      {
        $lookup: {
          // Perform a join with the products collection to get product details
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" }, // Unwind the product array
      {
        $project: {
          // Project only the required fields
          _id: "$product._id",
          title: "$product.title",
          price: "$product.price",
          total_stock: "$product.total_stock",
          quantity: "$items.quantity",
          image: { $arrayElemAt: ["$product.images", 0] }, // Get the first image
        },
      },
    ]);
    return cartItems;
  } catch (error) {
    console.log(error);
  }
};

const deleteFromCart = async (userId, itemId) => {
  try {
    const cart = await cartModel.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { productId: itemId } } }
    );

    return cart;
  } catch (error) {
    console.log(error);
  }
};

const addItemToCart = async (userId, itemId) => {
  try {
    const newItem = await cartModel.findOneAndUpdate(
      {
        userId: userId,
        items: { $not: { $elemMatch: { productId: itemId } } },
      },
      { $addToSet: { items: { productId: itemId } } },
      { new: true, upsert: true }
    );

    return newItem;
  } catch (error) {
    console.log(error);
  }
};
const searchProducts = async (query) => {
  try {
    const result = await productModel.find({
      title: { $regex: ".*" + query + ".*", $options: "i" },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
  getOneProduct,
  deleteCategory,
  getAllUsers,
  getAllReviews,
  getAllCategories,
  getAllProductByCategory,
  getUserByEmail,
  getUserById,
  getAddressByUid,
  updateAddress,
  addAddress,
  updateProfile,
  getCartByUserId,
  deleteFromCart,
  addItemToCart,
  searchProducts,
};
