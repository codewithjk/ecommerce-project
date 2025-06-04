const Razorpay = require("razorpay");
const crypto = require("crypto");
const { RAZORPAY_CLIENT_ID, RAZORPAY_CLIENT_SECRET } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_CLIENT_ID,
  key_secret: RAZORPAY_CLIENT_SECRET,
});

const {
  getUserById,
  getAddressById,
  getCartByUserId,
  createOrder,
  removeAllItemFromCart,
  getOrdersByUserId,
  createNewWallet,
  decreaseProductQuantities,
  findCoupon,
  giveCouponToUser,
  applyCouponToCart,
  getOrderById,
  updatePaymentOfOrder,
} = require("../../helper/dbQueries");
const { log } = require("console");
const {
  calculateDistanceBetweenPINs,
} = require("../../helper/calculateDistance");

exports.placeOrderCOD = async (req, res) => {
  try {
    const addressId = req.query.addressId;
    const userId = req.user.sub;
    const cart = await getCartByUserId(userId);
    const items = cart.cartItems;
    let total_amount = 0;
    items.forEach((item) => {
      total_amount +=
        Math.round(item.price - (item.price * item.discount) / 100) *
        item.quantity;
    });
    total_amount = Math.round(
      total_amount - (total_amount * cart.couponDiscount.couponDiscount) / 100
    );
    if (total_amount > 1000) {
      res.status(200).json({
        message:
          "Unable to proceed with COD. minimum amount for COD is 1000 .Try other method.",
      });
    } else {
      res.status(200).json({
        redirectURL: `/payment/success?method="COD"&addressId=${addressId}`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.user.sub;
    const orders = await getOrdersByUserId(userId);

    if (orders !== null) {
      res.status(200).json({ orders: orders });
    } else {
      res.status(200).json({ message: "no orders found" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await getUserById(userId);
    const userName = user.firstName + " " + user.lastName;
    const mobile = user.phoneNumber;
    const email = user.email;

    const addressId = req.query.addressId;

    const address = await getAddressById(addressId);
    const pincode = address.postalCode;

    const distance = await calculateDistanceBetweenPINs(pincode, "683572");

    const shipping = distance * 10;

    const cart = await getCartByUserId(userId);
    const items = cart.cartItems;
    const method = "Razorpay";
    let total_amount = 0;
    items.forEach((item) => {
      total_amount += item.PriceAfterCategoryDiscount * item.quantity;
      console.log(item.PriceAfterCategoryDiscount * item.quantity)
      // Math.round(item.price - (item.price * item.discount) / 100) *
      // item.quantity;
    });

    console.log("shipping: ",shipping)

    total_amount = Math.round(
      total_amount -
      ((total_amount * cart.couponDiscount.couponDiscount) / 100)
      // +shipping
    );
    console.log(total_amount)

    const options = {
      amount: total_amount * 100,
      currency: "INR",
      receipt: "jeevankumar8943@gmail.com",
    };

    razorpayInstance.orders.create(options, async (err, order) => {
      if (!err) {
        res.status(200).json({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: total_amount * 100,
          key_id: RAZORPAY_CLIENT_ID,
          title: "Pay now",
          description: "Thanks for purchase",
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

exports.continuePayment = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await getUserById(userId);
    const userName = user.firstName + " " + user.lastName;
    const mobile = user.phoneNumber;
    const email = user.email;

    const orderId = req.query.orderId;
    const order = await getOrderById(orderId);
    const total_amount = order.totalAmount;

    const options = {
      amount: total_amount * 100,
      currency: "INR",
      receipt: email,
    };

    razorpayInstance.orders.create(options, async (err, order) => {
      if (!err) {
        res.status(200).json({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: total_amount * 100,
          key_id: RAZORPAY_CLIENT_ID,
          title: "Pay now",
          description: "Thanks for purchase",
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

exports.continuePaymentHandler = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const updatedOrder = await updatePaymentOfOrder(orderId);
    if (updatedOrder !== null) {
      res.status(200).json({ message: "Payment Successful" });
    } else {
      res.status(200).json({ message: "Payment Failed. Try again!" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.renderSuccess = async (req, res) => {
  try {
    const userId = req.user.sub;

    const user = await getUserById(userId);
    const userName = user.firstName + " " + user.lastName;
    const mobile = user.phoneNumber;
    const email = user.email;

    const addressId = req.query.addressId;
    const address = await getAddressById(addressId);
    const cart = await getCartByUserId(userId);
    const items = cart.cartItems;
    const discount = cart.couponDiscount.couponDiscount;
    const updateStock = await decreaseProductQuantities(items);
    const method = req.query.method;
    const paymentStatus = true;
    let subTotal = 0;

    const pincode = address.postalCode;

    const distance = await calculateDistanceBetweenPINs(pincode, "683572");

    const shipping = distance * 10;

    if (items.length === 0) {
      res.status(400).render("clientError");
    } else {
      let total_amount = 0;
      items.forEach((item) => {
        total_amount += item.PriceAfterCategoryDiscount * item.quantity;
        // Math.round(item.price - (item.price * item.discount) / 100) *
        // item.quantity;
      });

      subTotal = total_amount;
      total_amount = Math.round(total_amount - (total_amount * discount) / 100);
      total_amount = total_amount + shipping;
      // const orderId = req.query.orderId;
      const couponData = await findCoupon(total_amount);
      //generate coupon if there is a coupon is available
      if (couponData !== null) {
        const couponCode = await generateRandomCode();
        const newCoupon = await giveCouponToUser(
          userId,
          couponData,
          couponCode
        );
      }
      const newOrder = await createOrder(
        userId,
        userName,

        address,
        items,
        total_amount,
        method,
        discount,
        paymentStatus,
        shipping,
        subTotal
      );

      if (newOrder !== null) {
        //remove all items from cart
        const remove = await removeAllItemFromCart(userId);
        res
          .status(200)
          .render("confirmation", { user: user, orderId: newOrder._id });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.renderFailure = async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = await getUserById(userId);
    const userName = user.firstName + " " + user.lastName;
    const mobile = user.phoneNumber;
    const email = user.email;
    const addressId = req.query.addressId;
    const address = await getAddressById(addressId);
    const cart = await getCartByUserId(userId);
    const items = cart.cartItems;
    const discount = cart.couponDiscount.couponDiscount;
    const updateStock = await decreaseProductQuantities(items);
    const paymentStatus = false;
    const method = req.query.method;
    let subTotal = 0;

    const pincode = address.postalCode;

    const distance = await calculateDistanceBetweenPINs(pincode, "683572");

    const shipping = distance * 10;

    if (items.length === 0) {
      res.status(400).render("clientError");
    } else {
      let total_amount = 0;
      items.forEach((item) => {
        total_amount += item.PriceAfterCategoryDiscount * item.quantity;
        // Math.round(item.price - (item.price * item.discount) / 100) *
        // item.quantity;
      });
      subTotal = total_amount;
      total_amount = Math.round(total_amount - (total_amount * discount) / 100);
      total_amount = total_amount + shipping;
      // const orderId = req.query.orderId;
      const couponData = await findCoupon(total_amount);
      //generate coupon if there is a coupon is available
      if (couponData !== null) {
        const couponCode = await generateRandomCode();
        const newCoupon = await giveCouponToUser(
          userId,
          couponData,
          couponCode
        );
      }
      const newOrder = await createOrder(
        userId,
        userName,

        address,
        items,
        total_amount,
        method,
        discount,
        paymentStatus,
        shipping,
        subTotal
      );

      if (newOrder !== null) {
        //remove all items from cart
        const remove = await removeAllItemFromCart(userId);
        res
          .status(200)
          .render("paymentFailed", { user: user, orderId: newOrder._id });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const userId = req.user.sub;
    const code = req.query.code;
    const amount = req.query.amount;

    const couponApplied = await applyCouponToCart(userId, code, amount);
    if (couponApplied) {
      res.status(200).json({
        message: couponApplied.message,
        discount: couponApplied.discount || 0,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////
// Function to generate a refferal code
function generateRandomCode() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(8, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const code = buffer.toString("hex").toUpperCase().slice(0, 8);
        resolve(code);
      }
    });
  });
}
