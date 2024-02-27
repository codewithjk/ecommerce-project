const { getAllUsers, getAllProducts } = require("../../helper/dbQueries");

exports.getDashboard = async (req, res) => {
  const users = await getAllUsers();
  const products = await getAllProducts();
  res.render("dashboard", { users: users, products: products });
};
