const { productModel } = require("../models/product");
const { categoryModel } = require("../models/category");
const { userModel } = require("../models/user");
const { reviewModal } = require("../models/review");
const { addressModel } = require("../models/address");
const { cartModel } = require("../models/cart");
const { orderModel } = require("../models/order");
const { wishlistModel } = require("../models/wishlist");
const { walletModel } = require("../models/wallet");
const { couponModel } = require("../models/coupon");
const mongoose = require("mongoose");
const { offerModel } = require("../models/offer");

const getAllProducts = async (limit, skip) => {
  return await productModel.find().limit(limit).skip(skip);
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
      status: 1,
      refferalCode: 1,
      coupons: 1,
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
          discount: "$product.discount",
          quantity: "$items.quantity",
          image: { $arrayElemAt: ["$product.images", 0] }, // Get the first image
          size: "$items.size",
          couponDiscount: 1,
        },
      },
    ]);
    console.log(cartItems);
    couponDiscount = await cartModel.findOne(
      { userId: userId },
      { couponDiscount: 1 }
    );
    return { cartItems, couponDiscount };
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

const addItemToCart = async (userId, itemId, size, quantity) => {
  try {
    const newItem = await cartModel.findOneAndUpdate(
      {
        userId: userId,
        items: { $not: { $elemMatch: { productId: itemId } } },
      },
      {
        $addToSet: {
          items: { productId: itemId, size: size, quantity: quantity },
        },
      },
      { new: true, upsert: true }
    );
    console.log("this is cart item added now", newItem);
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
const searchProducts = async (query, limit, skip) => {
  try {
    const result = await productModel
      .find({
        title: { $regex: ".*" + query + ".*", $options: "i" },
      })
      .limit(limit)
      .skip(skip);
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
  user,
  address,
  products,
  amount,
  method
) => {
  try {
    const order = new orderModel({
      userId: userId,
      customer: username,
      userData: user,
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
    const orders = await orderModel.find();

    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
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
      orderId: order._id,
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

const deleteImage = async (stringToRemove, id) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $pull: { images: stringToRemove } },
      { new: true }
    );

    if (!updatedProduct) {
      console.log("Failed to update product");
      return false;
    }

    console.log(
      `Successfully pulled "${stringToRemove}" from images and updated product`
    );
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

const getOrderById = async (id) => {
  try {
    const order = await orderModel.findById(id);
    return order;
  } catch (error) {
    console.log(error);
  }
};

const changeOrderStatus = async (id, status) => {
  try {
    const result = orderModel.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};
const addItemToWishlist = async (userId, itemId) => {
  try {
    const filter = { userId: userId };
    const update = { $addToSet: { items: itemId } };
    const options = { new: true, upsert: true };

    const newItem = await wishlistModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    console.log(newItem);
    // const newWishlist = await wishlistModel.findOne(
    //   { userId: userId },
    //   { new: true, upsert: true }
    // );
    // console.log("new whish list=========", newWishlist);
    // const wishlistId = newWishlist._id;
    // console.log(wishlistId);
    // const newItem = await walletModel.findOneAndUpdate(
    //   { _id: wishlistId },
    //   {
    //     $addToSet: { items: itemId },
    //   },
    //   { new: true }
    // );
    // console.log("pushed item===", newItem);
    return newItem;
  } catch (error) {
    console.log(error);
  }
};
const removeItemToWishlist = async (userId, itemId) => {
  try {
    const removedItem = await wishlistModel.findOneAndUpdate(
      {
        userId: userId,
      },
      { $pull: { items: itemId } },
      { new: true }
    );
    return removedItem;
  } catch (error) {
    console.log(error);
  }
};
const getWishlistByUserId = async (userId) => {
  try {
    const wishlist = await wishlistModel.findOne({ userId: userId });
    return wishlist;
  } catch (error) {
    console.log(error);
  }
};

const getDetailedWishlist = async (userId) => {
  try {
    const result = await wishlistModel.aggregate([
      // Match documents based on userId
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      // Lookup Product details for items in the Wishlist
      {
        $lookup: {
          from: "products",
          localField: "items",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $unwind: {
          path: "$result",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          "result._id": 1,
          "result.title": 1,
          "result.images": 1,
          "result.price": 1,
          "result.total_stock": 1,
          "result.discount": 1,
        },
      },
      // Replace the root with the "result" field
      {
        $replaceRoot: { newRoot: "$result" },
      },
    ]);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function createNewWallet(userId) {
  try {
    const newWallet = await walletModel.create({ userId });
    return newWallet;
  } catch (error) {
    console.error("Error creating new wallet:", error);
    throw error;
  }
}
async function getWalletByUserId(userId) {
  try {
    const Wallet = await walletModel.findOne({ userId: userId });
    return Wallet;
  } catch (error) {
    console.error("Error creating new wallet:", error);
    throw error;
  }
}

async function refundOrderById(orderId) {
  try {
    const order = await orderModel.findById(orderId);
    const userId = order.userId;
    const totalAmount = order.totalAmount;
    console.log(userId, totalAmount);
    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, {
      is_refunded: true,
    });
    const wallet = await walletModel.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          history: {
            name: "Refund",
            description: `You got refund for your calncelled order. of ${order.products[0].title}`,
            amount: totalAmount,
          },
        },
        $inc: { balance: totalAmount },
      },
      { new: true }
    );
    if (updatedOrder !== null && wallet !== null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error creating new wallet:", error);
    throw error;
  }
}

//for chart data
async function getDailyDataOfWeek() {
  try {
    // Get the start and end date of the current week
    const currentDate = new Date();
    const startOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    const endOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() + 6
    );

    // Fetch orders for the current week from the database
    const orders = await orderModel.find({
      orderDate: { $gte: startOfWeek, $lte: endOfWeek },
    });
    const ordersByDay = Array(7).fill(0);
    orders.forEach((order) => {
      const dayOfWeek = order.orderDate.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday)
      ordersByDay[dayOfWeek]++;
    });

    // Fetch refunded orders for the current week
    const refundedOrders = await orderModel.find({
      orderDate: { $gte: startOfWeek, $lte: endOfWeek },
      is_refunded: true,
    });
    const refundedAmount = Array(7).fill(0);
    refundedOrders.forEach((order) => {
      const dayOfWeek = order.orderDate.getDay();
      refundedAmount[dayOfWeek] += order.totalAmount;
    });
    console.log("refunded orders amount sum ===  ", refundedAmount);

    //fetch successfull orders
    const successfullOrders = await orderModel.find({
      orderDate: { $gte: startOfWeek, $lte: endOfWeek },
      is_refunded: false,
      status: "Delivered",
    });
    const earnings = Array(7).fill(0);
    successfullOrders.forEach((order) => {
      const dayOfWeek = order.orderDate.getDay();
      earnings[dayOfWeek] += order.totalAmount;
    });
    console.log("total earnings ===  ", earnings);

    return { orders: ordersByDay, earnings: earnings, refunds: refundedAmount };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
// async function getWeeklyDataOfMonth() {
//   try {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();

//     // Get the first and last day of the current month
//     const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
//     const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

//     // Initialize arrays to store data for each week of the month
//     const earningsByWeek = Array(5).fill(0); // Assuming 5 weeks maximum in a month
//     const refundedAmountByWeek = Array(5).fill(0); // Assuming 5 weeks maximum in a month

//     // Iterate over each day of the month
//     for (
//       let currentDay = firstDayOfMonth;
//       currentDay <= lastDayOfMonth;
//       currentDay.setDate(currentDay.getDate() + 1)
//     ) {
//       // Calculate the week number for the current day (1-5)
//       const weekNumber =
//         Math.ceil(
//           (currentDay.getDate() -
//             firstDayOfMonth.getDate() +
//             1 +
//             firstDayOfMonth.getDay()) /
//             7
//         ) - 1;

//       // Fetch successfull orders for the current day from the database
//       const successfullOrders = await orderModel.find({
//         orderDate: {
//           $gte: currentDay,
//           $lte: new Date(
//             currentDay.getFullYear(),
//             currentDay.getMonth(),
//             currentDay.getDate(),
//             23,
//             59,
//             59
//           ),
//         },
//         is_refunded: false,
//         status: "Delivered",
//       });

//       // Calculate total earnings for the current day
//       const totalEarnings = successfullOrders.reduce(
//         (acc, order) => acc + order.totalAmount,
//         0
//       );

//       // Add total earnings for the current day to the corresponding week's earnings
//       earningsByWeek[weekNumber] += totalEarnings;

//       // Fetch refunded orders for the current day from the database
//       const refundedOrders = await orderModel.find({
//         orderDate: {
//           $gte: currentDay,
//           $lte: new Date(
//             currentDay.getFullYear(),
//             currentDay.getMonth(),
//             currentDay.getDate(),
//             23,
//             59,
//             59
//           ),
//         },
//         is_refunded: true,
//       });

//       // Calculate sum of totalAmount for refunded orders for the current day
//       const totalRefundedAmount = refundedOrders.reduce(
//         (acc, order) => acc + order.totalAmount,
//         0
//       );

//       // Add total refunded amount for the current day to the corresponding week's refunded amount
//       refundedAmountByWeek[weekNumber] += totalRefundedAmount;
//     }

//     return { earnings: earningsByWeek, refundedAmount: refundedAmountByWeek };
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

async function getWeeklyDataOfMonth() {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get the first and last day of the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Initialize arrays to store data for each week of the month
    const ordersByWeek = Array(5).fill(0); // Assuming 5 weeks maximum in a month
    const earningsByWeek = Array(5).fill(0); // Assuming 5 weeks maximum in a month
    const refundedAmountByWeek = Array(5).fill(0); // Assuming 5 weeks maximum in a month

    // Iterate over each day of the month
    for (
      let currentDay = firstDayOfMonth;
      currentDay <= lastDayOfMonth;
      currentDay.setDate(currentDay.getDate() + 1)
    ) {
      // Calculate the week number for the current day (1-5)
      const weekNumber =
        Math.ceil(
          (currentDay.getDate() -
            firstDayOfMonth.getDate() +
            1 +
            firstDayOfMonth.getDay()) /
            7
        ) - 1;

      // Fetch orders for the current day from the database
      const orders = await orderModel.find({
        orderDate: {
          $gte: currentDay,
          $lte: new Date(
            currentDay.getFullYear(),
            currentDay.getMonth(),
            currentDay.getDate(),
            23,
            59,
            59
          ),
        },
      });

      // Calculate total number of orders for the current day
      const totalOrders = orders.length;

      // Add total orders for the current day to the corresponding week's orders
      ordersByWeek[weekNumber] += totalOrders;

      // Fetch successfull orders for the current day from the database
      const successfullOrders = orders.filter(
        (order) => !order.is_refunded && order.status === "Delivered"
      );

      // Calculate total earnings for the current day
      const totalEarnings = successfullOrders.reduce(
        (acc, order) => acc + order.totalAmount,
        0
      );

      // Add total earnings for the current day to the corresponding week's earnings
      earningsByWeek[weekNumber] += totalEarnings;

      // Fetch refunded orders for the current day from the database
      const refundedOrders = orders.filter((order) => order.is_refunded);

      // Calculate sum of totalAmount for refunded orders for the current day
      const totalRefundedAmount = refundedOrders.reduce(
        (acc, order) => acc + order.totalAmount,
        0
      );

      // Add total refunded amount for the current day to the corresponding week's refunded amount
      refundedAmountByWeek[weekNumber] += totalRefundedAmount;
    }

    return {
      orders: ordersByWeek,
      earnings: earningsByWeek,
      refunds: refundedAmountByWeek,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getMonthlyDataOfYear() {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Initialize arrays to store data for each month of the year
    const ordersByMonth = Array(12).fill(0);
    const earningsByMonth = Array(12).fill(0);
    const refundedAmountByMonth = Array(12).fill(0);

    // Iterate over each month of the year
    for (let month = 0; month < 12; month++) {
      // Get the first and last day of the current month
      const firstDayOfMonth = new Date(currentYear, month, 1);
      const lastDayOfMonth = new Date(currentYear, month + 1, 0);

      // Fetch orders for the current month from the database
      const orders = await orderModel.find({
        orderDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
      });

      // Calculate total number of orders for the current month
      const totalOrders = orders.length;

      // Add total orders for the current month to the corresponding month's orders
      ordersByMonth[month] = totalOrders;

      // Fetch successfull orders for the current month from the database
      const successfullOrders = orders.filter(
        (order) => !order.is_refunded && order.status === "Delivered"
      );

      // Calculate total earnings for the current month
      const totalEarnings = successfullOrders.reduce(
        (acc, order) => acc + order.totalAmount,
        0
      );

      // Add total earnings for the current month to the corresponding month's earnings
      earningsByMonth[month] = totalEarnings;

      // Fetch refunded orders for the current month from the database
      const refundedOrders = orders.filter((order) => order.is_refunded);

      // Calculate sum of totalAmount for refunded orders for the current month
      const totalRefundedAmount = refundedOrders.reduce(
        (acc, order) => acc + order.totalAmount,
        0
      );

      // Add total refunded amount for the current month to the corresponding month's refunded amount
      refundedAmountByMonth[month] = totalRefundedAmount;
    }

    return {
      orders: ordersByMonth,
      earnings: earningsByMonth,
      refunds: refundedAmountByMonth,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//stock management
// Function to decrease quantity for each product
async function decreaseProductQuantities(data) {
  console.log(data);
  try {
    for (const item of data) {
      const product = await productModel.findById(item._id, { _id: 0 });
      if (!product) {
        console.log(`Product with ID ${item._id} not found.`);
        continue;
      }
      const sizeIndex = product.sizes.findIndex((size) =>
        size.hasOwnProperty(item.size)
      );
      if (sizeIndex === -1) {
        console.log(
          `Size ${item.size} not found for product with ID ${item._id}.`
        );
        continue;
      }
      const sizeKey = Object.keys(product.sizes[sizeIndex])[0]; // Extract the size key
      product.sizes[sizeIndex][sizeKey] -= item.quantity;
      product.total_stock -= item.quantity;
      console.log(sizeKey, sizeIndex);
      console.log("asdfghjkl=========", product.sizes[sizeIndex][sizeKey]);
      const updated = await productModel.findByIdAndUpdate(item._id, product, {
        new: true,
      });
      console.log("updated ======== === ", updated);
    }

    console.log("Product quantities updated successfully.");
    return true;
  } catch (error) {
    console.error("Error updating product quantities:", error);
  }
}
//function to increase the quantity when use cancel and return
async function increaseProductQuantities(data) {
  console.log(data);
  try {
    for (const item of data) {
      const product = await productModel.findById(item._id, { _id: 0 });
      if (!product) {
        console.log(`Product with ID ${item._id} not found.`);
        continue;
      }
      const sizeIndex = product.sizes.findIndex((size) =>
        size.hasOwnProperty(item.size)
      );
      if (sizeIndex === -1) {
        console.log(
          `Size ${item.size} not found for product with ID ${item._id}.`
        );
        continue;
      }
      const sizeKey = Object.keys(product.sizes[sizeIndex])[0]; // Extract the size key
      product.sizes[sizeIndex][sizeKey] += item.quantity;
      product.total_stock += item.quantity;
      console.log(sizeKey, sizeIndex);
      console.log("asdfghjkl=========", product.sizes[sizeIndex][sizeKey]);
      const updated = await productModel.findByIdAndUpdate(item._id, product, {
        new: true,
      });
      console.log("updated ======== === ", updated);
    }

    console.log("Product quantities updated successfully.");
    return true;
  } catch (error) {
    console.error("Error updating product quantities:", error);
  }
}

//coupon
async function createCoupon(data) {
  try {
    const Coupon = new couponModel(data);
    const newCoupon = await Coupon.save();
    return newCoupon;
  } catch (error) {
    console.log(error);
  }
}
async function getAllCoupons() {
  try {
    const coupons = await couponModel.find();
    return coupons;
  } catch (error) {
    console.log(error);
  }
}
async function findCoupon(amount) {
  try {
    console.log(amount);
    const coupon = await couponModel.findOne({
      limit: { $lt: amount },
    });
    return coupon;
  } catch (error) {
    console.log(error);
  }
}
async function giveCouponToUser(userId, coupon, code) {
  try {
    const addCoupon = await userModel.findByIdAndUpdate(
      userId,
      { $push: { coupons: { coupon, code, is_expired: false } } },
      { new: true }
    );
    return addCoupon;
  } catch (error) {
    console.log(error);
  }
}

// async function applyCouponToCart(userId, code) {
//   // const user = await userModel.findById(userId);

//   try {
//     const user = await userModel.findOneAndUpdate(
//       { "coupons.code": code, "coupons.is_expired": false },
//       { $set: { "coupons.$.is_expired": true } },
//       { new: true }
//     );

//     console.log("user after updating coupon=====", user);
//     if (user !== null) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

async function applyCouponToCart(userId, code, totalAmount) {
  try {
    const user = await userModel.findById(userId);

    const coupon = user.coupons.find((c) => c.code === code);

    if (!coupon) {
      return { message: "Invalid coupon code!" };
    }

    if (coupon.is_expired) {
      return { message: "Coupon is already expired." };
    }

    const couponDiscount = coupon.coupon.discount;
    const couponCondition = coupon.coupon.condition;

    if (couponCondition <= totalAmount) {
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: userId, "coupons.code": code, "coupons.is_expired": false },
        { $set: { "coupons.$.is_expired": true } },
        { new: true }
      );

      await cartModel.findOneAndUpdate(
        { userId: userId },
        { couponDiscount: couponDiscount }
      );

      console.log("User after updating coupon:", updatedUser);

      if (updatedUser) {
        return {
          message: "coupon successfully applied ",
          discount: couponDiscount,
        };
      } else {
        return { message: "Error updating coupon." };
      }
    } else {
      return {
        message: `Coupon condition not met. bill amount lesser then ${couponCondition}`,
      };
    }
  } catch (error) {
    console.log("Error applying coupon to cart:", error);
    throw error; // Or handle the error appropriately
  }
}

async function deleteCoupon(id) {
  try {
    const deletedCoupon = await couponModel.findByIdAndDelete(id, {
      new: true,
    });
    if (deletedCoupon !== null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

//Offer
async function createOffer(data) {
  try {
    const Offer = new offerModel(data);
    const newOffer = await Offer.save();
    return newOffer;
  } catch (error) {
    console.log(error);
  }
}
async function getAllOffers() {
  try {
    const offer = await offerModel.find();
    return offer;
  } catch (error) {
    console.log(error);
  }
}

async function getOfferByCategoryId(categoryId) {
  try {
    const offers = await offerModel.find({ category: categoryId });
    return offers;
  } catch (error) {
    console.log(error);
  }
}

async function addMoneyToWallet(userId, title, message, amount) {
  try {
    const user = await userModel.findById(userId);
    if (user !== null) {
      const wallet = await walletModel.findOneAndUpdate(
        { userId: user._id },
        {
          $push: {
            history: {
              name: title,
              description: message,
              amount: amount,
            },
          },
          $inc: { balance: amount },
        },
        { new: true }
      );
      console.log(wallet);
    }
  } catch (error) {
    console.log(error);
  }
}

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
  deleteImage,
  getOrderById,
  changeOrderStatus,
  addItemToWishlist,
  removeItemToWishlist,
  getWishlistByUserId,
  getDetailedWishlist,
  createNewWallet,
  getWalletByUserId,
  getDailyDataOfWeek,
  getWeeklyDataOfMonth,
  getMonthlyDataOfYear,
  refundOrderById,
  decreaseProductQuantities,
  increaseProductQuantities,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  findCoupon,
  giveCouponToUser,
  applyCouponToCart,
  createOffer,
  getAllOffers,
  getOfferByCategoryId,
  addMoneyToWallet,
};
