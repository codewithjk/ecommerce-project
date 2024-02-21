const {userModel} = require("../../models/user");
const otpModel = require("../../models/otp");

const {setJwtToCookies} = require("../../helper/setJwtToken");
const { generateOtp } = require("../../helper/generateOtp");
// ====Register controllers
exports.getRegister = (req, res) => {
  res.render("register");
};
exports.postRegister = async (req, res) => {
  const email = req.body.email;
  console.log(req.body);
  try {
    const userExist = await userModel.findOne({ email: email });
    if (userExist) {
      res.json({ error: "email is already used" });
    } else {
      const user = new userModel({
        email: req.body.email,
        phoneNumber: "1234567890",
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password[0],
      });
      await user.save();
      console.log("user saved", user);
      generateOtp(email).then((data) => {
        if (data.success) {
          res.json({
            success: "successfully registered",
            redirect: "/otp-verification",
          });
        }
      });
    }
  } catch (error) {
    throw error;
  }
};

// ====Login controllers
exports.getLogin = (req, res) => {
  res.render("login");
};
exports.postLogin = async (req, res) => {
  console.log(req.body);

  const email = req.body.email;
  const password = req.body.password;

  const user = await userModel.findOne({ email: email });
  if (user == null) {
    res.json({ emailError: "invalid email" });
    // res.render("login", { invalidEmail: "invalid email" });
  } else if (password !== user.password) {
    res.json({ passwordError: "incorrect password" });
    // res.render("login", { invalidPassword: "incorrect password" });
  } else {
    generateOtp(email).then((data) => {
      if (data.success) {
        res.cookie("email", email);
        res.json({
          success: "successfully registered",
          redirect: "/otp-verification",
        });
      }
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

  otpModel.findOne({ otp: user_otp }).then((otpData) => {
    if (otpData === null) {
      res.json({ error: "invalid otp" });
    } else if (otpData.is_verified === true) {
      res.json({ error: "Otp is already used" });
    } else {
      otpModel
        .findOneAndUpdate({ _id: otpData._id }, { is_verified: true })
        .then(() => {
          // ==== set jwt token to cookies
          setJwtToCookies(res, otpData).then(() => {
            res.status(200).json({
              success: "otp successfully verified",
              // redirect: "/products",
            });
          });
          console.log("is verified is now true");
        });
    }
  });
};

// verify email for reset password
exports.verifyEmail = (req, res) => {
  const email = req.body.email;
  userModel
    .findOne({ email: email })
    .then((user) => {
      if (user == null) {
        res.json({ error: "invalid email" });
      } else {
        generateOtp(email).then((data) => {
          if (data.success) {
            res.json({
              success: "successfull",
              redirect: "/verify-confirmation-code",
            });
          }
        });
      }
    })
    .catch((error) => {
      throw error;
    });
};

exports.resendOtp = (req, res) => {
  const email = req.cookies.email;
  generateOtp(email).then((data) => {
    if (data.success) {
      res.json({
        success: `otp is sent to ${email}`,
        timer: 120,
      });
    }
  });
};

//  ====Forgot password
exports.getForgotPassword = (req, res) => {
  res.render("forgotPassword");
};

exports.getConfirmationPage = (req, res) => {
  res.render("confirmationPage");
};

exports.getSetNewPassword = (req, res) => {
  res.render("SetNewPassword");
};

exports.postSetNewPassword = (req, res) => {
  console.log(req.body);
  console.log(req.user);
  const userId = req.user.userId;
  if (req.body.password[0] !== req.body.password[1]) {
    res.json({ error: "password not matching" });
  } else {
    userModel
      .findOneAndUpdate({ _id: userId }, { password: req.body.password[0] })
      .then((user) => {
        res.json({
          success: "password change successfull",
          redirect: "/product",
        });
      });
  }
};
