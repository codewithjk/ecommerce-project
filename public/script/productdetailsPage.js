var options = {
  width: 400,
  zoomWidth: 500,
  offset: { vertical: 0, horizontal: 10 },
  zoomContainer: document.getElementById("zoom-container"),
  scale: 0.7,
};
new ImageZoom(document.getElementById("img-container"), options);

var swiper = new Swiper(".productSwiper", {
  spaceBetween: 10,
  slidesPerView: 4,
  mousewheel: true,
  freeMode: true,
  watchSlidesProgress: true,
  breakpoints: {
    992: {
      slidesPerView: 4,
      spaceBetween: 10,
      direction: "vertical",
    },
  },
});
var swiper2 = new Swiper(".productSwiper2", {
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper,
  },
});

//quantity of product
var plus = document.getElementById("plus");
let minus = document.getElementById("minus");
var productqty = document.getElementById("product-quantity1");

const max = Number(productqty.getAttribute("max"));

plus.addEventListener("click", (event) => {
  event.preventDefault();
  minus.disabled = false;
  if (productqty.value >= max) {
    plus.disabled = true;
  } else {
    productqty.value = Number(productqty.value) + 1;
    addToCartButton.setAttribute("data-custom-data-quantity", productqty.value);
  }
});
minus.addEventListener("click", (event) => {
  event.preventDefault();
  plus.disabled = false;
  if (Number(productqty.value) < 2) {
    minus.disabled = true;
  } else {
    productqty.value = Number(productqty.value) - 1;
    addToCartButton.setAttribute("data-custom-data-quantity", productqty.value);
  }
});

///pass size to cart

function toggleAddToCartButton(size, isChecked) {
  var addToCartButton = document.getElementById("addToCartButton");
  if (isChecked) {
    addToCartButton.setAttribute("data-custom-data-size", size);
  } else {
    addToCartButton.removeAttribute("data-custom-data-size");
  }
}

///pass quantity to cart
function changeQuantity() {
  var quantity = document.getElementById("product-quantity1").value;
  // addToCartButton.setAttribute("data-custom-data-quantity", quantity);
}
