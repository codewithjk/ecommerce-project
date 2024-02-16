// <%- include("./layouts/header") %>

// <%- include("./layouts/footer") %>

// const generateOtp = async () => {
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   return otp;
// };

// console.log(generateOtp());
const body = {
  otp1: "1",
  otp2: "2",
  otp3: "3",
  otp4: "4",
  otp5: "5",
  otp6: "6",
};

console.log(Number(Object.values(body).join("")));
