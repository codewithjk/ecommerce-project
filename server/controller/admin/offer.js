const { createOffer, deleteOffer } = require("../../helper/dbQueries");
const { categoryModel } = require("../../models/category");
const { offerModel } = require("../../models/offer");

exports.getOfferPage = async (req, res) => {
  const categories = await categoryModel.find();
  const offers = await offerModel.find();

  res.render("offer", { categories: categories, offers: offers });
};

exports.addCategoryOffer = async (req, res) => {
  try {
    const { title, startDate, endDate, discount, category } = req.body;

    const data = { title, startDate, endDate, discount, category };

    const newOffer = await createOffer(data);
    if (newOffer !== null) {
      res.status(200).json({ message: "offer added successfully" });
    } else {
      res.status(200).json({ error: "something is wrong " });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.removeOffer = async (req, res) => {
  try {
    const offerId = req.query.offerId;
    const deletedOffer = await deleteOffer(offerId);
    if (deletedOffer !== null) {
      res
        .status(200)
        .json({ message: "offer removed !", redirect: "/admin/offers" });
    } else {
      res
        .status(200)
        .json({ error: "something went wrong.", redirect: "/admin/offers" });
    }
  } catch (error) {
    console.log(error);
  }
};
