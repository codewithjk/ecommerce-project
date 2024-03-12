// const urlParams = new URLSearchParams(window.location.search);
// const userId = urlParams.get("uid");
// console.log(userId);

// this is commented because i use verifyToken middleware for all request made from user side so that middleware set user object to request
//so no need of sending id from here

const tabs = document.getElementById("menu-tabs");

//edit profile modal
const edit_profile_modal = document.getElementById("editProfileModal");
edit_profile_modal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;

  const user = button.getAttribute("data-custom-data");
  const userobj = JSON.parse(user);
  console.log(userobj);

  document.getElementById("editprofile-firstName").value = userobj.firstName;
  document.getElementById("editprofile-lastName").value = userobj.lastName;
  document.getElementById("editprofile-phone").value = userobj.phoneNumber;

  const form = document.getElementById("editProfile-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let filled = true;

    let inputElements = form.querySelectorAll("input:enabled");
    inputElements.forEach((input) => {
      if (input.value == " " || input.value == "") {
        document.getElementById("fillerrror-profile").innerText =
          "Please fill all the fields";
        filled = false;
      }
    });
    if (filled) {
      const data = {
        firstName: document.getElementById("editprofile-firstName").value,
        lastName: document.getElementById("editprofile-lastName").value,
        phoneNumber: document.getElementById("editprofile-phone").value,
      };

      const response = await fetch(`/edit-profile`, {
        method: "patch",
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
});
