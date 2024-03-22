const {
  getAllUsers,
  getAllProducts,
  getAllOrderAdmin,
  getTopTenProducts,
  getTopCategories,
} = require("../../helper/dbQueries");

exports.getDashboard = async (req, res) => {
  try {
    const users = await getAllUsers();
    const products = await getAllProducts();
    const orders = await getAllOrderAdmin();
    const totalOrders = orders.length;
    const topProducts = await getTopTenProducts();
    const topCategories = await getTopCategories();
    console.log("top pro ==== ", topCategories);
    res.render("dashboard", {
      users: users,
      products: products,
      totalOrders: totalOrders,
      topProducts: topProducts,
      topCategories: topCategories,
    });
  } catch (error) {
    console.log(error);
  }
};
