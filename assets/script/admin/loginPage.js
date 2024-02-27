const form = document.getElementById("loginForm");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validate email
  if (!isValidEmail(email)) {
    emailError.classList.remove("d-none");
    return;
  }

  // Validate password length
  if (password.length < 8) {
    passwordError.classList.remove("d-none");
    return;
  }

  const prePayload = new FormData(form);
  const payload = new URLSearchParams(prePayload);

  console.log([...payload]);
  fetch("/admin/login", {
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
      if (data.emailError) {
        let paragraph = document.querySelector(".emailError");
        paragraph.innerHTML = data.emailError;
      } else if (data.passwordError) {
        let paragraph = document.querySelector(".passwordError");
        paragraph.innerHTML = data.passwordError;
      } else {
        window.location.href = data.redirect;
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});

document.addEventListener("click", (event) => {
  if (event.target.tagName === "INPUT") {
    // var paragraph = document.querySelector(".Error");
    if (emailError) {
      emailError.classList.add("d-none");
    }
    if (passwordError) {
      passwordError.classList.add("d-none");
    }
    var paragraph = document.querySelectorAll(".hideError");
    paragraph.forEach((p) => {
      p.innerHTML = "";
    });
  }
});
