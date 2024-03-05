const { productModel } = require("../models/product");
const { categoryModel } = require("../models/category");
const { userModel } = require("../models/user");
const { reviewModal } = require("../models/review");
const { addressModel } = require("../models/address");
const { cartModel } = require("../models/cart");
const { orderModel } = require("../models/order");
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

const updateItemCount = async (userId, itemId, count) => {
  const updatedItem = await cartModel.findOneAndUpdate(
    {
      userId: userId,
      "items.productId": itemId,
    },
    {
      $set: { "items.$.quantity": count },
    }
  );
  return updatedItem;
};

/////////
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

const getAddressById = async (id) => {
  try {
    const address = await addressModel.findById(id);
    return address;
  } catch (error) {
    console.log(error);
  }
};

const createOrder = async (
  userId,
  username,
  address,
  products,
  amount,
  method
) => {
  try {
    const order = new orderModel({
      userId: userId,
      customer: username,
      address: address,
      products: products,
      totalAmount: amount,
      method: method,
    });
    const newOrder = await order.save();
    return newOrder;
  } catch (error) {
    console.log(error);
  }
};
const getAllOrderAdmin = async () => {
  try {
    // const orders = orderModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "customers",
    //       localField: "customer._id",
    //       foreignField: "_id",
    //       as: "customerDetails",
    //     },
    //   },
    //   {
    //     $unwind: "$products",
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       CustomerName: { $first: "$customerDetails.firstName" },

    //       ProductNames: { $push: "$products.title" },
    //       TotalAmount: { $first: "$totalAmount" },
    //       Status: { $first: "$status" },
    //       Method: { $first: "$method" },
    //       OrderDate: { $first: "$orderDate" },
    //     },
    //   },
    // ]);
    // return orders;

    const orders = await orderModel.find();

    const formattedOrders = orders.map((order) => ({
      customerName: order.customer,
      productNames: order.products.map((product) => product.title),
      totalAmount: order.totalAmount,
      status: order.status,
      method: order.method,
      orderDate: order.orderDate,
    }));
    return formattedOrders;
  } catch (error) {
    console.log(error);
  }
};

//user orders
const getOrdersByUserId = async (id) => {
  try {
    const orders = await orderModel.find({ userId: id });

    const formattedOrders = orders.map((order) => ({
      // customerName: order.customer,
      productNames: order.products.map((product) => product.title),
      totalAmount: order.totalAmount,
      status: order.status,
      // method: order.method,
      orderDate: order.orderDate,
    }));

    return formattedOrders;
  } catch (error) {
    console.log(error);
  }
};

const deleteAddressById = async (id) => {
  try {
    const deletedAddress = await addressModel.findByIdAndDelete(id);
    return deletedAddress;
  } catch (error) {
    console.log(error);
  }
};

const removeAllItemFromCart = async (userId) => {
  try {
    const deletedCart = await cartModel.findOneAndDelete({ userId: userId });
    return deletedCart;
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
  updateItemCount,
  getAddressById,
  createOrder,
  getAllOrderAdmin,
  getOrdersByUserId,
  deleteAddressById,
  removeAllItemFromCart,
};
