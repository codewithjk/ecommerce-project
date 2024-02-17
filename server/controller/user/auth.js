const userModel = require("../../models/user");
const otpModel = require("../../models/otp");
const { sendMail } = require("../../helper/mailer");
const setJwtToCookies = require("../../helper/setJwtToken");
// ====Register controllers
exports.getRegister = (req, res) => {
  res.render("register");
};
exports.postRegister = async (req, res) => {
  console.log(req.body);
  try {
    const userExist = await userModel.findOne({ email: req.body.email });
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
      // save otp in database.
      const otp = await generateOtp();
      const cDate = new Date();
      otpModel
        .findOneAndUpdate(
          { user_id: user._id },
          {
            otp: otp,
            is_verified: false,
            created_at: new Date(cDate.getTime()),
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        )
        .then(() => {
          // send mail.
          const html = `<p>` + otp + `</p>`;
          sendMail(user.email, "send otp", html)
            .then(() => {
              res.json({
                success: "successfully registered",
                redirect: "/otp-verification",
              });
            })
            .catch((error) => {
              console.log("send mail error ==== ", error);
            });
        })
        .catch((error) => {
          console.log("otp database error ========", error);
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
  const otp = await generateOtp();
  const cDate = new Date();
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
    // save otp in database.
    otpModel
      .findOneAndUpdate(
        { user_id: user._id },
        { otp: otp, is_verified: false, created_at: new Date(cDate.getTime()) },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      .then(() => {
        // send mail.
        const html = `<p>` + otp + `</p>`;
        sendMail(email, "send otp", html)
          .then(() => {
            // return res.redirect("/otp-verification");
            res.json({
              success: "email and password are valid.",
              redirect: "/otp-verification",
            });
          })
          .catch((error) => {
            console.log("send mail error ==== ", error);
          });
      })
      .catch((error) => {
        console.log("otp database error ==== ", error);
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
          // ==== set jwt token to cookies
          setJwtToCookies(res, data).then(() => {
            res.status(200).json({
              success: "otp successfully verified",
              redirect: "/products",
            });
          });

          // res.json({
          //   success: "otp successfully verified",
          //   redirect: "/products",
          // });

          console.log("is verified is now true");
        });
    }
  });
};

const generateOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};
