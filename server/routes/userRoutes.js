const express = require("express");
const router = express();
const {
  getLogin,
  postLogin,
  getOtpPage,
  postOtp,
} = require("../controller/user/auth");
const { getAllProducts } = require("../controller/user/product");
const path = require("path");

//set views directory
router.set("views", path.join(__dirname, "../../views/user"));

router.get("/login", getLogin);
router.get("/otp-verification", getOtpPage);
router.get("/products", getAllProducts);

router.post("/login", postLogin);
router.post("/otp-verification", postOtp);

module.exports = router;
