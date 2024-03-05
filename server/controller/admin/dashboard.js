const {
  getAllUsers,
  getAllProducts,
  getAllOrderAdmin,
} = require("../../helper/dbQueries");

exports.getDashboard = async (req, res) => {
  try {
    const users = await getAllUsers();
    const products = await getAllProducts();
    const orders = await getAllOrderAdmin();
    const totalOrders = orders.length;
    res.render("dashboard", {
      users: users,
      products: products,
      totalOrders: totalOrders,
    });
  } catch (error) {
    console.log(error);
  }
};
