console.log("payment page");

const cod_btn = document.getElementById("cod-payment");
cod_btn.addEventListener("click", async (event) => {
  event.preventDefault();
  const addressId = cod_btn.getAttribute("data-custom-data");
  console.log(addressId);
  try {
    const response = await fetch(`/place-order-cod?addressId=${addressId}`);
    if (response) {
      console.log(response);
      const responseData = await response.json();
      console.log("response ===", responseData);
      if (responseData.message) {
        const modal = document.getElementById("codModal");
        document.querySelector(".modal-message").innerHTML =
          responseData.message;
        modal.classList.add("show");
        modal.style.display = "block";
        modal.setAttribute("aria-modal", "true");

        //close modal
        const closeButton = modal.querySelector("#btn-close");
        closeButton.addEventListener("click", () => {
          closeModal(modal);
        });
        modal.addEventListener("click", (event) => {
          if (event.target === modal) {
            closeModal(modal);
          }
        });
      } else {
        console.log(responseData);
        window.location.href = responseData.redirectURL;
      }
    }
  } catch (error) {
    console.log(error);
  }
});

function closeModal(modal) {
  modal.classList.remove("show");
  modal.style.display = "none";
  modal.removeAttribute("aria-modal");
}
