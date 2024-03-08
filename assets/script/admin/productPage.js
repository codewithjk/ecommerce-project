// delete product
const delete_modal = document.getElementById("deleteModal");
delete_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const product_id = button.getAttribute("data-custom-data");

  const delete_button = document.getElementById("remove-product");

  delete_button.addEventListener("click", (event) => {
    event.preventDefault();

    console.log(product_id);
    fetch(`/admin/remove-product/?id=${product_id}`, {
      method: "delete",
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
          // document.getElementById("yes-delete").innerHTML = data.message;
          //   alert(data.message);
          window.location.href = data.redirect;
          // document.getElementById("no-delete").innerHTML = data.error;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

//edit product
const edit_modal = document.getElementById("editModal");
edit_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const product = button.getAttribute("data-custom-data");
  const productobj = JSON.parse(product);

  document.getElementById("product-title-input").value = productobj.title;
  // document.getElementById("edit-category-img").src = productobj.image;
  document.getElementById("descriptionInput").value = productobj.description;
  document.getElementById("product-price-input").value = productobj.price;
  document.getElementById("product-discount-input").value = productobj.discount;
  document.getElementById("product-discount-input").value;
  var sizes = document.querySelectorAll(".stock-of-size:enabled");
  var size = productobj.sizes;

  //display sizes
  size.forEach((obj) => {
    let id = Object.keys(obj)[0];
    console.log(id);
    let input = document.getElementById(id);
    var checkbox = document.getElementById(`size${id}`);
    console.log(checkbox);

    checkbox.checked = true;

    input.disabled = false;
    input.value = Object.values(obj)[0];
  });

  //display image
  var imageRow = document.getElementById("image-list");
  imageRow.innerHTML = "";

  productobj.images.forEach((image, i) => {
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
        `/admin/remove-image?url=${image}&pid=${productobj._id}`,
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

  sizes.forEach((element) => {
    let obj = { [element.name]: Number(element.value) };
    size.push(obj);
  });

  console.log(productobj.description);
  const edit_button = document.getElementById("edit-product");

  edit_button.addEventListener("click", (event) => {
    event.preventDefault();
    var sizes = document.querySelectorAll(".stock-of-size:enabled");
    var size = [];
    sizes.forEach((element) => {
      let obj = { [element.name]: Number(element.value) };
      size.push(obj);
    });
    var images = edit_modal.querySelectorAll("img");
    var image = [];
    images.forEach((element) => {
      let src = element.src;
      image.push(src);
    });
    const data = {
      id: productobj._id,
      title: document.getElementById("product-title-input").value,
      image: image,
      description: document.getElementById("descriptionInput").value,
      category: document.getElementById("choices-category-input").value,
      price: Number(document.getElementById("product-price-input").value),
      discount: Number(document.getElementById("product-discount-input").value),
      size: size,
    };
    console.log("upadated data === ", data);

    fetch(`/admin/edit-product`, {
      method: "patch",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
          // document.getElementById("yes-delete").innerHTML = data.message;
          // alert(data.message);
          window.location.href = data.redirect;
          // document.getElementById("no-delete").innerHTML = data.error;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
  // Mark the element to indicate that the event listener has been attached
  // edit_modal.setAttribute("data-bs-bound", "true");
});

// delete image
const delete_image_modal = document.getElementById("deleteImageModal");
delete_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const url = button.getAttribute("data-custom-data");
  console.log(url);

  const delete_button = document.getElementById("remove-image");

  delete_button.addEventListener("click", (event) => {
    event.preventDefault();

    console.log(url);
    // fetch(`/admin/remove-product/?id=${product_id}`, {
    //   method: "delete",
    // })
    //   .then((response) => {
    //     console.log(response);
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     if (data) {
    //       // document.getElementById("yes-delete").innerHTML = data.message;
    //       //   alert(data.message);
    //       window.location.href = data.redirect;
    //       // document.getElementById("no-delete").innerHTML = data.error;
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  });
});
