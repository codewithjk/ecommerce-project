console.log("payment page");

const cod_btn = document.getElementById("cod-payment");
cod_btn.addEventListener("click", async (event) => {
  event.preventDefault();
  const addressId = cod_btn.getAttribute("data-custom-data");
  console.log(addressId);
  const response = await fetch(`/place-order-cod?addressId=${addressId}`);
  if (response) {
    const responseData = await response.json();
    if (responseData.message) {
      const modal = document.getElementById("codModal");
      document.querySelector(".modal-message").innerHTML = responseData.message;
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
    }
  }
});

function closeModal(modal) {
  modal.classList.remove("show");
  modal.style.display = "none";
  modal.removeAttribute("aria-modal");
}
