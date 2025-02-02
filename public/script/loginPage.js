// Function to validate email format
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");

// Function to validate form on submit
let form = document.getElementById("loginForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
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

  fetch("/login", {
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
      } else if (data.blocked) {
        window.location.href = "/blocked-message";
        // alert("you are blocked by admin");
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
    if (emailError) {
      emailError.classList.add("d-none");
    }
    var paragraph = document.querySelectorAll(".hideError");
    paragraph.forEach((p) => {
      p.innerHTML = "";
    });
  }
});

// google auth

const google = document.getElementById("google");
google.addEventListener("click", () => {
  console.log("google");
  fetch("/auth/google")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      window.location.href = data.redirect;
    })
    .catch((error) => {
      error;
    });
});

const facebook = document.getElementById("facebook");
facebook.addEventListener("click", () => {
  console.log("facebook");
  fetch("/auth/facebook")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      window.location.href = data.redirect;
    });
});
