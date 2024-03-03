console.log("this is cart page");
listCartItemsPage();
async function listCartItemsPage() {
  console.log("fn called");
  try {
    const cartList = document.getElementById("cartItems");
    cartList.innerHTML = "";
    const response = await fetch("/get-cart");
    const { items, total } = await response.json();
    console.log(items.length);
    console.log(document.querySelectorAll(".cartitem-badge"));
    document
      .querySelectorAll(".cartitem-badge")
      .forEach((element) => (element.innerHTML = items.length));
    console.log(items);

    document.querySelector(".cart-total").innerHTML = total;
    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "product");

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
            <div id="inputStepsContainer" class="input-step">
              <button type="button" class="minus">–</button>
              <input
                type="number"
                class="product-quantity"
                value="${item.quantity}"
                min="0"
                max="100"
                readonly=""
              />
              <button type="button" class="plus">+</button>
            </div>
          </div>
          <div class="col-sm-auto">
            <div class="text-lg-end">
              <p class="text-muted mb-1 fs-12">Item Price:</p>
              <h5 class="fs-16">
                $<span class="product-price">${item.price}</span>
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
                $<span class="product-line-price">${
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
    });
  } catch (error) {
    console.log(error);
  }
}

// Get the container element for input steps
const inputStepsContainer = document.getElementById("inputStepsContainer");

// Add event listener to the container element
inputStepsContainer.addEventListener("click", function (event) {
  const target = event.target;

  // Check if the clicked element is a minus or plus button
  if (target.classList.contains("minus") || target.classList.contains("plus")) {
    // Get the input element associated with the clicked button
    const input = inputStepsContainer.querySelector(".product-quantity");

    // Get the current quantity value
    let quantity = parseInt(input.value);

    // Update the quantity based on the button clicked
    if (target.classList.contains("minus") && quantity > 0) {
      quantity--;
    } else if (target.classList.contains("plus")) {
      quantity++;
    }

    // Update the input value
    input.value = quantity;
  }
});
