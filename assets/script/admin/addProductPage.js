// upload image
document
  .querySelector("#uploadFile")
  .addEventListener("change", function (event) {
    const preview = document.querySelector("#preview");

    let file = event.target.files[0];

    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        var modal = new bootstrap.Modal(document.getElementById("imageModal"));
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
    // reader.onload = function (e) {
    //   var img = document.getElementById("preview");
    //   img.src = e.target.result;
    //   img.onload = function () {
    //     cropper = new Cropper(img, {
    //       aspectRatio: 1.7777777777777777,
    //     });
    //   };
    // };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      closeModal();
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

  var productTitle = document.getElementById("product-title-input").value;
  var description = document.getElementById("descriptionInput").value;
  var category = document.getElementById("choices-category-input").value;
  // var images = document.getElementById("category-img").src;
  var price = document.getElementById("product-price-input").value;
  var discount = document.getElementById("product-discount-input").value;
  var colors = document.querySelectorAll(".stock-of-color:enabled");
  var sizes = document.querySelectorAll(".stock-of-size:enabled");
  var imageField = document.querySelectorAll(".product-image");

  var color = [];
  var size = [];
  var images = [];

  colors.forEach((element) => {
    let obj = { [element.name]: Number(element.value) };
    color.push(obj);
  });
  sizes.forEach((element) => {
    let obj = { [element.name]: Number(element.value) };
    size.push(obj);
  });

  imageField.forEach((img) => {
    images.push(img.src);
  });

  let filled = true;
  inputFields.forEach((input) => {
    if (input.value.trim() == "") {
      filled = false;
      return;
    }
  });
  if (filled) {
    let data = {
      title: productTitle,
      description: description,
      category: category,
      price: price,
      discount: discount,
      color: color,
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
    document.querySelector(".formError").innerHTML =
      "Please fill all the fields";
  }
});

// next button
const nextbtn = document.getElementById("btn-next");
nextbtn.addEventListener("click", (event) => {
  window.location.href = "/admin/add-product";
});
