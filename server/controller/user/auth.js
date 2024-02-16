const userModel = require("../../models/user");
const otpModel = require("../../models/otp");
const { sendMail } = require("../../helper/mailer");

exports.getRegister = (req, res) => {
  res.render("register");
};

// ====Login controllers
exports.getLogin = (req, res) => {
  res.render("login");
};
exports.postLogin = async (req, res) => {
  console.log(req.body);
  const otp = await generateOtp();
  const cDate = new Date();
  const email = req.body.email;
  const password = req.body.password;

  const user = await userModel.findOne({ email: email });
  if (user == null) {
    res.render("login", { invalidEmail: "invalid email" });
  } else if (password !== user.password) {
    res.render("login", { invalidPassword: "incorrect password" });
  } else {
    // save otp in database.
    otpModel
      .findOneAndUpdate(
        { user_id: "65cef75f372170aa9d591970" },
        { otp: otp, is_verified: false, created_at: new Date(cDate.getTime()) },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      .then(() => {
        // send mail.
        const html = `<p>` + otp + `</p>`;
        sendMail("jeevankumar8943@gmail.com", "send otp", html)
          .then(() => {
            return res.redirect("/user/otp-verification");
          })
          .catch((error) => {
            console.log("send mail error ==== ", error);
          });
      })
      .catch((error) => {
        console.log("otp database error ========", error);
      });
  }
};

// =====Otp controllers
exports.getOtpPage = (req, res) => {
  res.render("verifyOtp");
};

exports.postOtp = async (req, res) => {
  console.log("otp body ==", req.body);
  const user_otp = Number(Object.values(req.body).join(""));

  otpModel.findOne({ otp: user_otp }).then((data) => {
    if (data === null) {
      res.json({ error: "invalid otp" });
    } else if (data.is_verified === true) {
      res.json({ error: "Otp is already used" });
    } else {
      otpModel
        .findOneAndUpdate({ _id: data._id }, { is_verified: true })
        .then(() => {
          res.json({
            success: "otp successfully verified",
            redirect: "/user/products",
          });

          console.log("is verified is now true");
        });
    }
  });
};

const generateOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};
