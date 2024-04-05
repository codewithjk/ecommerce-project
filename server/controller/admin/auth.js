const { generateOtp } = require("../../helper/generateOtp");
const { setJwtToCookiesAdmin } = require("../../helper/setJwtToken");
const adminModel = require("../../models/admin");
exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const admin = await adminModel.findOne({ email: email });

    if (admin == null) {
      res.json({ emailError: "invalid email" });
    } else if (password !== admin.password) {
      res.json({ passwordError: "incorrect password" });
    } else {
      // const data = await generateOtp(email);
      // if (data.success) {
      setJwtToCookiesAdmin(res, admin).then(() => {
        res.json({
          success: "login success",
          // redirect: "/otp-verification",
          redirect: "/admin/dashboard",
        });
      });

      // }
    }
  } catch (error) {
    throw error;
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("adminToken");
  res.redirect("/admin/login");
};
