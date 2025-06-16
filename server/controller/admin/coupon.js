const { log } = require("console");

const {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
} = require("../../helper/dbQueries");
const exp = require("constants");
const { uploadBase64ImageToCloudinary } = require("../../helper/cloudinary.config");
const HttpStatusCodes = require("../../constants/HttpStatusCodes");

exports.getCouponPage = async (req, res) => {
  const coupons = await getAllCoupons();

  if (coupons !== null) {
    res.render("coupons", { coupons: coupons });
  } else {
    res.render("coupons");
  }
};

exports.addCoupon = async (req, res) => {
  try {

    const {
      title,
      image,
      condition,
      limit,
      startDate,
      endDate,
      discount,
      count,
    } = req.body;
    console.log(image)
    const url = await uploadBase64ImageToCloudinary(image);
    const data = {
      title,
      image: url,
      condition,
      limit,
      startDate,
      endDate,
      discount,
      count,
    };

    const newCoupon = await createCoupon(data);
    log("new coupon", newCoupon);
    if (newCoupon !== null) {
      res.status(HttpStatusCodes.OK).json({ message: "coupon added successfully" });
    } else {
      res.status(HttpStatusCodes.OK).json({ error: "something is wrong" });
    }
  } catch (error) {
    res.status(HttpStatusCodes.OK).json({ error: "something is wrong" });
  }
};

exports.removeCoupon = async (req, res) => {
  try {
    const couponId = req.query.couponId;
    const deletedCoupon = await deleteCoupon(couponId);

    if (deletedCoupon) {
      res.status(HttpStatusCodes.OK).json({ message: "coupon deleted" });
    } else {
      res.status(HttpStatusCodes.OK).json({ error: "coupon not deleted" });
    }
  } catch (error) {
    console.log();
  }
};

