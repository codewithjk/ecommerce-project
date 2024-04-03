console.log("register");

function emailValidation() {
  const emailInput = document.getElementById("useremail");
  const email = emailInput.value.trim();

  const emailPattern =
    /^[^\s@]+@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|mail|yandex|zoho)\.(com|in|org|net|edu|gov|mil|biz|info|name|coop|aero|eu|int|pro|museum|arpa|[a-z]{2})$/;

  if (!emailPattern.test(email)) {
    errorMessage.innerHTML = "please Enter a valid Email address";
  } else {
    errorMessage.innerHTML = "";
  }
}

function nameValidation() {
  const firstNameInput = document.getElementById("username");
  const firstname = firstNameInput.value.trim();

  if (firstname == "") {
    firstNameError.innerHTML = "Please enter First Name.";
  }

  if (!/^[a-zA-Z]+$/.test(firstname)) {
    firstNameError.innerHTML = "First name can only contain letters.";
  } else {
    firstNameError.innerHTML = "";
  }
}

let form = document.getElementById("register");
let submit = document.getElementById("submit");
// submit.setAttribute("disabled", "disabled");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let inputElements = document.querySelectorAll("input");
  inputElements.forEach((input) => {
    if (input.value == " ") {
      console.log(input);
    }
  });
  const prePayload = new FormData(form);
  const payload = new URLSearchParams(prePayload);
  const queryParams = new URLSearchParams(window.location.search);
  const referralId = queryParams.get("referralId");

  console.log([...payload]);
  await fetch(`/register?referralId=${referralId}`, {
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
        console.log(data);
        window.location.href = data.redirect;
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});

// **** show error and remove error ****

document.addEventListener("click", (event) => {
  if (event.target.tagName === "INPUT") {
    var paragraph = document.querySelector(".hideError");
    if (paragraph) {
      paragraph.innerHTML = "";
    }
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
