listCartItems();

// function for list the cart items
async function listCartItems() {
  try {
    const cartList = document.querySelector(".cartlist");
    cartList.innerHTML = "";
    const response = await fetch("/get-cart");
    const { items, total } = await response.json();
    let totalBill = total;

    document
      .querySelectorAll(".cartitem-badge")
      .forEach((element) => (element.innerHTML = items.length));

    const total_amount = document.querySelectorAll(".cart-total");
    total_amount.forEach((element) => (element.innerHTML = totalBill));

    document.querySelector(".cart-total").innerHTML = total;
    items.forEach((item) => {
      const itemPrice =
        item.price - Math.round((item.price * item.discount) / 100);

      const listItem = document.createElement("li");
      listItem.id = `item${item._id}`;
      listItem.classList.add("list-group-item", "product");

      listItem.innerHTML = `<div class="d-flex gap-3">
        <div class="flex-shrink-0">
            <div class="avatar-md" style="height: 100%;">
                <div class="avatar-title bg-warning-subtle rounded-3">
                    <img src=${item.image} alt="" class="avatar-sm">
                </div>
            </div>
        </div>
        <div class="flex-grow-1">
            <a href="#!">
                <h5 class="fs-15">${item.title}</h5>
            </a>
            <div class="d-flex mb-3 gap-2">
                <div class="text-muted fw-medium mb-0">₹<span class="product-price">${itemPrice}</span></div>
                <div class="vr"></div>
                ${
                  item.total_stock > item.quantity
                    ? '<span class="text-success fw-medium">In stock</span>'
                    : '<span class="text-danger fw-medium">Out of stock</span>'
                }
                
            </div>
            <div class="input-step">
                <button type="button" class="minus">–</button>
                <input type="number" class="product-quantity" value='${
                  item.quantity
                }' min="0" max="100" readonly>
                <button type="button" class="plus">+</button>
            </div>
        </div>
        <div class="flex-shrink-0 d-flex flex-column justify-content-between align-items-end">
            <button type="button" class="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn" data-bs-toggle="modal" data-bs-target="#removeItemModal" data-custom-data=${
              item._id
            }><i class="ri-close-fill fs-16"></i></button>
            <div class="fw-medium mb-0 fs-16">₹<span class="product-line-price">${
              itemPrice * item.quantity
            }</span></div>
        </div>
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
          // Get the current quantity value
          let quantity = parseInt(input.value);

          // Update the quantity based on the button clicked
          if (target.classList.contains("minus") && quantity > 1) {
            quantity--;
            totalBill = totalBill - itemPrice;
            total_amount.forEach((element) => (element.innerHTML = totalBill));
          } else if (target.classList.contains("plus") && quantity < max) {
            quantity++;
            totalBill = totalBill + itemPrice;
            total_amount.forEach((element) => (element.innerHTML = totalBill));
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

//remove item from cart

const remove_modal = document.getElementById("removeItemModal");
if (remove_modal !== null) {
  remove_modal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    console.log("adsfkdaakldsfaldkadskll");
    document.getElementById("cart-delete-succcess").innerHTML = "";
    const itemId = button.getAttribute("data-custom-data");
    console.log(itemId);
    const removeButton = document.getElementById("remove-product-button");
    removeButton.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        const response = await fetch(`/remove-from-cart?itemId=${itemId}`, {
          method: "delete",
        });
        if (!response.ok) {
          throw new Error("Something went wrong. Please try again.");
        } else {
          const data = await response.json();
          document.getElementById("cart-delete-succcess").innerHTML =
            data.message;
          listCartItems();
          listCartItemsPage();
          const modalInstance = new bootstrap.Modal(remove_modal);
          modalInstance.hide();
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
}

//add  to cart

const cart_canvas = document.getElementById("ecommerceCart");
if (cart_canvas !== null) {
  cart_canvas.addEventListener("show.bs.offcanvas", async function (event) {
    const button = event.relatedTarget;
    const itemId = button.getAttribute("data-custom-data");

    const size = button.getAttribute("data-custom-data-size");
    const quantity = button.getAttribute("data-custom-data-quantity") ?? 1;

    if (itemId != null) {
      //in the case of navbar cartbutton itemId will be null
      let Validation = true;
      if (size == null) {
        alert("select a size");
        Validation = false;
      } else {
        try {
          const response = await fetch(
            `/add-to-cart?itemId=${itemId}&size=${size}&quantity=${quantity}`,
            {
              method: "put",
            }
          );
          if (!response.ok) {
            throw new Error("something went wrong cant add to cart");
          } else {
            listCartItems();
          }
        } catch (error) {
          console.log(error.message.code);
          alert("error 500");
        }
      }
    } else {
    }
  });
}
