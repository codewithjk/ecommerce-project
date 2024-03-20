console.log("register");

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
