const { getAllOrderAdmin } = require("../../helper/dbQueries");
exports.getOrdersPage = async (req, res) => {
  try {
    const orders = await getAllOrderAdmin();
    res.status(200).render("orders", { orders: orders });
  } catch (error) {
    console.log(error);
  }
};
