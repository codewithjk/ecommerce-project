var globalproducts = [];
var searchQuery = "";
var skip = 0;
var limit = 10;
var wishlist = [];

//focus on input
const searchModal = document.getElementById("searchModal");
searchModal.addEventListener("shown.bs.modal", function () {
  const searchInput = document.getElementById("search-options");
  searchInput.focus();
});

//get user wishlists
async function getWishlist() {
  const response = await fetch("/wishlist");
  if (response.ok) {
    const data = await response.json();
    return data.items;
  }
}

window.onload = async () => {
  wishlist = await getWishlist();

  globalproducts = await getProducts(searchQuery, skip);
  displayProducts(globalproducts);
};

//display product
const productRow = document.getElementById("product-list");
function displayProducts(products) {
  products.forEach((product) => {
    const discount_price = Math.round(
      product.price - (product.price * product.discount) / 100
    );
    const div = document.createElement("div");
    div.id = product._id;
    div.classList.add("col-xxl-4", "col-lg-4", "col-md-6");
    div.innerHTML = `<div
    class="card ecommerce-product-widgets border-0 rounded-0 shadow-none overflow-hidden"
  >
    <div
      class="bg-light bg-opacity-50 rounded py-4 position-relative"
     
      style="width: 255px;"
    >
      <img
        src="${product.images[0]}"
        alt=""
        style="max-height: 200px; max-width: 100%"
        class="mx-auto d-block rounded-2"
      />
      <div class="action vstack gap-2">
        <button
          data-custom-data="${product._id} "
          class="btn btn-danger avatar-xs p-0 btn-soft-warning custom-toggle product-action ${
            wishlist.includes(product._id) ? " active" : ""
          }"
          data-bs-toggle="button"
        >
          <span class="icon-on"><i class="ri-heart-line"></i></span>
          <span class="icon-off"><i class="ri-heart-fill"></i></span>
        </button>
      </div>
      <div class="avatar-xs label">
        <div class="avatar-title bg-danger rounded-circle fs-11">
          ${product.discount}%
        </div>
      </div>
    </div>
    <div class="pt-4">
      <div>
        
        <a href="/product-details?id=${product._id} ">
          <h6
            class="text-capitalize fs-15 lh-base text-truncate mb-0"
          >
            ${product.title}
          </h6>
        </a>
        <div class="mt-2">
          <span class="float-end"
            >4.9
            <i class="ri-star-half-fill text-warning align-bottom"></i
          ></span>
          <h5 class="text-secondary mb-0">
             ₹${discount_price}
            <span class="text-muted fs-12"
              > ${
                product.discount > 0 ? `<del>₹${product.price}</del>` : ""
              } </span
            >
          </h5>
        </div>
        <div class="tn mt-3">
          <a
            
            href="/product-details?id=${product._id}"
            id="${product._id}"
            class="btn btn-primary btn-hover w-100 add-btn"
            > View product</a
          >
        </div>
      </div>
    </div>
  </div>`;
    productRow.appendChild(div);
  });

  // Get the wishlist button element
  const wishlistButtons = document.querySelectorAll(
    ".btn.btn-danger.avatar-xs.p-0.btn-soft-warning.custom-toggle.product-action"
  );

  for (let wishlistButton of wishlistButtons) {
    // Add click event listener to the wishlist button
    wishlistButton.addEventListener("click", async () => {
      const itemId = wishlistButton.getAttribute("data-custom-data").trim(); // objectid has a space at the end

      // Check if the button is currently active (item is in the wishlist)
      const isActive = wishlistButton.classList.contains("active");

      try {
        // Send a request to the server to add or remove the item from the wishlist
        const response = await fetch(`/edit-wishlist?itemId=${itemId}`, {
          method: isActive ? "patch" : "delete", // Use POST to add, DELETE to remove
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        });

        // Check if the request was successful
        if (response.ok) {
          console.log(" whislist updated");
        } else {
          // Handle error response
          console.error("Failed to update wishlist");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }

  // show and hide loadmore button.

  const loadmoreButton = document.getElementById("loadmore-button");
  if (products.length < 9) {
    loadmoreButton.hidden = true;
  } else {
    loadmoreButton.hidden = false;
  }
}

//loadmore button action
async function loadmore() {
  skip++;
  const products = await getProducts(searchQuery, skip * limit);

  if (products.length === 0 || products.message) {
    document.getElementById("no-result").innerHTML = "No more results found...";
  } else {
    globalproducts.push(...products);
    displayProducts(products);
  }
}

const searchButton = document.getElementById("btn-search");
searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  wishlist = await getWishlist();

  document.getElementById("searchError").innerHTML = "";

  searchQuery = document.getElementById("search-options").value.trim();
  document.getElementById("searchProductList").value = searchQuery;
  if (searchQuery === "") {
    const search_modal = document.getElementById("searchModal");
    const modal = bootstrap.Modal.getInstance(search_modal);
    modal.hide();
  } else {
    try {
      const data = await getProducts(searchQuery, skip);
      if (data.message) {
        document.getElementById("searchError").innerHTML = data.message;
      } else {
        productRow.innerHTML = "";
        globalproducts = data.products;
        displayProducts(globalproducts);

        const search_modal = document.getElementById("searchModal");
        const modal = bootstrap.Modal.getInstance(search_modal);
        modal.hide();
      }
    } catch (error) {
      console.log(error);
    }
  }
});

//function to get products
async function getProducts(searchQuery, skip) {
  try {
    if (searchQuery === "") {
      const response = await fetch(
        `/products/all-products?limit=${limit}&skip=${skip}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        const data = await response.json();
        return data.products;
      }
    } else {
      const response = await fetch(
        `/products/search?limit=${limit}&search=${searchQuery}&skip=${skip}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        const data = await response.json();
        return data;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//function to filter by category
function filterByCategory(category) {
  const filteredProducts = globalproducts.filter((product) => {
    if (product.category === category) {
      return product;
    }
  });

  productRow.innerHTML = "";
  displayProducts(filteredProducts);
}

// Function to filter products by size
function filterProductsBySize(size) {
  const filteredProducts = globalproducts.filter((product) => {
    for (let i = 0; i < product.sizes.length; i++) {
      if (product.sizes[i][size]) {
        return product;
      }
    }
  });

  productRow.innerHTML = "";
  displayProducts(filteredProducts);
}

// Function to filter products by discount
function filterProductsByDiscount(Discount) {
  const filteredProducts = globalproducts.filter(
    (product) => product.discount >= Discount
  );

  productRow.innerHTML = "";
  displayProducts(filteredProducts);
}

// Function to filter products by price
const costRange = document.getElementById("costRange");
const fromValue = document.getElementById("fromValue");
const toValue = document.getElementById("toValue");

costRange.addEventListener("input", function () {
  fromValue.textContent = costRange.min;
  toValue.textContent = costRange.value;

  const filteredProducts = globalproducts.filter(
    (product) => product.price <= costRange.value
  );

  productRow.innerHTML = "";
  displayProducts(filteredProducts);
});
fromValue.textContent = costRange.value;

///sorting the products by price
const sortElem = document.getElementById("sort-elem");

sortElem.addEventListener("change", function () {
  const selectedOption = sortElem.value;
  if (selectedOption === "low_to_high") {
    sortProductsByPriceLowToHigh();
  } else if (selectedOption === "high_to_low") {
    sortProductsByPriceHighToLow();
  } else {
    productRow.innerHTML = "";
    displayProducts(globalproducts);
  }
});

function sortProductsByPriceLowToHigh() {
  const sortedProducts = [...globalproducts].sort(
    (a, b) => parseFloat(a.price) - parseFloat(b.price)
  );
  productRow.innerHTML = "";
  displayProducts(sortedProducts);
}

function sortProductsByPriceHighToLow() {
  const sortedProducts = [...globalproducts].sort(
    (a, b) => parseFloat(b.price) - parseFloat(a.price)
  );
  productRow.innerHTML = "";
  displayProducts(sortedProducts);
}
