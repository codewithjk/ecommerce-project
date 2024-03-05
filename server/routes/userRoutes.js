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
  placeOrder,
  getAllOrders,
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
const { resourceLimits } = require("worker_threads");

//set views directory
router.set("views", path.join(__dirname, "../../views/user"));
router.get("/", checkAuthenticated, (req, res) => {
  res.render("landingPage");
});
router.get("/login", getLogin);
router.get("/register", getRegister);
router.get("/forgot-password", getForgotPassword);
router.get("/otp-verification", getOtpPage);
router.get("/products", verifyToken, getAllProducts); // this is for page
router.get("/verify-confirmation-code", getConfirmationPage);
router.get("/set-new-password", verifyToken, getSetNewPassword);

router.get("/product-details", verifyToken, getProductPage);

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
router.post("/change-password", verifyToken, postSetNewPassword);

//profile
router.get("/account", verifyToken, getAccountPage);
router.patch("/edit-profile", verifyToken, editProfile);
router.get("/address", verifyToken, getAddressOfUser);
router.patch("/edit-address", verifyToken, editAddress);
router.post("/add-address", verifyToken, addAddress);
router.delete("/remove-address", verifyToken, removeAddress);

//product
router.put("/add-to-cart", verifyToken, addToCart);
router.get("/get-cart", verifyToken, getCartItems);
router.delete("/remove-from-cart", verifyToken, removeCartItem);
router.get("/get-cart-page", verifyToken, getCartPage);
router.get("/update-item-count", verifyToken, updateItemCountInCart);
router.get("/products/all-products", verifyToken, listAllProduct); //list all product
router.get("/products/search", verifyToken, searchProduct);

router.get("/orders", verifyToken, getAllOrders);

//checkout
router.get("/checkout", verifyToken, getCheckoutPage);
router.get("/payment", verifyToken, getPaymentPage);
router.get("/place-order", verifyToken, placeOrder);

router.get("/blocked-message", renderBlockedMessage);

router.get("/logout", verifyToken, logout);

module.exports = router;
