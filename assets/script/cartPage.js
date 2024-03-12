console.log("this is cart page");
listCartItemsPage();
async function listCartItemsPage() {
  try {
    const cartList = document.getElementById("cartItems");
    cartList.innerHTML = "";
    const response = await fetch("/get-cart");
    const { items, total } = await response.json();
    let totalBill = total;
    console.log(items.length);
    console.log(document.querySelectorAll(".cartitem-badge"));
    document
      .querySelectorAll(".cartitem-badge")
      .forEach((element) => (element.innerHTML = items.length));
    console.log(items);

    const total_amount = document.querySelectorAll(".cart-total");
    total_amount.forEach((element) => (element.innerHTML = totalBill));

    console.log(total_amount);
    document.querySelector(".product-count").innerHTML = items.length;

    items.forEach((item) => {
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
              <h5 class="fs-16 lh-base mb-1">${item.title}</h5>
            </a>
            <ul class="list-inline text-muted fs-13 mb-3">
              <li class="list-inline-item">
                Color : <span class="fw-medium">Red</span>
              </li>
              <li class="list-inline-item">
                Size : <span class="fw-medium">M</span>
              </li>
            </ul>
            <div id="input${item._id}" class="input-step">
              <button type="button" class="minus">–</button>
              <input
                type="number"
                class="product-quantity"
                value="${item.quantity}"
                min="0"
                max="${item.total_stock < 10 ? item.total_stock : 10}"
                readonly
              />
              <button type="button" class="plus">+</button>
            </div>
          </div>
          <div class="col-sm-auto">
            <div class="text-lg-end">
              <p class="text-muted mb-1 fs-12">Item Price:</p>
              <h5 class="fs-16">
                ₹<span class="product-price">${item.price}</span>
              </h5>
            </div>
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
              <div>
                <a href="#!" class="d-block text-body p-1 px-2"
                  ><i class="ri-star-fill text-muted align-bottom me-1"></i>
                  Add Wishlist</a
                >
              </div>
            </div>
          </div>
          <div class="col-sm-auto">
            <div class="d-flex align-items-center gap-2 text-muted">
              <div>Total :</div>
              <h5 class="fs-14 mb-0">
                ₹<span class="product-line-price">${
                  item.price * item.quantity
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
      console.log(inputStepsContainer);
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
          // Get the input element associated with the clicked button
          //   const input = inputStepsContainer.querySelector(".product-quantity");

          // Get the current quantity value
          let quantity = parseInt(input.value);

          // Update the quantity based on the button clicked
          if (target.classList.contains("minus") && quantity > 1) {
            quantity--;
            totalBill = totalBill - item.price;
            total_amount.forEach((element) => (element.innerHTML = totalBill));
          } else if (target.classList.contains("plus") && quantity < max) {
            quantity++;
            totalBill = totalBill + item.price;
            total_amount.forEach((element) => (element.innerHTML = totalBill));
          }
          totalperItem.innerHTML = quantity * item.price;
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
