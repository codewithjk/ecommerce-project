const { getUserByEmail, createNewWallet } = require("../helper/dbQueries");
const { setJwtToCookies } = require("../helper/setJwtToken");
const { userModel } = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const google_redirect_url = process.env.GOOGLE_URL;
const facebook_redirect_url = process.env.FACEBOOK_URL;

const getGoogleURL = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID, // It must correspond to what we declared earlier in the backend
    scope: "email profile ", // This is the user data you have access to, in our case its just the mail.
    redirect_uri: google_redirect_url, // This is the uri that will be redirected to if the user signs into his google account successfully
    auth_type: "rerequest", // This tells the consent screen to reappear if the user initially entered wrong credentials into the google modal
    display: "popup", //It pops up the consent screen when the anchor tag is clicked
    response_type: "code",
    prompt: "consent",
  });
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  res.json({ redirect: url });
};

const getUserFromGoogle = async (req, res) => {
  if (req.query.error == "access_denied") {
    res.json({ redirect: "/" });
  } else {
    const code = req.query.code;

    const data = await getGoogleToken(code);

    const urlForGettingUserInfo =
      "https://www.googleapis.com/oauth2/v3/userinfo";
    const response = await fetch(urlForGettingUserInfo, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    } else {
      const googleUser = await response.json();

      const email = googleUser.email;
      res.cookie("email", email);
      const existingUser = await getUserByEmail(email);
      if (existingUser != null) {
        await setJwtToCookies(res, existingUser);
        res.redirect("/products");
      } else {
        const refferalCode = await generateRandomCode();
        const user = new userModel({
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          avatar: googleUser.picture,
          email: email,
          googleId: googleUser.sub,
          refferalCode: refferalCode,
        });
        const newUser = await user.save();
        const userId = newUser._id;

        //create wallet
        const wallet = await createNewWallet(userId);

        await setJwtToCookies(res, user);
        res.redirect("/products");
      }
    }
  }
};

const getFacebookURL = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_CLIENT_ID,
    redirect_uri: facebook_redirect_url,
    scope: "email",
  });
  const url = `https://www.facebook.com/v6.0/dialog/oauth?${params}`;
  res.json({ redirect: url });
};

const getUserFromFacebook = async (req, res) => {
  if (req.query.error == "access_denied") {
    res.json({ redirect: "/" });
  } else {
    const code = req.query.code;
    const data = await getFacebookToken(code);

    const urlForGettingUserInfo =
      "https://graph.facebook.com/v12.0/me?fields=id,email,first_name,last_name,picture";
    const response = await fetch(urlForGettingUserInfo, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    } else {
      const facebookUser = await response.json();

      const email = facebookUser.email;
      res.cookie("email", email);
      const existingUser = await getUserByEmail(email);
      if (existingUser != null) {
        await setJwtToCookies(res, existingUser);
        res.redirect("/products");
      } else {
        const user = new userModel({
          firstName: facebookUser.first_name,
          lastName: facebookUser.last_name,
          avatar: facebookUser.picture.data.url,
          email: email,
          googleId: facebookUser.sub,
        });
        const newUser = await user.save();
        const userId = newUser._id;
        //create wallet
        const wallet = await createNewWallet(userId);
        await setJwtToCookies(res, user);
        await setJwtToCookies(res, user);
        res.redirect("/products");
      }
    }
  }
};

module.exports = {
  getGoogleURL,
  getUserFromGoogle,
  getFacebookURL,
  getUserFromFacebook,
};

//google
function getGoogleToken(code) {
  const query = new URLSearchParams({
    code: code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: google_redirect_url,
    grant_type: "authorization_code",
  });
  const url = `https://oauth2.googleapis.com/token?${query}`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // contentType: "application/x-www-form-urlencoded",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
}

//facebook
function getFacebookToken(code) {
  const query = new URLSearchParams({
    code: code,
    client_id: process.env.FACEBOOK_CLIENT_ID,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
    redirect_uri: facebook_redirect_url,
    grant_type: "authorization_code",
  });
  const url = `https://graph.facebook.com/v12.0/oauth/access_token?${query}`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // contentType: "application/x-www-form-urlencoded",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
}

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
