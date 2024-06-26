const form = document.getElementById("forgotForm");
const email = document.getElementById("email");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const prePayload = new FormData(form);
  const payload = new URLSearchParams(prePayload);

  await fetch("/otp-verification", {
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
      if (data.error) {
        let paragraph = document.querySelector(".hideError");
        paragraph.innerHTML = "code is already used";
      } else {
        window.location.href = "/set-new-password";
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});
