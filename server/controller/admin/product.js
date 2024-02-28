const { categoryModel } = require("../../models/category");
const { productModel } = require("../../models/product");
const { getAllCategories } = require("../../helper/dbQueries");

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
        image: { $arrayElemAt: ["$images", 0] },
        total_stock: 1,
        price: 1,
        created_at: 1,
        description: 1,
        discount: 1,
        category: { $arrayElemAt: ["$categoryInfo.title", 0] },
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
    // const imageData = req.body.image.map((element) => {
    //   return (element = Buffer.from(element, "base64"));
    // });

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
      images: req.body.image,
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
    const id = req.body.id;
    const product = {
      title: req.body.title,
      // image: req.body.image,
      description: req.body.description,
      category: req.body.category,
      pirce: req.body.price,
      discount: req.body.discount,
      color: req.body.color,
      size: req.body.size,
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
