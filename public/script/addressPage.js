//address tabs in account info

async function reload() {
  const addressContent = document.getElementById("addressContent");
  addressContent.innerHTML = "";
  try {
    const response = await fetch(`/address`);
    const data = await response.json();
    data.addresses.forEach((address) => {
      const cardCol = document.createElement("div");
      cardCol.classList.add("col-md-6", "mb-2");

      const card = document.createElement("div");
      card.classList.add("card", "mb-md-0");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const floatEnd = document.createElement("div");
      floatEnd.classList.add("float-end", "clearfix");

      const editLink = document.createElement("a");
      // editLink.href = "address.html";
      editLink.classList.add("badge", "bg-primary-subtle", "text-primary");
      editLink.innerHTML =
        '<i class="ri-pencil-fill align-bottom me-1"></i> Edit';
      editLink.setAttribute("data-custom-data", JSON.stringify(address)); // Assuming categoryObj is the custom data
      editLink.setAttribute("data-bs-toggle", "modal");
      editLink.setAttribute("data-bs-target", "#editAddressModal");

      const removeLink = document.createElement("a");
      // editLink.href = "address.html";
      removeLink.classList.add("badge", "bg-danger-subtle", "text-danger");
      removeLink.innerHTML =
        '<i class="ri-trash-fill align-bottom me-1"></i> Remove';
      removeLink.setAttribute("data-custom-data", address._id); // Assuming categoryObj is the custom data
      removeLink.setAttribute("data-bs-toggle", "modal");
      removeLink.setAttribute("data-bs-target", "#removeAddressModal");

      floatEnd.appendChild(editLink);
      floatEnd.appendChild(removeLink);

      const addressHeading = document.createElement("p");
      addressHeading.classList.add(
        "mb-3",
        "fw-semibold",
        "fs-12",
        "d-block",
        "text-muted",
        "text-uppercase"
      );
      addressHeading.textContent = "shipping address";

      const name = document.createElement("h6");
      name.classList.add("fs-14", "mb-2", "d-block");
      name.textContent = address.fullName;

      const addressLine = document.createElement("span");
      addressLine.classList.add(
        "text-muted",
        "fw-normal",
        "text-wrap",
        "mb-1",
        "d-block"
      );
      addressLine.textContent = `${address.addressLine1}, ${address.city}, ${address.state} ${address.postalCode}`;

      const phoneNumber = document.createElement("span");
      phoneNumber.classList.add("text-muted", "fw-normal", "d-block");
      phoneNumber.textContent = `Mo. ${address.phoneNumber}`;

      cardBody.appendChild(floatEnd);
      cardBody.appendChild(addressHeading);
      cardBody.appendChild(name);
      cardBody.appendChild(addressLine);
      cardBody.appendChild(phoneNumber);

      card.appendChild(cardBody);

      cardCol.appendChild(card);

      addressContent.appendChild(cardCol);
    });
  } catch (error) {
    console.log(error);
  }
}

const address_tab = document.getElementById("shippingAddress"); //here id of triggering element (a tag)
address_tab.addEventListener("shown.bs.tab", async function (event) {
  // event.preventDefault();
  await reload();
});

//edit address modal
const edit_modal = document.getElementById("editAddressModal");
edit_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;
  document.getElementById("success").innerHTML = "";
  addressContent.innerHTML = "";
  const address = button.getAttribute("data-custom-data");
  const addressobj = JSON.parse(address);

  document.getElementById("editaddress-Name").value = addressobj.fullName;
  document.getElementById("editaddress-textarea").value =
    addressobj.addressLine1;
  document.getElementById("editaddress-phone").value = addressobj.phoneNumber;
  document.getElementById("editaddress-state").value = addressobj.state;
  document.getElementById("editaddress-city").value = addressobj.city;
  document.getElementById("editaddress-postalCode").value =
    addressobj.postalCode;

  const form = document.getElementById("editAddress-form");
  form.addEventListener("submit", async (event) => {
    addressContent.innerHTML = "";
    event.preventDefault();

    let inputElements = form.querySelectorAll("input:enabled");

    let filled = true;
let errorMessage = "";

inputElements.forEach((input) => {
  const value = input.value.trim();
  const fieldName = input.getAttribute("name");

  switch (fieldName) {
    case "name":
      if (value === "") {
        errorMessage = "Please enter your name.";
        filled = false;
      }
      break;

    case "phoneNumber":
      if (value === "") {
        errorMessage = "Please enter your phone number.";
        filled = false;
      } else if (!/^\d{10}$/.test(value)) {
        errorMessage = "Phone number must be 10 digits.";
        filled = false;
      }
      break;

    case "city":
      if (value === "") {
        errorMessage = "Please enter your city.";
        filled = false;
      }
      break;

    case "state":
      if (value === "") {
        errorMessage = "Please enter your state.";
        filled = false;
      }
      break;

    case "postalCode":
      if (value === "") {
        errorMessage = "Please enter your postal code.";
        filled = false;
      } else if (!/^\d{6}$/.test(value)) {
        errorMessage = "Postal code must be 6 digits.";
        filled = false;
      }
      break;

    default:
      break;
  }

  // Stop checking others if already invalid
  if (!filled) {
    console.warn(`Validation failed for: ${fieldName}`);
    return;
  }
});

const errorContainer = document.getElementById("fillerrror");
if (!filled) {
  errorContainer.innerText = errorMessage;
} else {
  errorContainer.innerText = ""; // clear message
}



    console.log(filled)
    if (filled) {
      const data = {
        id: addressobj._id,
        fullName: document.getElementById("editaddress-Name").value,
        addressLine1: document.getElementById("editaddress-textarea").value,
        city: document.getElementById("editaddress-city").value,
        state: document.getElementById("editaddress-state").value,
        postalCode: document.getElementById("editaddress-postalCode").value,
        phoneNumber: document.getElementById("editaddress-phone").value,
      };

      const response = await fetch(`/edit-address`, {
        method: "patch",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const message = await response.json();
      if (message) {
        document.getElementById("success").innerHTML =
          "address successfully edited";

        await reload();
        const add_modal = document.getElementById("editAddressModal");
        const modal = bootstrap.Modal.getInstance(add_modal);
        modal.hide();
      }
    }
  });
});

