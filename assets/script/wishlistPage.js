//////////////////////////////////////////////////////////////////////////////////////////////

const wishlist_tab = document.getElementById("wishlist"); //here id of triggering element (a tag)
wishlist_tab.addEventListener("shown.bs.tab", async function (event) {
  try {
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
    data.wishlist.forEach((product) => {
      let productNamesHTML = "";

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
