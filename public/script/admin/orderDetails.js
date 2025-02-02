const selectElement = document.getElementById("delivered-status");

const responseModal = new bootstrap.Modal(
  document.getElementById("responseModal")
);
if (selectElement !== null) {
  selectElement.addEventListener("change", function () {
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
        console.error("Error:", error);
      });
  });
}

const refund_order_modal = document.getElementById("refundModal");
refund_order_modal.addEventListener(
  "show.bs.modal",
  function (event) {
    const button = event.relatedTarget;

    const orderId = button.getAttribute("data-custom-data");
    const cancelOrderButton = document.getElementById("refund-button");
    cancelOrderButton.addEventListener(
      "click",
      async (event) => {
        event.preventDefault();
        try {
          const response = await fetch(
            `/admin/refund-order?orderId=${orderId}`,
            {
              method: "patch",
            }
          );
          if (!response.ok) {
            throw new Error("Something went wrong. Please try again.");
          } else {
            const data = await response.json();
            document.getElementById("order-cancel-succcess").innerHTML =
              data.message;
            const modal = bootstrap.Modal.getInstance(refund_order_modal);
            modal.hide();
            location.reload();
          }
        } catch (error) {
          console.log(error);
        }
      },
      { once: true }
    );
  },
  { once: true }
);

// Initialize Bootstrap popovers
var popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
);
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});
