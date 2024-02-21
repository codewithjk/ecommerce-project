const jwt = require("jsonwebtoken");

// ---USER
const setJwtToCookies = async (res, data) => {
  // Create JWT token
  const token = jwt.sign({ userId: data.user_id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour, adjust as needed
  });
  // Set token to cookies
  res.cookie("token", token, {
    httpOnly: true, // Cookie is only accessible through HTTP(S) protocol
    maxAge: 3600000, // Expiry time in milliseconds (1 hour in this case)
    secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS only
    sameSite: "strict", // Set to 'strict' to prevent CSRF attacks
  });
};

//  ---ADMIN
const setJwtToCookiesAdmin = async(res,data)=>{
  const token = jwt.sign({adminId: data._id , email:data.email},process.env.JWT_SECRET,{expiresIn:"1h"});
  
  // Set token to cookies
  res.cookie("token", token, {
    httpOnly: true, // Cookie is only accessible through HTTP(S) protocol
    maxAge: 3600000, // Expiry time in milliseconds (1 hour in this case)
    secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS only
    sameSite: "strict", // Set to 'strict' to prevent CSRF attacks
  });
}

module.exports = {setJwtToCookies,setJwtToCookiesAdmin};
