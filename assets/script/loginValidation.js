// Function to validate email format
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");

// Function to validate form on submit
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    // Prevent form submission
    event.preventDefault();

    // Clear previous error messages

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

    // If everything is valid, submit the form
    this.submit();
  });

document.addEventListener("click", (event) => {
  if (event.target.tagName === "INPUT") {
    // var paragraph = document.querySelector(".Error");
    if (emailError) {
      emailError.classList.add("d-none");
    }
    var paragraph = document.querySelector(".hideError");
    if (paragraph) {
      paragraph.classList.add("d-none");
    }
  }
});
