//address tabs in account info

const addressContent = document.getElementById("addressContent");
addressContent.innerHTML = "";
const address_tab = document.getElementById("shippingAddress"); //here id of triggering element (a tag)
address_tab.addEventListener("shown.bs.tab", async function (event) {
  event.preventDefault();
  const addressContent = document.getElementById("addressContent");
  addressContent.innerHTML = "";
  console.log("address");
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
    editLink.href = "address.html";
    editLink.classList.add("badge", "bg-primary-subtle", "text-primary");
    editLink.innerHTML =
      '<i class="ri-pencil-fill align-bottom me-1"></i> Edit';
    editLink.setAttribute("data-custom-data", JSON.stringify(address)); // Assuming categoryObj is the custom data
    editLink.setAttribute("data-bs-toggle", "modal");
    editLink.setAttribute("data-bs-target", "#editAddressModal");

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

    cardBody.appendChild(floatEnd);
    cardBody.appendChild(addressHeading);
    cardBody.appendChild(name);
    cardBody.appendChild(addressLine);
    cardBody.appendChild(phoneNumber);

    card.appendChild(cardBody);

    cardCol.appendChild(card);

    addressContent.appendChild(cardCol);
  });

  try {
  } catch (error) {
    console.log(error);
  }
});

//edit address modal
const edit_modal = document.getElementById("editAddressModal");
edit_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const address = button.getAttribute("data-custom-data");
  const addressobj = JSON.parse(address);
  console.log(addressobj);

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
    let filled = true;

    let inputElements = form.querySelectorAll("input:enabled");
    inputElements.forEach((input) => {
      if (input.value == " " || input.value == "") {
        document.getElementById("fillerrror").innerText =
          "Please fill all the fields";
        filled = false;
      }
    });
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
        console.log(message);
        document.getElementById("success").innerHTML =
          "address successfully edited";

        // Trigger 'shown.bs.tab' event on address tab to refresh data
        const addressTab = document.getElementById("shippingAddress");
        const shownEvent = new Event("shown.bs.tab", {
          bubbles: true,
          cancelable: true,
        });
        addressTab.dispatchEvent(shownEvent);

        // Close modal
        // const modal = bootstrap.Modal.getInstance(edit_modal);
        // modal.hide();
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
  let filled = true;
  let inputElements = add_form.querySelectorAll("input:enabled");
  inputElements.forEach((input) => {
    if (input.value == " " || input.value == "") {
      document.getElementById("addfillerrror").innerText =
        "Please fill all the fields";
      filled = false;
    }
  });

  if (filled) {
    console.log("add address");
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
      console.log(message);
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
