const jwt = require("jsonwebtoken");

// ---USER
const setJwtToCookies = async (res, data) => {
  // Create JWT token
  const token = jwt.sign(
    { sub: data._id, role: "user" },
    process.env.JWT_SECRET,
    {
      expiresIn: "1y",
    }
  );
  // Set token to cookies
  res.cookie("userToken", token, {
    httpOnly: true,
    maxAge: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Expires in 1 year
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
};

//  ---ADMIN
const setJwtToCookiesAdmin = async (res, data) => {
  console.log(data);
  const token = jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "1y" });
  res.cookie("adminToken", token, {
    httpOnly: true,
    maxAge: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Expires in 1 year
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

module.exports = { setJwtToCookies, setJwtToCookiesAdmin };
