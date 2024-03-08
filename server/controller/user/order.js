const Razorpay = require("razorpay");
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
} = require("../../helper/dbQueries");

exports.placeOrderCOD = async (req, res) => {
  try {
    // const userId = req.user.sub;
    // const user = await getUserById(userId);
    // const userName = user.firstName + " " + user.lastName;
    const addressId = req.query.addressId;
    // const address = await getAddressById(addressId);
    // const items = await getCartByUserId(userId);
    // const method = "COD";

    // let total_amount = 0;
    // items.forEach((item) => {
    //   total_amount += item.price * item.quantity;
    // });

    // const newOrder = await createOrder(
    //   userId,
    //   userName,
    //   user,
    //   address,
    //   items,
    //   total_amount,
    //   method
    // );
    // console.log(newOrder);
    // if (newOrder !== null) {
    //remove all items from cart
    //   const remove = await removeAllItemFromCart(userId);
    //   console.log("cart is now empty ====", remove);
    //   res
    //     .status(200)
    //     .render("confirmation", { user: user, orderId: newOrder._id });
    res.redirect(`/payment/success?method="COD"&addressId=${addressId}`);
    // }
  } catch (error) {
    console.log(error);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.user.sub;
    const orders = await getOrdersByUserId(userId);
    console.log("order === ", orders);
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
    const items = await getCartByUserId(userId);
    const method = "Razorpay";
    let total_amount = 0;
    items.forEach((item) => {
      total_amount += item.price * item.quantity;
    });

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
        res.status(400).json({ success: false, msg: "Something went wrong!" });
      }
    });
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
    const items = await getCartByUserId(userId);
    const method = req.query.method;
    let total_amount = 0;
    items.forEach((item) => {
      total_amount += item.price * item.quantity;
    });
    // const orderId = req.query.orderId;

    const newOrder = await createOrder(
      userId,
      userName,
      user,
      address,
      items,
      total_amount,
      method
    );
    if (newOrder !== null) {
      //remove all items from cart
      const remove = await removeAllItemFromCart(userId);
      res
        .status(200)
        .render("confirmation", { user: user, orderId: newOrder._id });
    }
  } catch (error) {
    console.log(error);
  }
};
