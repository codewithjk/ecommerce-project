console.log("offer page");

//
var createOfferForm = document.querySelector(".addOffer-form");

createOfferForm.addEventListener("submit", (event) => {
  event.preventDefault();

  var inputTitle = document.getElementById("offerTitle-field").value;
  // var offerImg = document.getElementById("category-img").src;
  // var condition = document.getElementById("condition-field").value;
  // var limit = document.getElementById("limit-field").value;
  var start = document.getElementById("startdate-field").value;
  var end = document.getElementById("enddate-field").value;
  var discount = document.getElementById("discount-field").value;
  // var count = document.getElementById("count-field").value;
  var category = document.getElementById("category-field").value;

  if (
    inputTitle == "" ||
    discount === "" ||
    start === "" ||
    end === "" ||
    category === ""
  ) {
    document.querySelector(".formError").innerHTML =
      "Please fill all the fields";
  } else {
    let data = {
      title: inputTitle,
      startDate: start,
      endDate: end,
      discount: discount,
      category: category,
    };
    console.log(data);
    fetch("/admin/add-category-offer", {
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
          document.location.href = "/admin/offers";
        } else if (data.error) {
          document.querySelector(".formError").innerHTML = data.error;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// view offer

const viewOffer_modal = document.getElementById("offerDetails");
viewOffer_modal.addEventListener("show.bs.offcanvas", function (event) {
  event.stopPropagation();
  const button = event.relatedTarget;
  const offerObj = button.getAttribute("data-custom-data");
  const offer = JSON.parse(offerObj);
  console.log(offer);

  document.getElementById("img-thumbnail").src = offer.image;
  document.getElementById("ctitle").innerHTML = offer.title;
  document.getElementById("cdiscount").innerHTML = offer.discount;
  document.getElementById("cstartDate").innerHTML =
    offer.startDate.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  document.getElementById("cendDate").innerHTML = offer.endDate.toLocaleString(
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

  document.getElementById("ccategory").innerHTML = offer.category;
});
