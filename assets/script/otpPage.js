const inputs = document.querySelectorAll(".otp-field > input");
const button = document.querySelector(".btn");

let timerOn = true;

window.addEventListener("load", () => inputs[0].focus());
button.setAttribute("disabled", "disabled");

inputs[0].addEventListener("paste", function (event) {
  event.preventDefault();

  const pastedValue = (event.clipboardData || window.clipboardData).getData(
    "text"
  );
  const otpLength = inputs.length;

  for (let i = 0; i < otpLength; i++) {
    if (i < pastedValue.length) {
      inputs[i].value = pastedValue[i];
      inputs[i].removeAttribute("disabled");
      inputs[i].focus;
    } else {
      inputs[i].value = ""; // Clear any remaining inputs
      inputs[i].focus;
    }
  }
});

inputs.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    const currentInput = input;
    const nextInput = input.nextElementSibling;
    const prevInput = input.previousElementSibling;

    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }

    if (
      nextInput &&
      nextInput.hasAttribute("disabled") &&
      currentInput.value !== ""
    ) {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    if (e.key === "Backspace") {
      inputs.forEach((input, index2) => {
        if (index1 <= index2 && prevInput) {
          input.setAttribute("disabled", true);
          input.value = "";
          prevInput.focus();
        }
      });
    }

    button.classList.remove("active");
    button.setAttribute("disabled", "disabled");

    const inputsNo = inputs.length;
    if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== "") {
      button.classList.add("active");
      button.removeAttribute("disabled");

      return;
    }
  });
});

//Timer

if (!timerOn) {
  // Do validate stuff here
}

function timer(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;

  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  document.getElementById("timer").innerHTML = m + ":" + s;
  remaining -= 1;

  if (remaining >= 0 && timerOn) {
    setTimeout(function () {
      timer(remaining);
    }, 1000);
    return;
  }

  if (!timerOn) {
    // Do validate stuff here
    return;
  }

  button.setAttribute("disabled", "disabled");
  document.getElementById("timer").classList.add("text-danger");
}

timer(120);

const form = document.getElementById("otpForm");
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  // Create a FormData object to collect form data
  const prePayload = new FormData(form);
  const payload = new URLSearchParams(prePayload);
  console.log([...payload]);

  // Make an AJAX request to the server
  await fetch("/user/otp-verification", {
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
        let input_fields = document.querySelectorAll(".otp");
        input_fields.forEach((input) => {
          input.value = "";
        });
        button.classList.remove("active");
        button.setAttribute("disabled", "disabled");
      } else {
        let success_message = document.querySelector(".hideSuccess");
        success_message.innerHTML = data.success;

        window.location.href = data.redirect;
        console.log(window.location);
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
