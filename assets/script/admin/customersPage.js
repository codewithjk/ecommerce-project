// block
const modal = document.getElementById("deleteRecordModal");

// Event listener for modal show event
modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const user_id = button.getAttribute("data-custom-data");

  const block_button = document.getElementById("block-user");

  block_button.addEventListener("click", (event) => {
    event.preventDefault();

    fetch("/admin/block-user", {
      method: "PATCH",
      body: new URLSearchParams({ id: user_id }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
        } else {
          window.location.href = data.redirect;
        }
      });
  });
});

// unblock
const modal2 = document.getElementById("unblockModal");

// Event listener for modal show event
modal2.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const user_id = button.getAttribute("data-custom-data");

  const unblock_button = document.getElementById("unblock-user");

  unblock_button.addEventListener("click", (event) => {
    event.preventDefault();

    fetch("/admin/unblock-user", {
      method: "PATCH",
      body: new URLSearchParams({ id: user_id }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
        } else {
          window.location.href = data.redirect;
        }
      });
  });
});
