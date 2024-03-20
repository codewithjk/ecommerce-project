const { log } = require("console");
const fs = require("fs");
const imgur = require("imgur");
const {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
} = require("../../helper/dbQueries");
const exp = require("constants");

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
    log(req.body);
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
    const url = await saveBase64ImageToFile(image, "image.jpg");
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
      res.status(200).json({ message: "coupon added successfully" });
    } else {
      res.status(200).json({ error: "something is wrong" });
    }
  } catch (error) {
    res.status(200).json({ error: "something is wrong" });
  }
};

exports.removeCoupon = async (req, res) => {
  try {
    const couponId = req.query.couponId;
    const deletedCoupon = await deleteCoupon(couponId);
    console.log(couponId);
    console.log(deletedCoupon);
    if (deletedCoupon) {
      res.status(200).json({ message: "coupon deleted" });
    } else {
      res.status(200).json({ error: "coupon not deleted" });
    }
  } catch (error) {
    console.log();
  }
};
//////////////////////////////////////////////////////////////////////////

async function saveBase64ImageToFile(base64Data, filePath) {
  return new Promise((resolve, reject) => {
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, "base64");
    fs.writeFile(filePath, buffer, async (err) => {
      if (err) {
        console.error("Error saving image:", err);
        reject(err);
      } else {
        try {
          const obj = await imgur.uploadFile(filePath);
          resolve(obj.data.link);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      }
    });
  });
}
