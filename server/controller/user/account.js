const {
  getUserById,
  getAddressByUid,
  updateAddress,
  addAddress,
  updateProfile,
  deleteAddressById,
  addItemToWishlist,
  removeItemToWishlist,
  getWishlistByUserId,
  getDetailedWishlist,
  getOrderById,
  getWalletByUserId,
  increaseProductQuantities,
  addMoneyToWallet,
} = require("../../helper/dbQueries");
const { orderModel } = require("../../models/order");
const { walletModel } = require("../../models/wallet");

const Razorpay = require("razorpay");
const crypto = require("crypto");
const HttpStatusCodes = require("../../constants/HttpStatusCodes");
const { RAZORPAY_CLIENT_ID, RAZORPAY_CLIENT_SECRET } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_CLIENT_ID,
  key_secret: RAZORPAY_CLIENT_SECRET,
});

exports.getAccountPage = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await getUserById(userId);
    const wallet = await walletModel.findOne({ userId: userId });
    console.log(user.coupons);
    
    res.render("account", { user: user, wallet: wallet });
  } catch (error) {
    console.log(error);
    res.render("clientError");
  }
};

exports.getAddressOfUser = async (req, res) => {
  const userId = req.user.sub;

  const addresses = await getAddressByUid(userId);

  res.status(HttpStatusCodes.OK).json({ addresses: addresses });
};

exports.editAddress = async (req, res) => {
  try {
    const id = req.body.id;
    const data = {
      fullName: req.body.fullName,
      addressLine1: req.body.addressLine1,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      phoneNumber: req.body.phoneNumber,
    };

    const updatedAddress = await updateAddress(id, data);
    if (updatedAddress !== null) {
      res.status(HttpStatusCodes.OK).json({ message: "address updated !" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.sub;
    const data = {
      userId: userId,
      fullName: req.body.fullName,
      addressLine1: req.body.addressLine1,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      phoneNumber: req.body.phoneNumber,
    };

    const newaddress = await addAddress(data);
    if (newaddress != null) {
      res.status(HttpStatusCodes.CREATED).json({ message: "new address added!" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.sub;
    const editedProfile = await updateProfile(userId, req.body);
    if (editedProfile !== null) {
      res.status(HttpStatusCodes.OK).json({ message: "profile successfully updated" });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const addressId = req.query.addressId;

    const deletedAddress = await deleteAddressById(addressId);

    if (deletedAddress !== null) {
      res.status(HttpStatusCodes.OK).json({ message: "address successfully deleted" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.sub;
    const itemId = req.query.itemId;
    const newItem = await addItemToWishlist(userId, itemId);
    if (newItem !== null) {
      res.status(HttpStatusCodes.OK).json({ add: true, message: "item added to wishlist" });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.sub;
    const itemId = req.query.itemId;

    const removedItem = await removeItemToWishlist(userId, itemId);
    if (removedItem !== null) {
      res
        .status(HttpStatusCodes.OK)
        .json({ remove: true, message: "item removed from wishlist" });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
  } catch (error) {
    console.log(error);
  }
};
//this is for show whishlisted product in home page
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.sub;
    const wishlist = await getWishlistByUserId(userId);
    if (wishlist !== null) {
      res.status(HttpStatusCodes.OK).json({ items: wishlist.items });
    } else {
      res.status(HttpStatusCodes.OK).json({ items: [] });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.renderWishlistPage = async (req, res) => {
  try {
    const userId = req.user.sub;
    const wishlist = await getDetailedWishlist(userId);
    res.status(HttpStatusCodes.OK).json({ wishlist: wishlist });
  } catch (error) {
    console.log(error);
  }
};

//get wallet
exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.sub;
    const wallet = await getWalletByUserId(userId);
    console.log(wallet)
    res.status(HttpStatusCodes.OK).json({ wallet: wallet });
  } catch (error) {
    console.log(error);
  }
};

exports.orderDetails = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await getUserById(userId);
    const orderId = req.query.orderId;
    const order = await getOrderById(orderId);

    if (order !== null && order !== undefined) {
      res.status(HttpStatusCodes.OK).render("orderDetails", { order: order, user: user });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).render("serverError");
    }
  } catch (error) {
    res.render("clientError");
    console.log(error);
  }
};

//cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.body.id;
    const reason = req.body.reason;
    const cancelledOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        is_cancelled: true,
        status: "Cancelled",
        cancelReason: reason,
      },
      { new: true }
    );
    const items = cancelledOrder.products;
    const updatedData = increaseProductQuantities(items);
    if (cancelledOrder !== null) {
      res.status(HttpStatusCodes.OK).json({ message: "oreder is cancelled" });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.returnProduct = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const productId = req.query.productId;
    const reason = req.body.reason;
    const returnedOrder = await orderModel.findOneAndUpdate(
      { _id: orderId, products: { $elemMatch: { _id: productId } } },
      {
        $set: {
          status: "Returns",
          "products.$.is_returned": true,
          "products.$.returnReason": reason,
        },
      },
      { new: true }
    );
    if (returnedOrder !== null) {
      res.status(HttpStatusCodes.OK).json({ message: "oreder is cancelled" });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addFundToWallet = async (req, res) => {
  try {
    const amount = req.query.amount;
    const userId = req.user.sub;
    const user = await getUserById(userId);
    const userName = user.firstName + " " + user.lastName;
    const mobile = user.phoneNumber;
    const email = user.email;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "jeevankumar8943@gmail.com",
    };

    razorpayInstance.orders.create(options, async (err, order) => {
      if (!err) {
        res.status(HttpStatusCodes.OK).json({
          success: true,
          msg: "Money added to wallet",
          order_id: order.id,
          amount: amount,
          key_id: RAZORPAY_CLIENT_ID,
          title: "Pay now",
          description: "Thanks for using our service",
          contact: mobile,
          name: userName,
          email: email,
        });
      } else {
        console.log("error === ", err);
        res.status(HttpStatusCodes.BAD_REQUEST).json({ success: false, msg: "Something went wrong!" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.confirmAddFundToWallet = async (req, res) => {
  try {
    const amount = req.query.amount;
    const userId = req.user.sub;
    await addMoneyToWallet(
      userId,
      "Deposit",
      "You added money to wallet",
      amount
    );
    res.status(HttpStatusCodes.OK).json({ message: "amount successfully added" });
  } catch (error) {
    console.log(error);
  }
};

exports.getAboutusPage = async (req, res) => {
  try {
    const userId = req.user.sub;

    const user = await getUserById(userId);

    return res.render("aboutusPage", { user: user });
  } catch (error) {
    res.render("clientError");
  }
};
