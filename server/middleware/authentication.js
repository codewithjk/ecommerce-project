const jwt = require("jsonwebtoken");
//  USER
const verifyToken = (req, res, next) => {
  const token = req.cookies.userToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
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
  }
  next();
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
    return res.status(401).json({ error: "Unauthorized access" });
  }
};

module.exports = { verifyToken, checkAuthenticated, isAdmin };
