console.log("couon page");

// ADD coupon image
document
  .querySelector("#category-image-input")
  .addEventListener("change", function () {
    console.log("change");
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

  var inputTitle = document.getElementById("couponTitle-field").value;
  var couponImg = document.getElementById("category-img").src;
  var condition = document.getElementById("condition-field").value;
  var limit = document.getElementById("limit-field").value;
  var start = document.getElementById("startdate-field").value;
  var end = document.getElementById("enddate-field").value;
  var discount = document.getElementById("discount-field").value;
  var count = document.getElementById("count-field").value;

  if (
    inputTitle == "" ||
    discount === "" ||
    limit === "" ||
    start === "" ||
    end === "" ||
    discount == "" ||
    count == "" ||
    couponImg == ""
  ) {
    document.querySelector(".formError").innerHTML =
      "Please fill all the fields";
  } else {
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
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message) {
          console.log(data);
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
  console.log(coupon);

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
    console.log(coupon_id);

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
      });
  });
});
