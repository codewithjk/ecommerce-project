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
  var discount = document.getElementById("product-discount-input").value;
  var colors = document.querySelectorAll(".stock-of-color:enabled");
  var sizes = document.querySelectorAll(".stock-of-size:enabled");
  var color = [];
  var size = [];

  colors.forEach((element) => {
    let obj = { [element.name]: Number(element.value) };
    color.push(obj);
  });
  sizes.forEach((element) => {
    let obj = { [element.name]: Number(element.value) };
    size.push(obj);
  });

  console.log(productobj.description);
  const edit_button = document.getElementById("edit-product");

  edit_button.addEventListener("click", (event) => {
    event.preventDefault();
    const data = {
      id: productobj._id,
      title: document.getElementById("product-title-input").value,
      // image: document.getElementById("edit-category-img").src,
      description: document.getElementById("descriptionInput").value,
      category: document.getElementById("choices-category-input").value,
      price: document.getElementById("product-price-input").value,
      discount: discount,
      color: color,
      size: size,
    };

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
});
