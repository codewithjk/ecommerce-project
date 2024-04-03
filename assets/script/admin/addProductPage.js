// upload image
document
  .querySelector("#uploadFile")
  .addEventListener("change", function (event) {
    const preview = document.querySelector("#preview");
    document.getElementById("imageError").innerHTML = "";

    let file = event.target.files[0];
    console.log(file);

    if (!file.type.startsWith("image")) {
      document.getElementById("imageError").innerHTML =
        "select a valid image file";
    } else {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          var modal = new bootstrap.Modal(
            document.getElementById("imageModal")
          );
          modal.show();

          // openModal();
          preview.src = reader.result;
          // preview.onload = function () {
          const cropper = new Cropper(preview, {
            dragMode: "move",
            aspectRatio: 1,
            autoCropArea: 1,
            restore: false,
            guides: false,
            center: true,
            responsive: true,
            highlight: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            toggleDragModeOnDblclick: false,
            // cropBoxWidth: 400,
            // cropBoxHeight: 200,
          });
          // };

          const cropButton = document.getElementById("btn-crop");
          cropButton.addEventListener("click", (event) => {
            event.preventDefault();
            const croppedCanvas = cropper.getCroppedCanvas();

            const cardBody = document.querySelector("#images");
            var firstChild = cardBody.firstChild;

            const outputDiv = document.createElement("div");
            outputDiv.classList.add(
              "border",
              "border-black",
              "rounded",
              "p-2",
              "col-md-3"
            );
            const outputImage = document.createElement("img");
            outputImage.src = croppedCanvas.toDataURL();
            outputImage.classList.add("img-fluid", "product-image");

            outputImage.style.height = 170 + "px";
            outputDiv.appendChild(outputImage);
            // cardBody.appendChild(outputImage);
            cardBody.insertBefore(outputDiv, firstChild);
            cropper.destroy();
            modal.hide();
          });
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      } else {
        closeModal();
      }
    }
  });

// control on modal
function openModal() {
  var modal = new bootstrap.Modal(document.getElementById("imageModal"));
  modal.show();
}

function closeModal() {
  var modal = new bootstrap.Modal(document.getElementById("imageModal"));
  modal.hide();
}

// form submission
var createCategoryForm = document.getElementById("createproduct-form");

createCategoryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputFields = createCategoryForm.querySelectorAll("input:enabled");
  priceError.innerHTML = "";

  var productTitle = document
    .getElementById("product-title-input")
    .value.trim();
  var description = document.getElementById("descriptionInput").value.trim();
  var category = document.getElementById("choices-category-input").value.trim();
  var price = document.getElementById("product-price-input").value.trim();
  var discount = document.getElementById("product-discount-input").value.trim();

  var sizes = document.querySelectorAll(".stock-of-size:enabled");
  var imageField = document.querySelectorAll(".product-image");

  var size = [];
  var images = [];

  let validInput = true;

  if (productTitle === "") {
    titleError.innerHTML = "fill this field";
    validInput = false;
    return;
  } else {
    fetch(`/admin/check-product-exists?title=${productTitle}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        const product = data.product;
        console.log("product ==== ", product);
        if (product !== null) {
          titleError.innerHTML = "this product is already exists";
          validInput = false;
          return;
        }
      });
  }
  if (description === "") {
    descriptionError.innerHTML = "fill this field";
    validInput = false;
    return;
  }

  sizes.forEach((element) => {
    const value = Number(element.value);
    const errorDiv = element.nextElementSibling;

    if (isNaN(value) || value <= 0) {
      if (!errorDiv) {
        const newErrorDiv = document.createElement("div");
        newErrorDiv.classList.add("text-danger");
        // newErrorDiv.classList.add("sizeError");
        newErrorDiv.id = "sizeError";
        newErrorDiv.textContent = "Please enter a valid positive number.";
        element.parentNode.appendChild(newErrorDiv);
        validInput = false;
        return;
      } else {
        errorDiv.remove();
      }
    } else {
      let obj = { [element.name]: Number(element.value) };
      size.push(obj);
    }
  });

  imageField.forEach((img) => {
    images.push(img.src);
  });

  // inputFields.forEach((input) => {
  //   if (input.value.trim() == "") {
  //     validInput = false;
  //     return;
  //   }
  // });
  if (!/^[0-9]+$/.test(price)) {
    priceError.innerHTML = "price should be greater then 0.";
    validInput = false;
    return;
  }
  if (!/^[0-9]+$/.test(discount) || isNaN(discount) || Number(discount) > 100) {
    priceError.innerHTML = "discount should be a number less then 100";
    validInput = false;
    return;
  }

  if (validInput) {
    let data = {
      title: productTitle,
      description: description,
      category: category,
      price: price,
      discount: discount,
      size: size,
      image: images,
    };
    fetch("/admin/add-product", {
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
          createCategoryForm.reset();
          var modal = new bootstrap.Modal(
            document.getElementById("successModal")
          );
          modal.show();

          document.querySelector(".formSuccess").innerHTML = data.message;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    document.querySelector(".formError").innerHTML = "Please fill all fields";
  }
});

// next button
const nextbtn = document.getElementById("btn-next");
nextbtn.addEventListener("click", (event) => {
  window.location.href = "/admin/add-product";
});

function removeError(id) {
  document.getElementById(id).innerHTML = "";
}

// function priceValidation() {
//   const firstNameInput = document.getElementById("product-price-input");
//   const firstname = firstNameInput.value.trim();

//   if (firstname == "") {
//     priceError.innerHTML = "price should be greater then 0.";
//   }

//   if (!/^[0-9]+$/.test(firstname)) {
//     priceError.innerHTML = "price should be greater then 0.";
//   } else {
//     priceError.innerHTML = "";
//   }
// }
