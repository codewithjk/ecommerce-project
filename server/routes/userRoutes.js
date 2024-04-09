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
  getLandingPage,

  renderBlockedMessage,
  logout,
  updatePassword,
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
  addReview,
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
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  renderWishlistPage,
  orderDetails,
  cancelOrder,
  getWallet,
  returnProduct,
  addFundToWallet,
  confirmAddFundToWallet,
  getAboutusPage,
} = require("../controller/user/account");
const {
  getAllOrders,
  placeOrderCOD,
  placeOrderRazorpay,
  renderSuccess,
  renderFailure,
  continuePayment,
  continuePaymentHandler,
  applyCoupon,
} = require("../controller/user/order");

//set views directory
router.set("views", path.join(__dirname, "../../views/user"));
router.get("/", checkAuthenticated, getLandingPage);
router.get("/login", checkAuthenticated, getLogin);
router.get("/register", checkAuthenticated, getRegister);
router.get("/forgot-password", getForgotPassword);
router.get("/otp-verification", getOtpPage);
router.get("/products", verifyToken, isBlocked, getAllProducts);
router.get("/verify-confirmation-code", getConfirmationPage);
router.get("/set-new-password", verifyToken, isBlocked, getSetNewPassword);
router.get("/about-us", verifyToken, isBlocked, getAboutusPage);

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
router.post("/update-password", verifyToken, isBlocked, updatePassword);

//profile
router.get("/account", verifyToken, isBlocked, getAccountPage);
router.patch("/edit-profile", verifyToken, isBlocked, editProfile);
router.get("/address", verifyToken, isBlocked, getAddressOfUser);
router.patch("/edit-address", verifyToken, isBlocked, editAddress);
router.post("/add-address", verifyToken, isBlocked, addAddress);
router.delete("/remove-address", verifyToken, isBlocked, removeAddress);
router.patch("/edit-wishlist", verifyToken, isBlocked, addToWishlist);
router.delete("/edit-wishlist", verifyToken, isBlocked, removeFromWishlist);
router.get("/wishlist", verifyToken, isBlocked, getWishlist);
router.get("/wishlist-page", verifyToken, isBlocked, renderWishlistPage);
router.get("/get-wallet", verifyToken, isBlocked, getWallet);
router.get("/order-details", verifyToken, isBlocked, orderDetails);

router.patch("/cancel-order", verifyToken, isBlocked, cancelOrder);

//product
router.put("/add-to-cart", verifyToken, isBlocked, addToCart);
router.get("/get-cart", verifyToken, isBlocked, getCartItems);
router.delete("/remove-from-cart", verifyToken, isBlocked, removeCartItem);
router.get("/get-cart-page", verifyToken, isBlocked, getCartPage);
router.get("/update-item-count", verifyToken, isBlocked, updateItemCountInCart);
router.get("/products/all-products", verifyToken, isBlocked, listAllProduct); //list all product
router.get("/products/search", verifyToken, isBlocked, searchProduct);
router.post("/add-review", verifyToken, isBlocked, addReview);

router.get("/orders", verifyToken, isBlocked, getAllOrders);

//checkout
router.get("/checkout", verifyToken, isBlocked, getCheckoutPage);
router.get("/payment", verifyToken, isBlocked, getPaymentPage);
router.get("/place-order-cod", verifyToken, isBlocked, placeOrderCOD);
router.get("/place-order-razorpay", verifyToken, isBlocked, placeOrderRazorpay);
router.get(
  "/payment/continue-payment",
  verifyToken,
  isBlocked,
  continuePayment
);
router.get(
  "/payment/continue-payment-handler",
  verifyToken,
  isBlocked,
  continuePaymentHandler
);

//coupon
router.get("/apply-coupon", verifyToken, isBlocked, applyCoupon);

//return product
router.patch("/return-product", verifyToken, isBlocked, returnProduct);

//wallet
router.get("/add-fund", verifyToken, isBlocked, addFundToWallet);
router.get("/confirm-add-fund", verifyToken, isBlocked, confirmAddFundToWallet);

router.get("/payment/success", verifyToken, isBlocked, renderSuccess);
router.get("/payment/failed", verifyToken, isBlocked, renderFailure);
router.get("/blocked-message", renderBlockedMessage);

router.get("/logout", verifyToken, logout);

router.use((req, res, next) => {
  res.status(404).render("clientError", { error: "Page not found" });
  return;
});

module.exports = router;
