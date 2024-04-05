async function productData(id) {
  const response = await fetch(`/admin/get-product?productId=${id}`);
  const responseData = await response.json();
  return responseData.product;
}
window.onload = async function () {
  try {
    const productId = new URLSearchParams(window.location.search).get(
      "productId"
    );

    const product = await productData(productId);
    let size = product.sizes;
    document.getElementById("descriptionInput").value = product.description;
    //display image
    var imageRow = document.getElementById("image-list");
    imageRow.innerHTML = "";

    product.images.forEach((image, i) => {
      var div = document.createElement("div");
      div.id = `${i}`;
      div.classList.add(
        "w-auto",
        "position-relative",
        "rounded",
        "overflow-hidden"
      );
      let span = document.createElement("span");
      span.classList.add(
        "position-absolute",
        "top-0",
        "end-0",
        "badge",
        "badge-danger",
        "text-danger"
      );
      span.innerHTML = `<i class="bi bi-x-circle"></i>`;
      span.setAttribute("data-custom-data", `${image}`);
      // span.setAttribute("href", "#deleteImageModal");
      // span.setAttribute("data-bs-toggle", "modal");
      // Add event listener to the span for confirmation modal
      span.addEventListener("click", async function () {
        const response = await fetch(
          `/admin/remove-image?url=${image}&pid=${product._id}`,
          {
            method: "patch",
          }
        );
        if (!response.ok) {
          alert("failed to remove");
        } else {
          alert("iamage removed");
          document.getElementById(`${i}`).hidden = true;
        }
      });
      div.appendChild(span);

      var img = document.createElement("img");
      img.src = image;
      img.width = 150;
      div.appendChild(img);
      imageRow.appendChild(div);
    });

    //display sizes
    size.forEach((obj) => {
      let id = Object.keys(obj)[0];

      let input = document.getElementById(id);
      var checkbox = document.getElementById(`size${id}`);

      checkbox.checked = true;

      input.disabled = false;
      input.value = Object.values(obj)[0];
    });
  } catch (error) {
    console.error(error);
  }
};

///////////////////////////////////////////////////

async function removeImage(image, productId) {
  const response = await fetch(
    `/admin/remove-image?url=${image}&pid=${productId}`,
    {
      method: "patch",
    }
  );
  if (!response.ok) {
    alert("failed to remove");
  } else {
    alert("iamage removed");
    document.getElementById(`${image}`).hidden = true;
  }
}

// upload image
document
  .querySelector("#uploadFile")
  .addEventListener("change", function (event) {
    const preview = document.querySelector("#preview");

    let file = event.target.files[0];
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
    const productId = new URLSearchParams(window.location.search).get(
      "productId"
    );
    let data = {
      id: productId,
      title: productTitle,
      description: description,
      category: category,
      price: price,
      discount: discount,
      size: size,
      image: images,
    };
    fetch("/admin/edit-product", {
      method: "patch",
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
    document.querySelector(".formError").innerHTML =
      "Please fill all the fields";
  }
});

// next button
const nextbtn = document.getElementById("btn-next");
nextbtn.addEventListener("click", (event) => {
  window.location.href = "/admin/products";
});

function removeError(id) {
  document.getElementById(id).innerHTML = "";
}
