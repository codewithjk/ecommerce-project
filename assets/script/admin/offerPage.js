var createOfferForm = document.querySelector(".addOffer-form");

createOfferForm.addEventListener("submit", (event) => {
  event.preventDefault();

  var inputTitle = document.getElementById("offerTitle-field").value.trim();
  // var offerImg = document.getElementById("category-img").src;
  // var condition = document.getElementById("condition-field").value;
  // var limit = document.getElementById("limit-field").value;
  var start = document.getElementById("startdate-field").value.trim();
  var end = document.getElementById("enddate-field").value.trim();
  var discount = document.getElementById("discount-field").value.trim();
  // var count = document.getElementById("count-field").value;
  var category = document.getElementById("category-field").value.trim();
  let inputValidation = true;
  if (inputTitle == "") {
    titleError.innerHTML = "fill this field";
    inputValidation = false;
    return;
  }
  // Validate start date
  var currentDate = new Date();

  if (new Date(start) < currentDate) {
    document.querySelector("#dateError").innerHTML =
      "Select any upcoming date ";
    inputValidation = false;
    return;
  }

  // Validate end date
  if (end <= start) {
    document.querySelector("#dateError").innerHTML =
      "End date must be after the start date";
    inputValidation = false;
    return;
  }

  if (!/^[0-9]+$/.test(discount) || isNaN(discount) || Number(discount) > 100) {
    priceError.innerHTML = "discount should be a number less then 100";
    validInput = false;
    return;
  }

  if (!inputValidation) {
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

        return response.json();
      })
      .then((data) => {
        if (data.message) {
          document.querySelector(".formSuccess").innerHTML = data.message;
          document.location.href = "/admin/offers";
        } else if (data.error) {
          document.querySelector(".formError").innerHTML = data.error;
        }
      })
      .catch((error) => {
        console.error(error);
        document.querySelector(".formError").innerHTML = error;
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

// delete offer
const deleteOffer_modal = document.getElementById("deleteOfferModal");
deleteOffer_modal.addEventListener("show.bs.modal", function (showevent) {
  showevent.stopPropagation();
  const delete_offer_button = document.getElementById("remove-offer");

  delete_offer_button.addEventListener("click", (event) => {
    event.preventDefault();
    const button = showevent.relatedTarget;
    const offer_id = button.getAttribute("data-custom-data");

    fetch(`/admin/remove-offer/?offerId=${offer_id}`, {
      method: "delete",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          document.getElementById("yes-delete").innerHTML =
            data.message ?? data.error;
          // alert(data.message);
          window.location.href = data.redirect;
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
