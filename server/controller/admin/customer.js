const HttpStatusCodes = require("../../constants/HttpStatusCodes");
const { userModel } = require("../../models/user");

exports.getCustomerPage = async (req, res) => {
  try {
    const users = await userModel.find();
    const totalUsers = users.length;
    const blockedUsers = users.filter(
      (user) => user.status == "Blocked"
    ).length;
    const activeUsers = users.filter((user) => user.status == "Active").length;
    res.render("customers", {
      users: users,
      totalUsers: totalUsers,
      blockedUsers: blockedUsers,
      activeUsers: activeUsers,
    });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "server is not responding" });
  }
};

exports.blockUser = async (req, res) => {
  const userId = req.body.id;
  try {
    const result = await userModel.findByIdAndUpdate(userId, {
      status: "Blocked",
    });
    if (result == null) {
      res.json({ error: "unable to block user" });
    } else {
      res.json({ redirect: "/admin/customers" });
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "server is not responding" });
  }
};
exports.unblockUser = async (req, res) => {
  const userId = req.body.id;

  try {
    const result = await userModel.findByIdAndUpdate(userId, {
      status: "Active",
    });
    if (result == null) {
      res.json({ error: "unable to unblock user" });
    } else {
      res.json({ redirect: "/admin/customers" });
    }
  } catch (error) {
    res.status(500).json({ error: "server is not responding" });
  }
};
