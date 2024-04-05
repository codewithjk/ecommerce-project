// ADD coupon image
document
  .querySelector("#category-image-input")
  .addEventListener("change", function () {
    var preview = document.querySelector("#category-img");
    var file = document.querySelector("#category-image-input").files[0];
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        preview.src = reader.result;
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  });

//

var createCouponForm = document.querySelector(".addCoupon-form");

createCouponForm.addEventListener("submit", (event) => {
  event.preventDefault();

  var inputTitle = document.getElementById("couponTitle-field").value.trim();
  var couponImg = document.getElementById("category-img").src;
  var condition = document.getElementById("condition-field").value.trim();
  var limit = document.getElementById("limit-field").value.trim();
  var start = document.getElementById("startdate-field").value.trim();
  var end = document.getElementById("enddate-field").value.trim();
  var discount = document.getElementById("discount-field").value.trim();
  var count = document.getElementById("count-field").value.trim();

  var inputValidation = true;

  // Validate input title
  if (inputTitle == "") {
    document.getElementById("titleError").innerHTML = "Please fill this field";
    inputValidation = false;
  }

  // Validate discount
  if (
    !/^\d+(\.\d+)?$/.test(discount) ||
    Number(discount) >= 100 ||
    Number(discount) <= 0
  ) {
    document.getElementById("discountError").innerHTML =
      "Discount should be a positive number less than 100";
    inputValidation = false;
  }

  // Validate limit
  if (!/^\d+(\.\d+)?$/.test(limit) || Number(limit) <= 0) {
    document.getElementById("limitError").innerHTML =
      "Please enter a valid amount";
    inputValidation = false;
  }

  // Validate condition
  if (!/^\d+(\.\d+)?$/.test(condition) || Number(condition) <= 0) {
    document.getElementById("conditionError").innerHTML =
      "Please enter a valid amount";
    inputValidation = false;
  }

  // Validate start date
  var currentDate = new Date();
  var startDate = new Date(start);
  if (startDate <= currentDate) {
    document.getElementById("dateError").innerHTML =
      "Start date must be after the current date";
    inputValidation = false;
  }

  // Validate end date
  var endDate = new Date(end);
  if (endDate <= startDate) {
    document.getElementById("dateError").innerHTML =
      "End date must be after the start date";
    inputValidation = false;
  }

  // Validate image
  if (!couponImg || !couponImg.startsWith("data:image")) {
    document.getElementById("imageError").innerHTML =
      "Please select a valid image file";
    inputValidation = false;
  }

  // Validate count
  if (!/^\d+$/.test(count) || Number(count) <= 0) {
    document.getElementById("countError").innerHTML =
      "Please enter a valid count";
    inputValidation = false;
  }

  if (inputValidation) {
    let data = {
      title: inputTitle,
      image: couponImg,
      condition: condition,
      limit: limit,
      startDate: start,
      endDate: end,
      discount: discount,
      count: count,
    };
    fetch("/admin/add-coupon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        if (data.message) {
          document.querySelector(".formSuccess").innerHTML = data.message;
          document.location.href = "/admin/coupons";
        } else if (data.error) {
          document.querySelector(".formError").innerHTML = data.error;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// view coupon

const viewCoupon_modal = document.getElementById("couponDetails");
viewCoupon_modal.addEventListener("show.bs.offcanvas", function (event) {
  event.stopPropagation();
  const button = event.relatedTarget;
  const couponObj = button.getAttribute("data-custom-data");
  const coupon = JSON.parse(couponObj);

  document.getElementById("img-thumbnail").src = coupon.image;
  document.getElementById("ctitle").innerHTML = coupon.title;
  document.getElementById("cdiscount").innerHTML = coupon.discount;
  document.getElementById("cstartDate").innerHTML =
    coupon.startDate.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  document.getElementById("cendDate").innerHTML = coupon.endDate.toLocaleString(
    "en-US",
    {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );
  document.getElementById("climit").innerHTML = coupon.limit;
  document.getElementById("ccondition").innerHTML = coupon.condition;
  document.getElementById("ccount").innerHTML = coupon.count;
});

//delete coupon
const modal = document.getElementById("removeCouponModal");

// Event listener for modal show event
modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const coupon_id = button.getAttribute("data-custom-data");

  const block_button = document.getElementById("remove-coupon-btn");

  block_button.addEventListener("click", (event) => {
    event.preventDefault();

    fetch(`/admin/delete-coupon?couponId=${coupon_id}`, {
      method: "delete",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          window.location.reload();
        } else {
          window.location.reload();
          // window.location.href = data.redirect;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

function removeError(id) {
  document.getElementById(id).innerHTML = "";
}
