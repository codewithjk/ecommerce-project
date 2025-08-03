//addressId to send
let selectedAddressId;

window.addEventListener("load", async () => {
  await loadAdress();
});

async function loadAdress() {
  const addressContent = document.getElementById("addressContent");
  addressContent.innerHTML = "";

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
    //
    const radioDiv = document.createElement("div");
    radioDiv.classList.add("form-check", "form-check-inline", "p-0", "m-0");

    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "addressRadio";
    radioInput.value = address._id;
    radioInput.id = address._id;
    radioInput.classList.add("form-check-input");
    radioInput.hidden = true;

    const radioLabel = document.createElement("label");
    radioLabel.classList.add(
      "form-check-label",
      "ms-2",
      "btn",
      "active",
      "rounded-circle"
    );
    // radioLabel.textContent = "Select";
    radioLabel.setAttribute("for", `${address._id}`);

    // Function to handle radio button change
    function handleRadioChange() {
      // Reset background color of all labels
      document.querySelectorAll(".form-check-label").forEach((label) => {
        label.classList.remove("btn-success");
      });
      // Set background color of selected label
      if (radioInput.checked) {
        radioLabel.classList.add("btn-success");
      }
    }

    // Add event listener to handle radio button change
    radioInput.addEventListener("change", handleRadioChange);

    //

    radioDiv.appendChild(radioInput);
    radioDiv.appendChild(radioLabel);

    const editLink = document.createElement("a");
    editLink.href = "address.html";
    editLink.classList.add("badge", "bg-primary-subtle", "text-primary");
    editLink.innerHTML =
      '<i class="ri-pencil-fill align-bottom me-1"></i> Edit';
    editLink.setAttribute("data-custom-data", JSON.stringify(address)); // Assuming categoryObj is the custom data
    editLink.setAttribute("data-bs-toggle", "modal");
    editLink.setAttribute("data-bs-target", "#editAddressModal");

    // floatEnd.appendChild(radioInput);
    floatEnd.appendChild(editLink);

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

    cardBody.appendChild(radioDiv);
    cardBody.appendChild(floatEnd);
    cardBody.appendChild(addressHeading);
    cardBody.appendChild(name);
    cardBody.appendChild(addressLine);
    cardBody.appendChild(phoneNumber);

    card.appendChild(cardBody);

    cardCol.appendChild(card);

    addressContent.appendChild(cardCol);
  });
}

//edit address modal
const edit_modal = document.getElementById("editAddressModal");
edit_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

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

        // Trigger 'shown.bs.tab' event on address tab to refresh data
        loadAdress();

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

// add addresss
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
      loadAdress();

      // Close modal
      const add_modal = document.getElementById("addAddressModal");
      const modal = bootstrap.Modal.getInstance(add_modal);
      modal.hide();
    }
  }
});

// button to submit to payment page
const btn = document.getElementById("payment_btn");
btn.addEventListener("click", () => {
  const addressId = getSelectedAddressId();
  if (addressId !== null) {
    window.location.href = `/payment?addressId=${addressId}`;
  } else {
    document.getElementById("selectAddress").innerHTML =
      "Please Select an address";
  }
});

// Function to get selected address ID
function getSelectedAddressId() {
  const selectedRadio = document.querySelector(
    'input[name="addressRadio"]:checked'
  );
  if (selectedRadio) {
    selectedAddressId = selectedRadio.value;
    return selectedAddressId;
  } else {
    return null;
  }
}
