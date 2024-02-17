const express = require("express");
const router = express();
const {
  getLogin,
  postLogin,
  getOtpPage,
  postOtp,
  getRegister,
  postRegister,
} = require("../controller/user/auth");
const { getAllProducts } = require("../controller/user/product");
const path = require("path");
const authentication = require("../middleware/authentication");

//set views directory
router.set("views", path.join(__dirname, "../../views/user"));
router.get("/", (req, res) => {
  res.render("landingPage");
});
router.get("/login", getLogin);
router.get("/register", getRegister);
router.get("/otp-verification", getOtpPage);
router.get("/products", authentication, getAllProducts);

router.post("/login", postLogin);
router.post("/register", postRegister);
router.post("/otp-verification", postOtp);

module.exports = router;
