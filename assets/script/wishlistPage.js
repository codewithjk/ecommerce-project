console.log("wishlist page");

// const wishlistContent = document.getElementById("wishlistContent");
// wishlistContent.innerHTML = "";
// const wishlist_tab = document.getElementById("wishlist"); //here id of triggering element (a tag)
// wishlist_tab.addEventListener("shown.bs.tab", async function (event) {
//   try {
//     // event.preventDefault();
//     console.log("whishlsir clicked");

//     const wishlistContent = document.getElementById("wishlistContent");
//     wishlistContent.innerHTML = "";

//     const response = await fetch(`/wishlist-page`);
//     const data = await response.json();
//     console.log(data.wishlist);
//     data.wishlist.forEach((product) => {
//       let productNamesHTML = "";
//       // order.productNames.forEach((product) => {
//       //   productNamesHTML += `<h6 class="fs-15 mb-1">✹ ${product}</h6>`;
//       // });
//       // const dateString = new Date(order.orderDate).toLocaleDateString("en-US", {
//       //   day: "2-digit",
//       //   month: "short",
//       //   year: "numeric",
//       // });
//       const discount_price =
//         product.price - (product.price * product.discount) / 100;
//       const instock = product.total_stock > 0;
//       const tableRow = document.createElement("tr");
//       tableRow.innerHTML = `<tr>
//     <td>
//       <div class="d-flex gap-3">
//         <div class="avatar-sm flex-shrink-0">
//           <div
//             class="avatar-title bg-dark-subtle rounded"
//           >
//             <img
//               src="${product.images[0]}"
//               alt=""
//               class="avatar-xs"
//             />
//           </div>
//         </div>
//         <div class="flex-grow-1">
//           <a href="/product-details?id=${product._id}">
//             <h6 class="fs-16 text-ellipsis">
//               ${product.title}
//             </h6>
//           </a>

//         </div>
//       </div>
//     </td>
//     <td>₹${discount_price}
//     <p class="mb-0 text-muted fs-13"><del>
//                                     ${product.price}</del>
//                                   </p>
//     </td>
//     <td>
//       <span class="badge ${
//         instock
//           ? "bg-success-subtle text-success"
//           : "bg-danger-subtle text-danger"
//       } "
//         >${instock ? "In Stock" : "Out of Stock"}</span
//       >
//     </td>
//     <td>
//       <ul class="list-unstyled d-flex gap-3 mb-0">
//         <li>
//           <a
//             data-custom-data="${product._id}"
//             data-bs-toggle="offcanvas"
//             href="#ecommerceCart"
//             class="btn btn-soft-info btn-icon btn-sm"
//             ><i
//               class="ri-shopping-cart-2-line fs-13"
//             ></i
//           ></a>
//         </li>
//         <li>
//           <button

//             data-custom-data="${product._id}"
//             class="btn btn-soft-danger btn-icon btn-sm remove-from-wishlist"
//             ><i class="ri-close-line fs-13"></i
//           ></button>
//         </li>
//       </ul>
//     </td>
//   </tr>`;
//       wishlistContent.appendChild(tableRow);
//     });

//     //==remove from wishlist
//     const remove_buttons = document.querySelectorAll(
//       ".btn.btn-soft-danger.btn-icon.btn-sm.remove-from-wishlist"
//     );

//     for (let remove_button of remove_buttons) {
//       remove_button.addEventListener("click", async (event) => {
//         event.preventDefault();
//         const itemId = remove_button.getAttribute("data-custom-data").trim();
//         try {
//           const response = await fetch("/edit-wishlist", {
//             method: "delete", // Use POST to add, DELETE to remove
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ itemId }),
//           });
//           if (response.ok) {
//             wishlist_tab.click();
//             // alert("item removed from wishlist");
//           } else {
//             alert("something went wrong");
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

console.log("eheole");
//////////////////////////////////////////////////////////////////////////////////////////////

const wishlist_tab = document.getElementById("wishlist"); //here id of triggering element (a tag)
wishlist_tab.addEventListener("shown.bs.tab", async function (event) {
  try {
    // event.preventDefault();
    console.log("wishlist clicked");

    const wishlistContent = document.getElementById("wishlistContent");
    await updateWishlistContent(wishlistContent);
  } catch (error) {
    console.log(error);
  }
});

async function updateWishlistContent(wishlistContent) {
  wishlistContent.innerHTML = "";

  try {
    const response = await fetch(`/wishlist-page`);
    const data = await response.json();
    console.log(data.wishlist);
    data.wishlist.forEach((product) => {
      let productNamesHTML = "";
      // order.productNames.forEach((product) => {
      //   productNamesHTML += `<h6 class="fs-15 mb-1">✹ ${product}</h6>`;
      // });
      // const dateString = new Date(order.orderDate).toLocaleDateString("en-US", {
      //   day: "2-digit",
      //   month: "short",
      //   year: "numeric",
      // });
      const discount_price =
        product.price - (product.price * product.discount) / 100;
      const instock = product.total_stock > 0;
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `<tr>
    <td>
      <div class="d-flex gap-3">
        <div class="avatar-sm flex-shrink-0">
          <div
            class="avatar-title bg-dark-subtle rounded"
          >
            <img
              src="${product.images[0]}"
              alt=""
              class="avatar-xs"
            />
          </div>
        </div>
        <div class="flex-grow-1">
          <a href="/product-details?id=${product._id}">
            <h6 class="fs-16 text-ellipsis">
              ${product.title}
            </h6>
          </a>
         
        </div>
      </div>
    </td>
    <td>₹${discount_price}
    <p class="mb-0 text-muted fs-13"><del>
                                    ${product.price}</del>
                                  </p>
    </td>
    <td>
      <span class="badge ${
        instock
          ? "bg-success-subtle text-success"
          : "bg-danger-subtle text-danger"
      } "
        >${instock ? "In Stock" : "Out of Stock"}</span
      >
    </td>
    <td>
      <ul class="list-unstyled d-flex gap-3 mb-0">
        <li>
          <a
            data-custom-data="${product._id}"
            data-bs-toggle="offcanvas"
            href="#ecommerceCart"
            class="btn btn-soft-info btn-icon btn-sm"
            ><i
              class="ri-shopping-cart-2-line fs-13"
            ></i
          ></a>
        </li>
        <li>
          <button
          
            data-custom-data="${product._id}"
            class="btn btn-soft-danger btn-icon btn-sm remove-from-wishlist"
            ><i class="ri-close-line fs-13"></i
          ></button>
        </li>
      </ul>
    </td>
  </tr>`;
      wishlistContent.appendChild(tableRow);
    });

    // remove from wishlist
    const remove_buttons = document.querySelectorAll(
      ".btn.btn-soft-danger.btn-icon.btn-sm.remove-from-wishlist"
    );

    for (let remove_button of remove_buttons) {
      remove_button.addEventListener("click", async (event) => {
        event.preventDefault();
        const itemId = remove_button.getAttribute("data-custom-data").trim();
        try {
          const response = await fetch(`/edit-wishlist?itemId=${itemId}`, {
            method: "delete", // Use POST to add, DELETE to remove
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId }),
          });
          if (response.ok) {
            alert("item removed from wishlist");
            await updateWishlistContent(wishlistContent); // Update wishlist content after successful removal
          } else {
            alert("something went wrong");
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}
