let totalBill;
let grandTotal;
listCartItemsPage();
async function listCartItemsPage() {
  try {
    const cartList = document.getElementById("cartItems");
    cartList.innerHTML = "";
    const response = await fetch("/get-cart");
    const { items, total, couponDiscount } = await response.json();
    document.querySelector(".cart-discount").innerHTML = couponDiscount + "%";
    totalBill = total;
    grandTotal = Math.round(total - (total * couponDiscount) / 100);

    document
      .querySelectorAll(".cartitem-badge")
      .forEach((element) => (element.innerHTML = items.length));

    const total_amount = document.querySelectorAll(".cart-total");
    total_amount.forEach((element) => (element.innerHTML = totalBill));

    let grand_total = document.querySelector(".grand-total");
    grand_total.innerHTML = grandTotal;

    document.querySelector(".product-count").innerHTML = items.length;
    items.forEach((item) => {
      let itemPrice = item.PriceAfterCategoryDiscount;

      let totalCategoryDiscount = 0;
      if (item.offers.length !== 0) {
        item.offers.map((offer) => (totalCategoryDiscount += offer.discount));
      }

      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "product");
      listItem.id = `item${item._id}`;

      listItem.innerHTML = `<div class="card product">
      <div class="card-body p-4">
        <div class="row gy-3">
          <div class="col-sm-auto">
            <div class="avatar-lg h-100">
              <div class="avatar-title bg-danger-subtle rounded py-3">
                <img
                  src="${item.image}"
                  alt=""
                  class="avatar-md"
                />
              </div>
            </div>
          </div>
          <div class="col-sm">
            <a href="/product-details?id=${item._id}">
              <h5 class="fs-16 lh-base mb-1">${item.title} </h5>
            </a>
            
            <ul class="list-inline text-muted fs-13 mb-3">
              
              <li class="list-inline-item">
                Size : <span class="fw-medium">${item.size}</span>
              </li>
            </ul>
            <div id="input${item._id}" class="input-step">
              <button type="button" class="minus">–</button>
              <input
                type="number"
                class="product-quantity"
                value="${item.quantity}"
                min="0"
                max="${getMaxStock(item) > 10 ? 10 : getMaxStock(item)}"
                readonly
              />

              <button type="button" class="plus">+</button>
              
            </div>
            ${
              getMaxStock(item) < item.quantity
                ? `<span class="badge bg-danger-subtle text-danger" data-max="${getMaxStock(
                    item
                  )}" data-title="${
                    item.title
                  }" id="outofstock">Out of Stock</span>`
                : ""
            }
            
          </div>
          
          <div class="col-sm-auto">
            <div class="text-lg-end">
              <p class="text-muted mb-1 fs-12">Item Price:</p>
              <h5 class="fs-16">
                ₹<span class="product-price">${
                  item.PriceAfterProductDiscount
                }</span>
              </h5>
            </div>
          </div>
        </div>

        <div class="col-sm-auto ">
        <div class="text-lg my-2">
          <!-- Display offers here -->
          ${item.offers
            .map(
              (offer) => `
            <div class="d-flex gap-3">
            <i class="bi bi-tag-fill me-2 align-middle text-warning"></i>
              <h5>${offer.title}</h5>
              
              <p>Start Date: ${new Date(
                offer.startDate
              ).toLocaleDateString()}</p>
              <p>End Date: ${new Date(offer.endDate).toLocaleDateString()}</p>
              <p>Discount: ${offer.discount}%</p>
             
            </div>
          `
            )
            .join("")}
            <div>Price after offers  : ${Math.floor(
              item.PriceAfterCategoryDiscount
            )}</div>
        </div>
      </div>
      


      </div>
      <div class="card-footer">
        <div class="row align-items-center gy-3">
          <div class="col-sm">
            <div class="d-flex flex-wrap my-n1">
              <div>
                <a
                  href="#!"
                  class="d-block text-body p-1 px-2"
                  data-bs-toggle="modal"
                  data-custom-data="${item._id}"
                  data-bs-target="#removeItemModal"
                  ><i
                    class="ri-delete-bin-fill text-muted align-bottom me-1"
                  ></i>
                  Remove</a
                >
              </div>
              
            </div>
          </div>
          <div class="col-sm-auto">
            <div class="d-flex align-items-center gap-2 text-muted">
              <div>Total :</div>
              <h5 class="fs-14 mb-0">
                ₹<span class="product-line-price">${
                  item.PriceAfterCategoryDiscount * item.quantity
                }</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
      <!-- end card footer -->
    </div>`;

      cartList.appendChild(listItem);
      // Get the container element for input steps
      const inputStepsContainer = document.getElementById(`item${item._id}`);

      // Add event listener to the container element
      inputStepsContainer.addEventListener("click", async function (event) {
        const target = event.target;

        const input = inputStepsContainer.querySelector(".product-quantity");
        const max = input.getAttribute("max");
        const productqty = input.value;
        const totalperItem = inputStepsContainer.querySelector(
          ".product-line-price"
        );

        if (
          target.classList.contains("minus") ||
          target.classList.contains("plus")
        ) {
          let quantity = parseInt(input.value);

          // Update the quantity based on the button clicked
          if (target.classList.contains("minus") && quantity > 1) {
            quantity--;
            totalBill = totalBill - itemPrice;
            total_amount.forEach((element) => (element.innerHTML = totalBill));
            grandTotal = grandTotal - itemPrice;
            grand_total.innerHTML = grandTotal;
          } else if (target.classList.contains("plus") && quantity < max) {
            quantity++;
            totalBill = totalBill + itemPrice;
            total_amount.forEach((element) => (element.innerHTML = totalBill));
            grandTotal = grandTotal + itemPrice;
            grand_total.innerHTML = grandTotal;
          }
          totalperItem.innerHTML = quantity * itemPrice;
          // Update the input value
          input.value = quantity;
          await fetch(
            `/update-item-count?itemId=${item._id}&count=${quantity}`
          );
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}

//apply coupon
const apply_button = document.getElementById("applybutton");
apply_button.addEventListener("click", async (event) => {
  const amount = document.querySelectorAll(".cart-total");
  const code = document.getElementById("codeInput").value;

  const response = await fetch(`/apply-coupon?code=${code}&amount=${amount}`);
  if (!response.ok) {
    alert("something went wrong");
    location.reload();
  } else {
    const data = await response.json();

    alert(data.message);
    location.reload();
  }
});

function getMaxStock(item) {
  // Iterate over the stock_per_size array to find the stock for the selected size
  for (let i = 0; i < item.stock_per_size.length; i++) {
    const sizeObj = item.stock_per_size[i];
    // Check if the size in the stock_per_size array matches the selected size
    if (sizeObj.hasOwnProperty(item.size)) {
      return sizeObj[item.size]; // Return the stock for the selected size
    }
  }
  return 0; // Return 0 if the size is not found
}

const checkoutButton = document.getElementById("checkoutButton");
checkoutButton.addEventListener("click", async (event) => {
  // window.location.reload();
  await listCartItemsPage();
  const outOfStockProduct = document.getElementById("outofstock");

  if (outOfStockProduct !== null) {
    const title = outOfStockProduct.getAttribute("data-title");
    const maxCount = outOfStockProduct.getAttribute("data-max");
    // alert(`${title} has only ${maxCount} left`);

    document.getElementById(
      "cart-error"
    ).innerHTML = `${title} has only ${maxCount} left`;
  } else {
    window.location.href = "/checkout";
  }
});
