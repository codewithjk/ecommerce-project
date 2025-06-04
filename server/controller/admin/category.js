const { categoryModel } = require("../../models/category");
const {
  deleteCategory,
  findCategoryByName,
} = require("../../helper/dbQueries");


exports.getCategoryPage = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.render("categories", { categories: categories });
  } catch (error) {
    console.error(error.message);
  }
};

exports.addCategory = async (req, res) => {
  try {
    // const encodedData = Buffer.from(req.body.image[1], "base64");
    // const imageData = [req.body.image[0], encodedData];
    const url = await uploadBase64ImageToCloudinary(req.body.image);
    const category = new categoryModel({
      title: req.body.title,
      image: url,
      description: req.body.description,
    });
    const ifExist = await findCategoryByName(req.body.title.trim());
    if (ifExist === null) {
      await category.save();
      res.json({
        message: "Category is successfully added",
        redirect: "/admin/categories",
      });
    } else {
      res.json({ error: "This category already exists" });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.json({ error: "This category already exists" });
    }
    console.error(error.code);
  }
};

exports.removeCategory = async (req, res) => {
  const id = req.query.id;
  try {
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    res.json({
      message: "Category is successfully deleted",
      redirect: "/admin/categories",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editCategory = async (req, res) => {
  try {
    const id = req.body.id;
    const url = await uploadBase64ImageToCloudinary(req.body.image);

    const category = {
      title: req.body.title,
      image: url,
      description: req.body.description,
    };
    const ifExist = await findCategoryByName(req.body.title.trim());

    if (ifExist === null) {
      await categoryModel.findByIdAndUpdate(id, category);
      res.json({
        message: "Category is successfully edited",
        redirect: "/admin/categories",
      });
    } else {
      res.json({ error: "This category is already exists" });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.json({ error: "This category already exists" });
    }
    console.error(error);
  }
};
