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
const { RAZORPAY_CLIENT_ID, RAZORPAY_CLIENT_SECRET } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_CLIENT_ID,
  key_secret: RAZORPAY_CLIENT_SECRET,
});

exports.getAccountPage = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await getUserById(userId);
    console.log(user);
    const wallet = await walletModel.findOne({ userId: userId });
    res.render("account", { user: user, wallet: wallet });
  } catch (error) {
    console.log(error);
    res.render("clientError");
  }
};

exports.getAddressOfUser = async (req, res) => {
  const userId = req.user.sub;
  console.log(userId);

  const addresses = await getAddressByUid(userId);

  res.json({ addresses: addresses });
};

exports.editAddress = async (req, res) => {
  try {
    const id = req.body.id;
    console.log(req.body);
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
      res.json({ message: "address updated !" });
    }
  } catch (error) {
    console.log();
  }
};

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.sub;
    console.log(req.body);
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
      res.json({ message: "new address added!" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.sub;
    console.log("edited data ===", req.body);
    const editedProfile = await updateProfile(userId, req.body);
    if (editedProfile !== null) {
      res.json({ message: "profile successfully updated" });
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
      res.status(200).json({ message: "address successfully deleted" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.sub;
    const itemId = req.query.itemId;
    console.log("patch wishlist =====", userId, itemId);
    const newItem = await addItemToWishlist(userId, itemId);
    if (newItem !== null) {
      res.status(200).json({ add: true, message: "item added to wishlist" });
    } else {
      res.status(500).json({ message: "something went wrong" });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.sub;
    const itemId = req.query.itemId;
    console.log("delete from wishlist =====", userId, itemId);

    const removedItem = await removeItemToWishlist(userId, itemId);
    if (removedItem !== null) {
      res
        .status(200)
        .json({ remove: true, message: "item removed from wishlist" });
    } else {
      res.status(500).json({ message: "something went wrong" });
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
      res.status(200).json({ items: wishlist.items });
    } else {
      res.status(200).json({ items: [] });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.renderWishlistPage = async (req, res) => {
  try {
    const userId = req.user.sub;
    const wishlist = await getDetailedWishlist(userId);
    console.log(wishlist);
    res.status(200).json({ wishlist: wishlist });
  } catch (error) {
    console.log(error);
  }
};

//get wallet
exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.sub;
    const wallet = await getWalletByUserId(userId);
    console.log(wallet);
    res.status(200).json({ wallet: wallet });
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
      console.log(order);
      res.status(200).render("orderDetails", { order: order, user: user });
    } else {
      res.status(500).render("serverError");
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
    console.log(req.body);
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
      res.status(200).json({ message: "oreder is cancelled" });
    } else {
      res.status(500).json({ message: "something went wrong" });
    }

    console.log("from cancel order ===", cancelledOrder);
  } catch (error) {
    console.log(error);
  }
};

exports.returnProduct = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const productId = req.query.productId;
    const reason = req.body.reason;
    console.log(orderId, productId, reason);
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
      res.status(200).json({ message: "oreder is cancelled" });
    } else {
      res.status(500).json({ message: "something went wrong" });
    }
    console.log("returned order ==", returnedOrder);
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
        console.log("order ==== ", order);

        res.status(200).json({
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
        res.status(400).json({ success: false, msg: "Something went wrong!" });
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
    res.status(200).json({ message: "amount successfully added" });
  } catch (error) {
    console.log(error);
  }
};