//hide the error
document.addEventListener("click", (event) => {
  if (event.target.tagName === "INPUT") {
    var paragraph = document.querySelectorAll(".hideError");
    paragraph.forEach((p) => {
      p.innerHTML = "";
    });
  }
});

// add address
const add_form = document.getElementById("createAddress-form");
add_form.addEventListener("submit", async function (event) {
  event.preventDefault();

  let inputElements = add_form.querySelectorAll("input:enabled");

  let filled = true;
let errorMessage = "";

inputElements.forEach((input) => {
  const value = input.value.trim();
  const fieldName = input.getAttribute("name");

  switch (fieldName) {
    case "name":
      if (value === "") {
        errorMessage = "Please enter your name.";
        filled = false;
      }
      break;

    case "phoneNumber":
      if (value === "") {
        errorMessage = "Please enter your phone number.";
        filled = false;
      } else if (!/^\d{10}$/.test(value)) {
        errorMessage = "Phone number must be 10 digits.";
        filled = false;
      }
      break;

    case "city":
      if (value === "") {
        errorMessage = "Please enter your city.";
        filled = false;
      }
      break;

    case "state":
      if (value === "") {
        errorMessage = "Please enter your state.";
        filled = false;
      }
      break;

    case "postalCode":
      if (value === "") {
        errorMessage = "Please enter your postal code.";
        filled = false;
      } else if (!/^\d{6}$/.test(value)) {
        errorMessage = "Postal code must be 6 digits.";
        filled = false;
      }
      break;

    default:
      break;
  }

  // Stop checking others if already invalid
  if (!filled) {
    console.warn(`Validation failed for: ${fieldName}`);
    return;
  }
});

const errorContainer = document.getElementById("addfillerrror");
if (!filled) {
  errorContainer.innerText = errorMessage;
} else {
  errorContainer.innerText = ""; // clear message
}


  if (filled) {
    const data = {
      fullName: document.getElementById("addaddress-Name").value,
      addressLine1: document.getElementById("addaddress-textarea").value,
      city: document.getElementById("addaddress-city").value,
      state: document.getElementById("addaddress-state").value,
      postalCode: document.getElementById("addaddress-postalCode").value,
      phoneNumber: document.getElementById("addaddress-phone").value,
    };

    const postalCode = document.getElementById("addaddress-postalCode").value;
    const pincodeVerifyResponse = await fetch(
      `https://api.postalpincode.in/pincode/${postalCode}`
    );
    if (!pincodeVerifyResponse.ok) {
      document.getElementById("invalid-pincode").innerHTML = "invalid pincode";
    } else {
      const validPincode = await pincodeVerifyResponse.json();
      if (validPincode[0].Status === "Error") {
        document.getElementById("invalid-pincode").innerHTML =
          "invalid pincode";
        return;
      }
    }

    const response = await fetch("/add-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const message = await response.json();
    if (message) {
      document.getElementById("addsuccess").innerHTML =
        "address successfully  added";

      add_form.reset();

      //  'shown.bs.tab' event on address tab to refresh data
      const addressTab = document.getElementById("shippingAddress");
      const shownEvent = new Event("shown.bs.tab", {
        bubbles: true,
        cancelable: true,
      });
      addressTab.dispatchEvent(shownEvent);

      // Close modal
      const add_modal = document.getElementById("addAddressModal");
      const modal = bootstrap.Modal.getInstance(add_modal);
      modal.hide();
    }
  }
});

//remove address
const remove_address_modal = document.getElementById("removeAddressModal");
remove_address_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const addressId = button.getAttribute("data-custom-data");

  const removeButton = document.getElementById("remove-address-button");
  removeButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/remove-address?addressId=${addressId}`, {
        method: "delete",
      });
      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      } else {
        const data = await response.json();
        document.getElementById("address-delete-succcess").innerHTML =
          data.message;
        await reload();
        const modal = bootstrap.Modal.getInstance(remove_address_modal);
        modal.hide();
      }
    } catch (error) {
      document.getElementById("address-delete-error").innerHTML =
        "something went wrong try again!";
    }
  });
});
