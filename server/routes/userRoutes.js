const express = require("express");
const router = express();
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
} = require("../controller/user/auth");
const { getAllProducts } = require("../controller/user/product");
const path = require("path");
const {
  verifyToken,
  checkAuthenticated,
} = require("../middleware/authentication");

//set views directory
router.set("views", path.join(__dirname, "../../views/user"));
router.get("/", checkAuthenticated, (req, res) => {
  res.render("landingPage");
});
router.get("/login", getLogin);
router.get("/register", getRegister);
router.get("/forgot-password", getForgotPassword);
router.get("/otp-verification", getOtpPage);
router.get("/products", verifyToken, getAllProducts);
router.get("/verify-confirmation-code", getConfirmationPage);
router.get("/set-new-password", verifyToken, getSetNewPassword);

router.post("/login", postLogin);
router.post("/register", postRegister);
router.post("/otp-verification", postOtp);
router.post("/resend-otp", resendOtp);
router.post("/verify-email", verifyEmail);
router.post("/change-password", verifyToken, postSetNewPassword);

// router.post("/verify-email", emailVerification);

module.exports = router;
