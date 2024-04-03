// add new category
var createCategoryForm = document.querySelector(".createCategory-form");

createCategoryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  var inputTitle = document.getElementById("categoryTitle").value.trim();
  var categoryImg = document.getElementById("category-img").src;
  var categoryDesc = document.getElementById("descriptionInput").value.trim();

  if (!inputTitle || !categoryDesc) {
    document.querySelector(".formError").innerHTML =
      "Please fill all the fields ";
  } else if (!categoryImg.startsWith("data:image")) {
    document.getElementById("imageError").innerHTML =
      "select a valid image file";
  } else if (categoryImg.size === 0 || categoryImg.size > 5 * 1024 * 1024) {
    document.getElementById("addImageError").innerHTML =
      "Please select an image file between 0 bytes and 5 MB.";
    return;
  } else {
    let data = {
      title: inputTitle,
      image: categoryImg,
      description: categoryDesc,
    };
    fetch("/admin/add-category", {
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
          console.log("category added");
          document.querySelector(".formSuccess").innerHTML = data.message;
          document.location.href = data.redirect;
        } else if (data.error) {
          document.querySelector(".formSuccess").innerHTML = data.error;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// delete category
const delete_modal = document.getElementById("deleteModal");
delete_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const category_id = button.getAttribute("data-custom-data");

  const delete_button = document.getElementById("remove-category");

  delete_button.addEventListener("click", (event) => {
    event.preventDefault();

    fetch(`/admin/remove-category/?id=${category_id}`, {
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

//edit category
const edit_modal = document.getElementById("editModal");
edit_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const category = button.getAttribute("data-custom-data");
  const categoryobj = JSON.parse(category);
  console.log(category);

  document.getElementById("editcategoryTitle").value = categoryobj.title;
  document.getElementById("edit-category-img").src = categoryobj.image;
  document.getElementById("edit-descriptionInput").value =
    categoryobj.description;

  console.log(categoryobj.title);

  const edit_button = document.getElementById("edit-category");

  edit_button.addEventListener("click", (event) => {
    event.preventDefault();

    let titleInput = document.getElementById("editcategoryTitle").value.trim();
    let imageInput = document.getElementById("edit-category-img").src;
    let descriptionInput = document
      .getElementById("edit-descriptionInput")
      .value.trim();
    const data = {
      id: categoryobj._id,
      title: titleInput,
      image: imageInput,
      description: descriptionInput,
    };

    fetch(`/admin/edit-category`, {
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
        if (data.message) {
          // document.getElementById("yes-delete").innerHTML = data.message;
          // alert(data.message);
          window.location.href = data.redirect;
          // document.getElementById("no-delete").innerHTML = data.error;
        } else if (data.error) {
          document.getElementById("edit-error").innerHTML = data.error;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

// ADD category image
document
  .querySelector("#category-image-input")
  .addEventListener("change", function () {
    var preview = document.querySelector("#category-img");
    var file = document.querySelector("#category-image-input").files[0];
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        preview.src = reader.result;
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  });

// EDIT category image
document
  .querySelector("#edit-category-image-input")
  .addEventListener("change", function () {
    var preview = document.querySelector("#edit-category-img");
    var file = document.querySelector("#edit-category-image-input").files[0];
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        preview.src = reader.result;
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  });

function clearVal() {
  document.getElementById("categoryTitle").value = "";
  document.getElementById("category-img").src = "";
  document.getElementById("slugInput").value = "";
  document.getElementById("descriptionInput").value = "";
  document.getElementById("category-image-input").value = "";
}

/////////////////////////////////////////////////////
