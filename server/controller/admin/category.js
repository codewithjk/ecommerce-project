const { categoryModel } = require("../../models/category");
const { deleteCategory } = require("../../helper/dbQueries");

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
    const category = new categoryModel({
      title: req.body.title,
      image: req.body.image,
      description: req.body.description,
    });
    await category.save();
    res.json({
      message: "Category is successfully added",
      redirect: "/admin/categories",
    });
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
    // const deletedCategory = await deleteCategory(id);
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    // console.log(deletedCategory);
    // if (deletedCategory == null) {
    //   console.log("deleterde is null");
    //   res.json({
    //     message: "Something went wrong ",
    //   });
    // } else {
    //   console.log("deleterde is not null====456789");
    //   res.json({
    //     message: "Category is successfully deleted",
    //     redirect: "/admin/categories",
    //   });
    // }

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
    const category = {
      title: req.body.title,
      image: req.body.image,
      description: req.body.description,
    };

    await categoryModel.findByIdAndUpdate(id, category);
    res.json({
      message: "Category is successfully edited",
      redirect: "/admin/categories",
    });
  } catch (error) {
    if (error.code === 11000) {
      res.json({ error: "This category already exists" });
    }
    console.error(error);
  }
};
