const { userModel } = require("../../models/user");
const { walletModel } = require("../../models/wallet");
const otpModel = require("../../models/otp");
const { setJwtToCookies } = require("../../helper/setJwtToken");
const { generateOtp } = require("../../helper/generateOtp");
const { getLogger } = require("nodemailer/lib/shared");
const {
  createNewWallet,
  getTopTenProducts,
} = require("../../helper/dbQueries");
const crypto = require("crypto");
const { log } = require("console");
const { default: mongoose } = require("mongoose");

// const GoogleStrategy = require("passport-google-oidc");

exports.getLandingPage = async (req, res) => {
  try {
    const topProducts = await getTopTenProducts();
    topProducts.pop();
    res.render("landingPage", { products: topProducts });
  } catch (error) {
    console.log(error);
  }
};

// ====Register controllers
exports.getRegister = (req, res) => {
  const referralId = req.query.referralId;
  const referredByLink = referralId ? true : false;

  res.render("register", { referredByLink: referredByLink });
};
exports.postRegister = async (req, res) => {
  const email = req.body.email;
  const referredUserId = req.query.referralId;

  try {
    const userExist = await userModel.findOne({ email: email });
    if (userExist) {
      res.json({ error: "email is already used" });
    } else {
      const code = req.body.code;

      await sendMoneyToReferredUser(code, req.body.firstName);
      if (referredUserId !== undefined || referredUserId !== null) {
        // referredUserId = new mongoose.Types.ObjectId(referredUserId);
        await sendMoneyToReferredUserByLink(referredUserId, req.body.firstName);
      }
      const refferalCode = await generateRandomCode();

      const user = new userModel({
        email: req.body.email,
        phoneNumber: "1234567890",
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        phoneNumber: req.body.phone,
        refferalCode: refferalCode,
      });
      const newUser = await user.save();
      const userId = newUser._id;
      //for create the wallet
      const wallet = await createNewWallet(userId);

      res.cookie("email", email);
      generateOtp(email).then((data) => {
        if (data.success) {
          res.json({
            success: "successfully registered",
            redirect: `/otp-verification?id=${data.id}`,
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
  const email = req.body.email;
  const password = req.body.password;

  const user = await userModel.findOne({ email: email });
  if (user == null) {
    res.json({ emailError: "invalid email" });
    // res.render("login", { invalidEmail: "invalid email" });
  } else if (password !== user.password) {
    res.json({ passwordError: "incorrect password" });
    // res.render("login", { invalidPassword: "incorrect password" });
  } else if (user.status === "Blocked") {
    res.json({ blocked: true });
  } else {
    generateOtp(email).then((data) => {
      if (data.success) {
        res.cookie("email", email);
        res.json({
          success: "successfully registered",
          redirect: `/otp-verification?id=${data.id}`,
        });
      }
    });
  }
};

// =====Otp controllers
exports.getOtpPage = async (req, res) => {
  const userID = req.query.id;
  try {
    res.render("verifyOtp");
  } catch (error) {
    console.log(error);
  }
};

exports.postOtp = async (req, res) => {
  const user_otp = Number(Object.values(req.body).join(""));
  try {
    const otpData = await otpModel.findOne({ otp: user_otp });
    if (otpData === null) {
      res.json({ error: "invalid otp" });
    } else if (otpData.is_verified === true) {
      res.json({ error: "Otp is already used" });
    } else {
      await otpModel.findOneAndUpdate(
        { _id: otpData._id },
        { is_verified: true }
      );
      const userData = await userModel.findOne({ _id: otpData.user_id });
      await setJwtToCookies(res, userData);
      res.status(200).json({
        success: "otp successfully verified",
        // redirect: "/products",
      });
    }
  } catch (error) {
    console.log(error);
  }
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
  const userId = req.user.sub;
  if (req.body.password[0] !== req.body.password[1]) {
    res.json({ error: "password not matching" });
  } else {
    userModel
      .findOneAndUpdate({ _id: userId }, { password: req.body.password[0] })
      .then((user) => {
        res.json({
          success: "password change successfull",
          redirect: "/products",
        });
      });
  }
};

exports.updatePassword = async (req, res) => {
  const userId = req.user.sub;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const user = await userModel.findById(userId);
  if (oldPassword !== user.password) {
    res.json({ error: "old password not matching" });
  } else {
    userModel
      .findOneAndUpdate({ _id: userId }, { password: newPassword })
      .then((user) => {
        res.json({
          success: "password change successfull",
        });
      });
  }
};

exports.renderBlockedMessage = (req, res) => {
  res.render("BlockedPage");
};

//timer
exports.getOTPTime = async (req, res) => {
  try {
    const id = req.query.id;
    const data = await otpModel.findOne(
      { user_id: id },
      { created_at: 1, _id: 0 }
    );
    res.json({ data: data.created_at });
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("userToken");
  res.clearCookie("email");
  res.redirect("/");
};

// Function to generate a refferal code
function generateRandomCode() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(8, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const code = buffer.toString("hex").toUpperCase().slice(0, 8);
        resolve(code);
      }
    });
  });
}

//funtion to send money by referral code
async function sendMoneyToReferredUser(code, newUser) {
  try {
    const user = await userModel.findOne({ refferalCode: code });
    if (user !== null) {
      const wallet = await walletModel.findOneAndUpdate(
        { userId: user._id },
        {
          $push: {
            history: {
              name: "Referral Bonus",
              description: `${newUser} joined using your code`,
              amount: 500,
            },
          },
          $inc: { balance: 500 },
        },
        { new: true }
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function sendMoneyToReferredUserByLink(id, name) {
  try {
    const user = await userModel.findById(id);
    if (user !== null) {
      const wallet = await walletModel.findOneAndUpdate(
        { userId: user._id },
        {
          $push: {
            history: {
              name: "Referral Bonus",
              description: `${name} joined using your code`,
              amount: 500,
            },
          },
          $inc: { balance: 500 },
        },
        { new: true }
      );
    }
  } catch (error) {
    console.log(error);
  }
}
