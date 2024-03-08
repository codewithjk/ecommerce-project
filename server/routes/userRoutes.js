const express = require("express");
const router = express();

const {
  getGoogleURL,
  getUserFromGoogle,
  getFacebookURL,
  getUserFromFacebook,
} = require("../helper/OAuth");
const {
  getLogin,
  postLogin,
  getOtpPage,
  postOtp,
  getRegister,
  postRegister,
  getForgotPassword,
  generateOtp,
  emailVerification,
  getConfirmationPage,
  getSetNewPassword,
  postSetNewPassword,
  verifyEmail,
  resendOtp,
  redirectToGoogleAuth,
  googleAuthResult,
  facebookAuthResult,
  getOTPTime,
  setUser,
  renderBlockedMessage,
  logout,
} = require("../controller/user/auth");
const {
  getAllProducts,
  getProductPage,
  getCartItems,
  removeCartItem,
  addToCart,
  getCartPage,
  updateItemCountInCart,
  listAllProduct,
  searchProduct,
  getCheckoutPage,
  getPaymentPage,
} = require("../controller/user/product");
const path = require("path");
const {
  verifyToken,
  checkAuthenticated,
  isBlocked,
} = require("../middleware/authentication");

//profile
const {
  getAccountPage,
  getAddressOfUser,
  editAddress,
  addAddress,
  editProfile,
  removeAddress,
} = require("../controller/user/account");
const {
  getAllOrders,
  placeOrderCOD,
  placeOrderRazorpay,
  renderSuccess,
} = require("../controller/user/order");

//set views directory
router.set("views", path.join(__dirname, "../../views/user"));
router.get("/", checkAuthenticated, (req, res) => {
  res.render("landingPage");
});
router.get("/login", getLogin);
router.get("/register", getRegister);
router.get("/forgot-password", getForgotPassword);
router.get("/otp-verification", getOtpPage);
router.get("/products", verifyToken, isBlocked, getAllProducts); // this is for page
router.get("/verify-confirmation-code", getConfirmationPage);
router.get("/set-new-password", verifyToken, isBlocked, getSetNewPassword);

router.get("/product-details", verifyToken, isBlocked, getProductPage);

router.get("/auth/google", getGoogleURL);
router.get("/auth/google/callback", getUserFromGoogle);

router.get("/auth/facebook", getFacebookURL);
router.get("/auth/facebook/callback", getUserFromFacebook);

router.get("/get-remaining-time", getOTPTime);

router.post("/login", postLogin);
router.post("/register", postRegister);
router.post("/otp-verification", postOtp);
router.post("/resend-otp", resendOtp);
router.post("/verify-email", verifyEmail);
router.post("/change-password", verifyToken, isBlocked, postSetNewPassword);

//profile
router.get("/account", verifyToken, isBlocked, getAccountPage);
router.patch("/edit-profile", verifyToken, isBlocked, editProfile);
router.get("/address", verifyToken, isBlocked, getAddressOfUser);
router.patch("/edit-address", verifyToken, isBlocked, editAddress);
router.post("/add-address", verifyToken, isBlocked, addAddress);
router.delete("/remove-address", verifyToken, isBlocked, removeAddress);

//product
router.put("/add-to-cart", verifyToken, isBlocked, addToCart);
router.get("/get-cart", verifyToken, isBlocked, getCartItems);
router.delete("/remove-from-cart", verifyToken, isBlocked, removeCartItem);
router.get("/get-cart-page", verifyToken, isBlocked, getCartPage);
router.get("/update-item-count", verifyToken, isBlocked, updateItemCountInCart);
router.get("/products/all-products", verifyToken, isBlocked, listAllProduct); //list all product
router.get("/products/search", verifyToken, isBlocked, searchProduct);

router.get("/orders", verifyToken, isBlocked, getAllOrders);

//checkout
router.get("/checkout", verifyToken, isBlocked, getCheckoutPage);
router.get("/payment", verifyToken, isBlocked, getPaymentPage);
router.get("/place-order-cod", verifyToken, isBlocked, placeOrderCOD);
router.get("/place-order-razorpay", verifyToken, isBlocked, placeOrderRazorpay);

router.get("/payment/success", verifyToken, isBlocked, renderSuccess);
router.get("/blocked-message", renderBlockedMessage);

router.get("/logout", verifyToken, logout);

module.exports = router;
