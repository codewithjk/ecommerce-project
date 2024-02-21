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

// ===== shop.ejs
// <%- include("./layouts/header") %>
// <section>
//   <h1>Welcome</h1>
// </section>

// <%- include("./layouts/footer") %>


let arr = [1,2,3]
arr.foo='neew'
console.log();

for(let ele of arr){
  console.log(ele);
}
for (let ele in  arr){
  console.log(ele);
}