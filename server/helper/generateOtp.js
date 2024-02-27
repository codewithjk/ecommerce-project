const { sendMail } = require("./mailer");
const { userModel } = require("../models/user");
const otpModel = require("../models/otp");

async function generateOtp(email) {
  const cDate = new Date();

  console.log(email);
  const otp = Math.floor(100000 + Math.random() * 900000);
  const user = await userModel.findOne({ email: email });

  return otpModel
    .findOneAndUpdate(
      { user_id: user._id },
      { otp: otp, is_verified: false, created_at: new Date(cDate.getTime()) },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    .then(() => {
      // send mail.
      const html = `<p>` + otp + `</p>`;
      return sendMail(email, "send otp", html)
        .then(() => {
          return { success: "email is valid.", id: user._id };
        })
        .catch((error) => {
          console.log("send mail error ==== ", error);
        });
    })
    .catch((error) => {
      console.log("otp database error ==== ", error);
    });
}

module.exports = { generateOtp };
