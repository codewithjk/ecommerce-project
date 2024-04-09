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

    const earnings = orders
      .filter((order) => {
        if (order.is_refunded === false && order.status === "Delivered") {
          return order;
        }
      })
      .reduce(
        (a, b) => {
          return a.totalAmount + b.totalAmount;
        },
        { totalAmount: 0 }
      );

    res.render("dashboard", {
      users: users,
      products: products,
      totalOrders: totalOrders,
      totalEarnings: earnings,
      topProducts: topProducts,
      topCategories: topCategories,
    });
  } catch (error) {
    // console.log(error);
  }
};
