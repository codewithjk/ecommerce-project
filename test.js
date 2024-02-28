// // // <%- include("./layouts/header") %>

// // // <%- include("./layouts/footer") %>

// // // const generateOtp = async () => {
// // //   const otp = Math.floor(100000 + Math.random() * 900000);
// // //   return otp;
// // // };

// // // console.log(generateOtp());
// // const body = {
// //   otp1: "1",
// //   otp2: "2",
// //   otp3: "3",
// //   otp4: "4",
// //   otp5: "5",
// //   otp6: "6",
// // };

// // console.log(Number(Object.values(body).join("")));

// // // ===== shop.ejs
// // // <%- include("./layouts/header") %>
// // // <section>
// // //   <h1>Welcome</h1>
// // // </section>

// // // <%- include("./layouts/footer") %>

// // let arr = [1,2,3]
// // arr.foo='neew'
// // console.log();

// // for(let ele of arr){
// //   console.log(ele);
// // }
// // for (let ele in  arr){
// //   console.log(ele);
// // }

// if (window.location.pathname == "/admin/add-products") {
//   const form = document.getElementById("addproduct")
//     let totalimages = 0;

//     function imageupload(event) {

//       const files = event.target.files;
//       const imagecontainer = document.getElementById("imageContainer");
//       const maximum = 5;

//       const totalupload = totalimages + files.length;
//       if (totalupload > maximum) {
//           Swal.fire(Oops! Upload only ${maximum} files., "Sorry");
//           event.target.value = "";
//           return;
//       }

//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const reader = new FileReader();
//         if (!file.type.startsWith("image/")) {
//           console.log("File is not an image.", file.type);
//           continue;
//         }

//         const imgdiv = document.createElement("div");
//         imgdiv.classList.add("image-div");

//         const img = document.createElement("img");
//         img.style.height = "300px";
//         img.style.width = "300px";
//         img.setAttribute("name", 'image');
//         img.classList.add("uploaded-image");

//         const deletebutton = document.createElement("button");
//         deletebutton.textContent = "Delete";
//         deletebutton.classList.add("btn", "btn-danger", "m-2");

//         deletebutton.addEventListener("click", function () {
//           totalimages--;
//           imgdiv.remove();
//         });

//         reader.onload = function (event) {
//           img.src = event.target.result;

//           const cropperdiv = document.createElement("div");
//           cropperdiv.classList.add("cropper-container");
//           cropperdiv.appendChild(img);

//           imgdiv.appendChild(cropperdiv);
//           const cropper = new Cropper(img, {
//             dragMode: "move",
//             aspectRatio: 1,
//             autoCropArea: 0.8,
//             restore: false,
//             guides: false,
//             center: false,
//             responsive:true,
//             highlight: false,
//             cropBoxMovable: false,
//             cropBoxResizable: false,
//             toggleDragModeOnDblclick: false,
//           });

//           const cropbtn = document.createElement("button");
//           cropbtn.classList.add("btn", "btn-primary", "m-2");
//           cropbtn.textContent = "Crop";
//           cropbtn.addEventListener("click", function (event) {
//             event.preventDefault();
//             const croppedCanvas = cropper.getCroppedCanvas();

//             img.src = croppedCanvas.toDataURL()

//             croppedCanvas.toBlob((blob) => {
//               const fileName = Date.now();
//               const file = new File([blob], ${fileName}.jpg, { type: 'image/jpeg' });

//               if (window.FileList && window.DataTransfer) {
//                   const dataTransfer = new DataTransfer();
//                   dataTransfer.items.add(file);
//                   const input = document.createElement('input');
//                   input.type = 'file';
//                   input.name = image${i};
//                   input.files = dataTransfer.files;
//                  form.appendChild(input)
//                  input.style.display = 'none'

//               } else {
//                   console.error('FileList and DataTransfer are not supported in this browser.');
//               }
//           })
//             cropper.destroy();
//             cropbtn.remove();

//           });

//           imgdiv.appendChild(cropbtn);
//           imgdiv.appendChild(deletebutton);
//         };

//         reader.readAsDataURL(file);

//         imagecontainer.appendChild(imgdiv);
//       }
//       totalimages = totalupload;
//     }
//     const imageInput = document.getElementById("imageinput");

//   imageInput.addEventListener("change", imageupload);

//   }

//   onclick="window.location.href='/product-details?id='"

// {
//   "product": {
//     "$oid": "65d9fbb7dcd2c87eac636dde"
//   },
//   "user": {
//     "$oid": "65d897e86dce47682d4813c0"
//   },
//   "message":"this product is good to use ",
//   "rating":4
// }

console.log(__dirname);
