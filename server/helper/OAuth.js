// const passport = require("passport");
// const { userModel } = require("../models/user");

// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;

// const googleAuth = async () => {
//   try {
//     passport.use(
//       new GoogleStrategy(
//         {
//           clientID: process.env.GOOGLE_CLIENT_ID,
//           clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//           callbackURL: "http://localhost:8080/auth/google/callback",
//           scope: [
//             "email",
//             "profile",
//             // "https://www.googleapis.com/auth/user.phonenumbers.read", //for get mobile number
//           ],
//           // passReqToCallback: true,
//         },
//         async function verify(
//           request,
//           accessToken,
//           refreshToken,
//           profile,
//           done
//         ) {
//           //

//           try {
//             const email = profile._json.email;
//             const userExist = await userModel.findOne({ email: email });
//             if (userExist) {
//               return done(null, userExist);
//             } else {
//               const user = new userModel({
//                 email: email,
//                 firstName: profile._json.given_name,
//                 lastName: profile._json.family_name,
//                 googleId: profile._json.sub,
//                 // password: profile._json.sub,
//                 password: null,
//               });

//               const savedUser = user.save(user);
//               if (savedUser) {
//                 console.log("user saved", user);
//                 return done(null, user);
//               } else {
//                 return done(null, false);
//               }
//             }
//           } catch (error) {
//             return done(err, false);
//           }
//           //
//         }
//       )
//     );
//   } catch (error) {
//     console.log("google key missing");
//   }
// };
// const facebookAuth = async () => {
//   try {
//     passport.use(
//       new FacebookStrategy(
//         {
//           clientID: process.env.FACEBOOK_CLIENT_ID,
//           clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//           callbackURL: "http://localhost:8080/auth/facebook/callback",
//           scope: ["email", "profile"],
//           // passReqToCallback: true,
//         },
//         async function verify(
//           request,
//           accessToken,
//           refreshToken,
//           profile,
//           done
//         ) {
//           //

//           try {
//             const email = profile._json.email;
//             const userExist = await userModel.findOne({ email: email });
//             if (userExist) {
//               return done(null, userExist);
//             } else {
//               const user = new userModel({
//                 email: email,
//                 firstName: profile._json.given_name,
//                 lastName: profile._json.family_name,
//                 googleId: profile._json.sub,
//                 // password: profile._json.sub,
//                 password: null,
//               });

//               const savedUser = user.save(user);
//               if (savedUser) {
//                 console.log("user saved", user);
//                 return done(null, user);
//               } else {
//                 return done(null, false);
//               }
//             }
//           } catch (error) {
//             return done(err, false);
//           }
//           //
//         }
//       )
//     );
//   } catch (error) {
//     console.log("facebook key missing");
//   }
// };
// module.exports = async (app) => {
//   app.use(passport.initialize());

//   await googleAuth();
//   await facebookAuth();
// };

const params = new URLSearchParams({
  client_id: process.env.GOOGLE_CLIENT_ID, // It must correspond to what we declared earlier in the backend
  scope: "email", // This is the user data you have access to, in our case its just the mail.
  redirect_uri: "http://localhost:8080/auth/google/callback", // This is the uri that will be redirected to if the user signs into his google account successfully
  auth_type: "rerequest", // This tells the consent screen to reappear if the user initially entered wrong credentials into the google modal
  display: "popup", //It pops up the consent screen when the anchor tag is clicked
  response_type: "code",
});
const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

// exports.
console.log(url);
