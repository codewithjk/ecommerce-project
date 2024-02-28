const { getUserByEmail } = require("../helper/dbQueries");
const { setJwtToCookies } = require("../helper/setJwtToken");
const { userModel } = require("../models/user");
const jwt = require("jsonwebtoken");

const getGoogleURL = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID, // It must correspond to what we declared earlier in the backend
    scope: "email profile ", // This is the user data you have access to, in our case its just the mail.
    redirect_uri: "http://localhost:8080/auth/google/callback", // This is the uri that will be redirected to if the user signs into his google account successfully
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
    console.log(req.query);

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
      console.log(googleUser);
      const email = googleUser.email;
      res.cookie("email", email);
      const existingUser = await getUserByEmail(email);
      if (existingUser != null) {
        await setJwtToCookies(res, existingUser);
        res.redirect("/products");
      } else {
        const user = new userModel({
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
          avatar: googleUser.picture,
          email: email,
          googleId: googleUser.sub,
        });
        await user.save();
        await setJwtToCookies(res, user);
        res.redirect("/products");
      }
    }
  }
};

const getFacebookURL = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_CLIENT_ID,
    redirect_uri: "http://localhost:8080/auth/facebook/callback",
  });
  const url = `https://www.facebook.com/v6.0/dialog/oauth?${params}`;
  res.json({ redirect: url });
};

const getUserFromFacebook = async (req, res) => {
  if (req.query.error == "access_denied") {
    res.json({ redirect: "/" });
  } else {
    const code = req.query.code;
    console.log(req.query);

    const data = await getFacebookToken(code);

    const urlForGettingUserInfo =
      "https://graph.facebook.com/v12.0/me?fields=id,email,first_name,last_name,picture";
    const response = await fetch(urlForGettingUserInfo, {
      method: "GET",
      params: {
        fields: "id,name,email,first_name,last_name,picture",
      },
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    } else {
      const facebookUser = await response.json();
      console.log("Face book user -==== s", facebookUser);
      const email = facebookUser.email;
      res.cookie("email", email);
      const existingUser = await getUserByEmail(email);
      if (existingUser != null) {
        await setJwtToCookies(res, existingUser);
        res.redirect("/products");
      } else {
        // const user = new userModel({
        //   firstName: facebookUser.first_name,
        //   lastName: facebookUser.last_name,
        //   avatar: facebookUser.picture.data.url,
        //   email: email,
        //   googleId: facebookUser.sub,
        // });
        // await user.save();
        // await setJwtToCookies(res, user);
        // res.redirect("/products");
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
    redirect_uri: "http://localhost:8080/auth/google/callback",
    grant_type: "authorization_code",
  });
  const url = `https://oauth2.googleapis.com/token?${query}`;
  console.log(url);
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
    redirect_uri: "http://localhost:8080/auth/facebook/callback",
    grant_type: "authorization_code",
  });
  const url = `https://graph.facebook.com/v12.0/oauth/access_token?${query}`;
  console.log(url);
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
