const express = require("express");
const router = express();
const { isAdmin } = require("../middleware/authentication");
const { getLogin, postLogin, logout } = require("../controller/admin/auth");
const { getDashboard } = require("../controller/admin/dashboard");
const {
  getProductsPage,
  getAddProduct,
  postAddProduct,
  removeProduct,
  editProduct,
  removeImage,
  orderDetails,
  refundOrder,
  getEditPage,
  getProductById,
  updateOrderStatus,
  getWeeklyOrders,
  getMonthlyOrders,
  getYearlyOrders,
  checkProductExists,
} = require("../controller/admin/product");
const {
  getCategoryPage,
  addCategory,
  removeCategory,
  editCategory,
} = require("../controller/admin/category");
const {
  getCustomerPage,
  blockUser,
  unblockUser,
} = require("../controller/admin/customer");
const { getOrdersPage } = require("../controller/admin/order");
const { getFeedbackPage } = require("../controller/admin/feedback");
const {
  getCouponPage,
  addCoupon,
  removeCoupon,
} = require("../controller/admin/coupon");
const {
  getOfferPage,
  addCategoryOffer,
  removeOffer,
} = require("../controller/admin/offer");

const path = require("path");

//set admin views
router.set("views", path.join(__dirname, "../../views/admin"));

router.get("/login", getLogin);
router.get("/dashboard", isAdmin, getDashboard);
router.get("/products", isAdmin, getProductsPage);
router.get("/categories", isAdmin, getCategoryPage);
router.get("/orders", isAdmin, getOrdersPage);
router.get("/customers", isAdmin, getCustomerPage);
router.get("/feedback", isAdmin, getFeedbackPage);
router.get("/coupons", isAdmin, getCouponPage);
router.get("/offers", isAdmin, getOfferPage);
router.get("/add-product", isAdmin, getAddProduct);
router.get("/edit-product", isAdmin, getEditPage);
router.get("/get-product", isAdmin, getProductById);

router.get("/check-product-exists", isAdmin, checkProductExists);

router.patch("/block-user", blockUser);
router.patch("/unblock-user", unblockUser);

router.post("/login", postLogin);
router.post("/add-category", addCategory);
router.post("/add-product", postAddProduct);
router.patch("/remove-image", removeImage);
router.delete("/remove-product", removeProduct);
router.delete("/remove-category", removeCategory);
router.patch("/edit-category", editCategory);
router.patch("/edit-product", editProduct);
router.get("/order-details", orderDetails);
router.patch("/order/update-status", updateOrderStatus);
router.patch("/refund-order", refundOrder);

//for chart
router.get("/get-weekly-orders", getWeeklyOrders);
router.get("/get-monthly-orders", getMonthlyOrders);
router.get("/get-yearly-orders", getYearlyOrders);

//coupon
router.post("/add-coupon", addCoupon);
router.delete("/delete-coupon", removeCoupon);

//offer
router.post("/add-category-offer", addCategoryOffer);
router.delete("/remove-offer", removeOffer);

router.get("/logout", logout);

module.exports = router;
