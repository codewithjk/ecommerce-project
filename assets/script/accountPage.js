const tabs = document.getElementById("menu-tabs");

//edit profile modal
const edit_profile_modal = document.getElementById("editProfileModal");
edit_profile_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const user = button.getAttribute("data-custom-data");
  const userobj = JSON.parse(user);

  document.getElementById("editprofile-firstName").value = userobj.firstName;
  document.getElementById("editprofile-lastName").value = userobj.lastName;
  document.getElementById("editprofile-phone").value = userobj.phoneNumber;

  const form = document.getElementById("editProfile-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let filled = true;

    // Clear previous error messages
    document.getElementById("fillerrror-profile").innerText = "";
    document.getElementById("success-profile").innerHTML = "";

    let inputElements = form.querySelectorAll("input:enabled");
    inputElements.forEach((input) => {
      if (input.value.trim() == "") {
        document.getElementById("fillerrror-profile").innerText =
          "Please fill all the fields";
        filled = false;
      }
    });

    if (filled) {
      const firstName = document
        .getElementById("editprofile-firstName")
        .value.trim();
      const lastName = document
        .getElementById("editprofile-lastName")
        .value.trim();
      const mobileNumber = document
        .getElementById("editprofile-phone")
        .value.trim();

      // Validate first name and last name
      if (!isValidName(firstName) || !isValidName(lastName)) {
        document.getElementById("fillerrror-profile").innerText =
          "First name and last name should not contain numbers";
        return;
      }

      // Validate mobile number
      if (!isValidMobileNumber(mobileNumber)) {
        document.getElementById("fillerrror-profile").innerText =
          "Please enter a valid Indian mobile number";
        return;
      }

      const data = {
        firstName,
        lastName,
        mobileNumber,
      };

      const response = await fetch(`/edit-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData) {
        document.getElementById("success-profile").innerHTML =
          responseData.message;
        // Close modal
        const modal = bootstrap.Modal.getInstance(edit_profile_modal);
        modal.hide();
        window.location.reload();
      }
    }
  });

  // Helper function to validate Indian mobile number
  function isValidMobileNumber(mobileNumber) {
    const MobileNumberRegex = /^(?!0+$)(?!([0-9])\1+$)[6-9]\d{9}$/;
    return MobileNumberRegex.test(mobileNumber);
  }

  // Helper function to validate first name and last name
  function isValidName(name) {
    const nameRegex = /^[^\d\s]+$/; // Does not contain numbers or spaces
    return nameRegex.test(name);
  }
});

const changePasswordForm = document.getElementById("changepasswordForm");
changePasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const oldPassword = document.getElementById("oldpasswordInput").value.trim();
  const newPassword = document.getElementById("newpasswordInput").value.trim();
  const confirmPassword = document
    .getElementById("confirmpasswordInput")
    .value.trim();

  let valid = true;
  if (oldPassword == "" || newPassword == "" || confirmPassword == "") {
    document.getElementById("password-error").innerHTML = "fill all fields";
    valid = false;
    return;
  }
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordPattern.test(newPassword)) {
    const errorMessage =
      "Password must contain at least 8 characters, including one letter, one number, and one special character (@$!%*?&)";
    document.getElementById("password-error").innerHTML = errorMessage;
    valid = false;
    return;
  }
  if (newPassword !== confirmPassword) {
    document.getElementById("password-error").innerHTML =
      "confirm password not matching";
    valid = false;
    return;
  }
  if (valid) {
    const response = await fetch("/update-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });
    if (response.ok) {
      const responseData = await response.json();
      if (responseData.error) {
        document.getElementById("password-error").innerHTML =
          responseData.error;
      } else {
        document.getElementById("password-success").innerHTML =
          responseData.success;
        window.location.reload();
      }
    }
  }
});

function removeError(id) {
  document.getElementById(id).innerHTML = "";
}
