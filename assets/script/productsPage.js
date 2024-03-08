var globalproducts = [];
var searchQuery = "";
var skip = 0;
var limit = 10;

window.onload = async () => {
  globalproducts = await getProducts(searchQuery, skip);
  console.log(globalproducts);
  displayProducts(globalproducts);
};

console.log("this is product page");

//display product
const productRow = document.getElementById("product-list");
function displayProducts(products) {
  console.log(products);
  // productRow.innerHTML = "";
  products.forEach((product) => {
    const discount_price =
      product.price - (product.price * product.discount) / 100;
    const div = document.createElement("div");
    div.id = product._id;
    div.classList.add("col-xxl-4", "col-lg-4", "col-md-6");
    div.innerHTML = `<div
    class="card ecommerce-product-widgets border-0 rounded-0 shadow-none overflow-hidden"
  >
    <div
      class="bg-light bg-opacity-50 rounded py-4 position-relative"
      onclick="window.location.href='/product-details?id=${product._id} '"
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
          class="btn btn-danger avatar-xs p-0 btn-soft-warning custom-toggle product-action"
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
        <ul
          class="clothe-colors list-unstyled hstack gap-1 mb-3 flex-wrap"
        >
        ${product.colors
          .map(
            (color) => `
              <li>
                <input
                disabled
                  type="radio"
                  name="sizes"
                  id="${Object.keys(color)[0]}"
                />
                <label
                  class="avatar-xs btn btn-${
                    Object.keys(color)[0]
                  } p-0 d-flex align-items-center justify-content-center rounded-circle"
                  for="${Object.keys(color)[0]}"
                ></label>
              </li>
            `
          )
          .join("")}
        </ul>
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
              ><del>₹ ${product.price} </del></span
            >
          </h5>
        </div>
        <div class="tn mt-3">
          <a
            data-bs-toggle="offcanvas"
            href="#ecommerceCart"
            data-custom-data="${product._id} "
            id="${product._id}"
            class="btn btn-primary btn-hover w-100 add-btn"
            ><i class="mdi mdi-cart me-1"></i> Add To Cart</a
          >
        </div>
      </div>
    </div>
  </div>`;
    productRow.appendChild(div);
  });
}

async function loadmore() {
  console.log("heloo");
  skip++;
  const products = await getProducts(searchQuery, skip * limit);
  console.log(products);
  if (products.length === 0 || products.message) {
    document.getElementById("no-result").innerHTML = "No more results found...";
  } else {
    displayProducts(products);
  }
}

const searchButton = document.getElementById("btn-search");
searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
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
