console.log("order details");

const selectElement = document.getElementById("delivered-status");
console.log(selectElement);
const responseModal = new bootstrap.Modal(
  document.getElementById("responseModal")
);

selectElement.addEventListener("change", function () {
  console.log("sdjflaks");
  const selectedOption = this.options[this.selectedIndex];
  const bgColor = selectedOption.classList.contains("bg-success-subtle")
    ? "bg-success-subtle"
    : "";

  this.classList.remove(
    "bg-success-subtle",
    "bg-danger-subtle",
    "bg-info-subtle",
    "bg-warning-subtle"
  ); // Remove all background classes
  if (bgColor) {
    this.classList.add(bgColor); // Add background class based on selected option
  }

  const selectedValue = selectedOption.value;
  const orderId = new URLSearchParams(window.location.search).get("orderId");

  fetch("/admin/order/update-status", {
    method: "patch",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: selectedValue, orderId: orderId }),
  })
    .then((response) => response.json())
    .then((data) => {
      const modalBody = document.querySelector(".modal-body");
      modalBody.textContent = data.message; // Assuming response contains a message
      responseModal.show();
    })
    .catch((error) => {
      console.log("made req");
      console.error("Error:", error);
    });
});
