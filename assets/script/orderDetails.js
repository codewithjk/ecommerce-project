console.log("order details ");

const cancel_order_modal = document.getElementById("cancelOrderModal");
cancel_order_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;
  console.log("adsfkdaakldsfaldkadskll");

  const orderId = button.getAttribute("data-custom-data");
  console.log(orderId);
  const cancelOrderButton = document.getElementById("cancel-order-button");
  cancelOrderButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/cancel-order?orderId=${orderId}`, {
        method: "delete",
      });
      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      } else {
        const data = await response.json();
        document.getElementById("order-cancel-succcess").innerHTML =
          data.message;
        const modal = bootstrap.Modal.getInstance(cancel_order_modal);
        modal.hide();
        location.reload();
      }
    } catch (error) {
      console.log(error);
      // if (error) {
      //   document.getElementById("cart-delete-error").innerHTML =
      //     "something went wrong try again!";
      // }
    }
  });
});
