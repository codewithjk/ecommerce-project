const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

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
  const token = req.cookies.token;
  if (token) {
    return res.redirect("/products");
  }
  next();
};
module.exports = { verifyToken, checkAuthenticated };
