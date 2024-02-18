const form = document.getElementById("forgotForm");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");

// Function to validate email format
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isValidEmail(email.value.trim()) || email.value === "") {
    emailError.classList.remove("d-none");
    return;
  } else {
    const prePayload = new FormData(form);
    const payload = new URLSearchParams(prePayload);
    fetch("/verify-email", {
      method: "POST",
      body: payload,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.error) {
          let paragraph = document.querySelector(".hideError");
          paragraph.innerHTML = data.error;
        } else {
          window.location.href = data.redirect;
          // window.location.href = "/verify-confirmation-code";
        }
      });
  }
});
