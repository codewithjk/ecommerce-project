const jwt = require("jsonwebtoken");
const { getUserById } = require("../helper/dbQueries");
//  USER
const verifyToken = (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.redirect("/");
    // return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.user = user;
    next();
  });
};

const checkAuthenticated = (req, res, next) => {
  const token = req.cookies.userToken;

  if (token) {
    return res.redirect("/products");
  } else {
    next();
  }
};

//  ADMIN
const isAdmin = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden: Invalid token" });
      } else if (admin.data.hasOwnProperty("is_Admin")) {
        req.admin = admin.data;
        next();
      } else {
        return res.status(401).json({ error: "Unauthorized access" });
      }
    });
  } else {
    return res.redirect("/admin/login");
  }
};

// Not comleted
const isBlocked = async (req, res, next) => {
  // const email = req.cookies.email;
  const userId = req.user.sub;

  const user = await getUserById(userId);

  if (user.status === "Active") {
    next();
  } else {
    res.clearCookie("userToken");
    res.redirect("/blocked-message");
  }
};
module.exports = { verifyToken, checkAuthenticated, isAdmin, isBlocked };
