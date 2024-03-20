const { createOffer } = require("../../helper/dbQueries");
const { categoryModel } = require("../../models/category");
const { offerModel } = require("../../models/offer");

exports.getOfferPage = async (req, res) => {
  const categories = await categoryModel.find();
  const offers = await offerModel.find();

  res.render("offer", { categories: categories, offers: offers });
};

exports.addCategoryOffer = async (req, res) => {
  try {
    console.log(req.body);
    const { title, startDate, endDate, discount, category } = req.body;

    const data = { title, startDate, endDate, discount, category };

    const newOffer = await createOffer(data);
    console.log("new offer", newOffer);
    if (newOffer !== null) {
      res.status(200).json({ message: "offer added successfully" });
    } else {
      res.status(200).json({ error: "something is wrong " });
    }
  } catch (error) {
    console.log(error);
  }
};
