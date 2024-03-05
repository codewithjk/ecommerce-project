const { getAllOrderAdmin } = require("../../helper/dbQueries");
exports.getOrdersPage = async (req, res) => {
  try {
    const orders = await getAllOrderAdmin();
    console.log("orders ====", orders);
    res.status(200).render("orders", { orders: orders });
  } catch (error) {
    console.log(error);
  }
  // res.render("orders");
};
