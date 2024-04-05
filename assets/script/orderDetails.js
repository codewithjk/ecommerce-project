//cancel order
const cancel_order_modal = document.getElementById("cancelOrderModal");
cancel_order_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const orderId = button.getAttribute("data-custom-data");

  const cancelOrderButton = document.getElementById("cancel-order-button");
  cancelOrderButton.disabled = true;
  const reason = document.getElementById("cancel-reason");
  reason.addEventListener("input", () => {
    if (reason.value.trim() !== "") {
      cancelOrderButton.disabled = false;
    } else {
      cancelOrderButton.disabled = true;
    }
  });

  cancelOrderButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const requestBody = {
      id: orderId,
      reason: reason.value.trim(),
    };
    try {
      const response = await fetch(`/cancel-order?orderId=${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
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
    }
  });
});

//return order
const return_product_modal = document.getElementById("returnProductModal");
return_product_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const returnObj = button.getAttribute("data-custom-data");
  const returnData = JSON.parse(returnObj);

  const orderId = returnData.orderId;
  const productId = returnData.product._id;

  const returnProductButton = document.getElementById("return-product-button");
  returnProductButton.disabled = true;
  const reason = document.getElementById("return-reason");
  reason.addEventListener("input", () => {
    if (reason.value.trim() !== "") {
      returnProductButton.disabled = false;
    } else {
      returnProductButton.disabled = true;
    }
  });

  returnProductButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const requestBody = {
      id: productId,
      reason: reason.value.trim(),
    };
    try {
      const response = await fetch(
        `/return-product?productId=${productId}&orderId=${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      } else {
        const data = await response.json();
        document.getElementById("product-return-succcess").innerHTML =
          data.message;
        const modal = bootstrap.Modal.getInstance(return_product_modal);
        modal.hide();
        location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  });
});
