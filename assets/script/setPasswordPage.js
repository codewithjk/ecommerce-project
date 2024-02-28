const form = document.getElementById("setPassword");
const password = document.getElementById("password");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const prePayload = new FormData(form);
  const payload = new URLSearchParams(prePayload);

  await fetch("/change-password", {
    method: "POST",
    body: payload,
    // contentType: "application/json; charset=utf-8",
    // dataType: "json",
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
        // window.location.href = "/products";
        console.log(window.location);
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});

document.addEventListener("click", (event) => {
  if (event.target.tagName === "INPUT") {
    var paragraph = document.querySelectorAll(".hideError");
    paragraph.forEach((p) => {
      p.innerHTML = "";
    });
  }
});
