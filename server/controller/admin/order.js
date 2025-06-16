const HttpStatusCodes = require("../../constants/HttpStatusCodes");
const { getAllOrderAdmin } = require("../../helper/dbQueries");
exports.getOrdersPage = async (req, res) => {
  try {
    const orders = await getAllOrderAdmin();
    res.status(HttpStatusCodes.OK).render("orders", { orders: orders });
  } catch (error) {
    console.log(error);
  }
};
