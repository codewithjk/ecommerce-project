const { categoryModel } = require("../../models/category");
const { deleteCategory } = require("../../helper/dbQueries");
const fs = require("fs");
const path = require("path");

const imgur = require("imgur");

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
    const url = await saveBase64ImageToFile(req.body.image, "image.jpg");
    const category = new categoryModel({
      title: req.body.title,
      image: url,
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
    const url = await saveBase64ImageToFile(req.body.image, "image.jpg");
    const category = {
      title: req.body.title,
      image: url,
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
