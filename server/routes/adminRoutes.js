const express = require("express");
const router = express();
const {isAdmin} = require("../middleware/authentication")
const { getLogin, postLogin } = require("../controller/admin/auth");
const { getDashboard } = require("../controller/admin/dashboard");
const { getProductsPage,getAddProduct } = require("../controller/admin/product");
const {getCategoryPage} = require("../controller/admin/category");
const {getCustomerPage ,blockUser,unblockUser} = require("../controller/admin/customer");
const {getOrdersPage} = require("../controller/admin/order");
const {getFeedbackPage} = require("../controller/admin/feedback");
const {getCouponPage} = require("../controller/admin/coupon");
const {getBannerPage} = require("../controller/admin/banner");


const path = require("path");

//set admin views
router.set("views", path.join(__dirname, "../../views/admin"));

router.get("/login", getLogin);
router.get("/dashboard",isAdmin, getDashboard);
router.get("/products",isAdmin, getProductsPage);
router.get("/categories",isAdmin, getCategoryPage);
router.get("/orders",isAdmin, getOrdersPage);
router.get("/customers",isAdmin, getCustomerPage);
router.get("/feedback",isAdmin, getFeedbackPage);
router.get("/coupons",isAdmin, getCouponPage);
router.get("/banners",isAdmin, getBannerPage);
router.get("/add-product",isAdmin,getAddProduct);

router.patch("/block-user",blockUser)
router.patch("/unblock-user",unblockUser)


router.post("/login", postLogin);

module.exports = router;
