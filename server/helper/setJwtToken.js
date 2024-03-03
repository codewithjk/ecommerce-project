const jwt = require("jsonwebtoken");

// ---USER
const setJwtToCookies = async (res, data) => {
  // Create JWT token
  const token = jwt.sign(
    { sub: data._id, role: "user" },
    process.env.JWT_SECRET,
    {
      expiresIn: "3h",
    }
  );
  // Set token to cookies
  res.cookie("userToken", token, {
    httpOnly: true,
    maxAge: 10800000, //3h
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
};

//  ---ADMIN
const setJwtToCookiesAdmin = async (res, data) => {
  console.log(data);
  const token = jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "3h" });
  res.cookie("adminToken", token, {
    httpOnly: true,
    maxAge: 3600000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

module.exports = { setJwtToCookies, setJwtToCookiesAdmin };
