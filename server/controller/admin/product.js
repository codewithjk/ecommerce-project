const { categoryModel } = require("../../models/category");
const { productModel } = require("../../models/product");
const {
  getAllCategories,
  deleteImage,
  getOrderById,
  refundOrderById,
  changeOrderStatus,
  getDailyDataOfWeek,
  getWeeklyDataOfMonth,
  getMonthlyDataOfYear,
} = require("../../helper/dbQueries");
///////

const fs = require("fs");
const path = require("path");

const imgur = require("imgur");
const { log } = require("console");
const { logout } = require("./auth");

/////

exports.getProductsPage = async (req, res) => {
  const data = await productModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $project: {
        title: 1,
        images: 1,
        total_stock: 1,
        price: 1,
        created_at: 1,
        description: 1,
        discount: 1,
        category: { $arrayElemAt: ["$categoryInfo.title", 0] },
        sizes: 1,
      },
    },
  ]);

  const categories = await getAllCategories();
  console.log(data);

  res.render("products", { products: data, categories: categories });
};

exports.getAddProduct = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.render("addProduct", { categories: categories });
  } catch (error) {
    console.error(error);
  }
};

exports.postAddProduct = async (req, res) => {
  try {
    const urls = [];

    for (const image of req.body.image) {
      const url = await saveBase64ImageToFile(image, "image.jpg");
      urls.push(url);
    }

    console.log(urls);

    //////////////////////////////

    let totalStock = 0;
    const allvarients =
      req.body.color.length == 0 ? req.body.size : req.body.color;
    allvarients.forEach((obj) => {
      totalStock += Object.values(obj)[0];
    });

    const product = new productModel({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      images: urls,
      price: req.body.price,
      discount: req.body.discount,
      colors: req.body.color,
      sizes: req.body.size,
      total_stock: totalStock,
    });

    await product.save();
    res.json({ message: "Product is successfully added" });
  } catch (error) {
    console.error(error);
  }
};

// remove product

exports.removeProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const deletedProduct = await productModel.findByIdAndDelete(id);

    res.json({
      message: "Category is successfully deleted",
      redirect: "/admin/products",
    });
  } catch (error) {
    console.error(error);
  }
};

exports.editProduct = async (req, res) => {
  try {
    const urls = [];

    for (const image of req.body.image) {
      const url = await saveBase64ImageToFile(image, "image.jpg");
      urls.push(url);
    }

    console.log(urls);
    const id = req.body.id;
    console.log("id === ", id);

    let totalStock = 0;
    const allvarients = req.body.size;
    allvarients.forEach((obj) => {
      totalStock += Object.values(obj)[0];
    });

    const product = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      $push: { images: { $each: urls } },
      price: req.body.price,
      discount: req.body.discount,
      sizes: req.body.size,
      total_stock: totalStock,
    };

    const updatedData = await productModel.findByIdAndUpdate(id, product);
    console.log(updatedData);
    res.json({
      message: "Product is successfully edited",
      redirect: "/admin/products",
    });
  } catch (error) {
    console.error(error);
  }
};

exports.removeImage = async (req, res) => {
  const url = req.query.url;
  const pid = req.query.pid;
  console.log(url, pid);
  try {
    const result = await deleteImage(url, pid);
    if (result) {
      res.status(200).json({ message: "success fully removed" });
    } else {
      res.status(500).json({ message: "failed to remove" });
    }
  } catch (error) {
    res.status(500).render("error");
  }
};

exports.getEditPage = async (req, res) => {
  try {
    const productId = req.query.productId;
    const categories = await categoryModel.find();
    const product = await productModel.findById(productId);
    res.render("editProduct", { product: product, categories: categories });
  } catch (error) {
    console.log(error);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.query.productId;
    const product = await productModel.findById(productId);
    console.log(product);
    res.status(200).json({ product: product });
  } catch (error) {
    console.log(error);
  }
};

//get order details by id
exports.orderDetails = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const order = await getOrderById(orderId);
    if (order !== null) {
      console.log(order);
      res.status(200).render("orderDetails", { order: order });
    } else {
      res.status(500).render("serverError");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.refundOrder = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    console.log(orderId);
    const order = await refundOrderById(orderId);
    if (order) {
      console.log(order);
      res.status(200).json({ message: "sucessfully refunded" });
    } else {
      res.status(500).render("serverError");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    console.log(req.body);
    const status = req.body.status;
    const orderId = req.body.orderId;
    const updated = await changeOrderStatus(orderId, status);
    if (updated !== null) {
      res.status(200).json({ message: `Order is ${status}` });
    } else {
      res.status(401).json({ message: "something went wrong!" });
    }
  } catch (error) {
    console.log(error);
  }
};

//for chart data
exports.getWeeklyOrders = async (req, res) => {
  try {
    const data = await getDailyDataOfWeek();
    console.log("get weekly data");
    console.log(data);
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
};
exports.getMonthlyOrders = async (req, res) => {
  try {
    const data = await getWeeklyDataOfMonth();
    console.log("get Monthly data");
    console.log(data);
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
};

exports.getYearlyOrders = async (req, res) => {
  try {
    const data = await getMonthlyDataOfYear();
    console.log("get Yearly data");
    console.log(data);
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////////////

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
