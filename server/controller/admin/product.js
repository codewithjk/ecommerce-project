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
  getProductByName,
  getUserById,
} = require("../../helper/dbQueries");
const HttpStatusCodes = require("../../constants/HttpStatusCodes");
const { uploadBase64ImageToCloudinary } = require("../../helper/cloudinary.config");
///////


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
      const url = await uploadBase64ImageToCloudinary(image);
      urls.push(url);
    }

    //////////////////////////////

    let totalStock = 0;
    const allvarients = req.body.size;
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
      const url = await uploadBase64ImageToCloudinary(image);
      urls.push(url);
    }

    const id = req.body.id;

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

  try {
    const result = await deleteImage(url, pid);
    if (result) {
      res.status(HttpStatusCodes.OK).json({ message: "success fully removed" });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "failed to remove" });
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).render("error");
  }
};

exports.getEditPage = async (req, res) => {
  try {
    const productId = req.query.productId;
    const categories = await categoryModel.find();
    const product = await productModel.findById(productId);
    console.log(product)
    res.render("editProduct", { product: product, categories: categories });
  } catch (error) {
    console.log(error);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.query.productId;
    const product = await productModel.findById(productId);
    res.status(HttpStatusCodes.OK).json({ product: product });
  } catch (error) {
    console.log(error);
  }
};

//get order details by id
exports.orderDetails = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const order = await getOrderById(orderId);
    const userId = order.userId;
    const user = await getUserById(userId);
    if (order !== null) {
      res.status(HttpStatusCodes.OK).render("orderDetails", { order: order, user: user });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).render("serverError");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.refundOrder = async (req, res) => {
  try {
    const orderId = req.query.orderId;

    const order = await refundOrderById(orderId);
    if (order) {
      res.status(HttpStatusCodes.OK).json({ message: "sucessfully refunded" });
    } else {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).render("serverError");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const status = req.body.status;
    const orderId = req.body.orderId;
    const updated = await changeOrderStatus(orderId, status);
    if (updated !== null) {
      res.status(HttpStatusCodes.OK).json({ message: `Order is ${status}` });
    } else {
      res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "something went wrong!" });
    }
  } catch (error) {
    console.log(error);
  }
};

//for chart data
exports.getWeeklyOrders = async (req, res) => {
  try {
    const data = await getDailyDataOfWeek();
    res.status(HttpStatusCodes.OK).json({ data });
  } catch (error) {
    console.log(error);
  }
};
exports.getMonthlyOrders = async (req, res) => {
  try {
    const data = await getWeeklyDataOfMonth();

    res.status(HttpStatusCodes.OK).json({ data });
  } catch (error) {
    console.log(error);
  }
};

exports.getYearlyOrders = async (req, res) => {
  try {
    const data = await getMonthlyDataOfYear();
    res.status(HttpStatusCodes.OK).json({ data });
  } catch (error) {
    console.log(error);
  }
};

exports.checkProductExists = async (req, res) => {
  try {
    const name = req.query.title;
    const data = await getProductByName(name);
   
    res.status(HttpStatusCodes.OK).json({ product: data });
  } catch (error) {
    console.log(error);
  }
};
