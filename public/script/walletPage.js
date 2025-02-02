const wallet_tab = document.getElementById("wallet"); //here id of triggering element (a tag)
wallet_tab.addEventListener("shown.bs.tab", async function (event) {
  try {
    const walletContent = document.getElementById("walletContent");
    await updatewalletContent(walletContent);
  } catch (error) {
    console.log(error);
  }
});

async function updatewalletContent(walletContent) {
  walletContent.innerHTML = "";

  try {
    const response = await fetch("/get-wallet");
    const data = await response.json();

    const historys = data.wallet.history;
    historys.forEach((history) => {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `<td>${history.name}</td>
      <td >${history.description}</td>
      <td >${history.amount} </td>`;
      walletContent.appendChild(tableRow);
    });
  } catch (error) {
    console.log(error);
  }
}

const addMoneyBtn = document.getElementById("addMoneyBtn");
// const addressId = new URLSearchParams(window.location.search).get("addressId");
addMoneyBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const amount = document.getElementById("amountInput").value;

  try {
    const response = await fetch(`/add-fund?amount=${amount}`);
    if (!response.ok) {
      alert("somthing gone wrong");
    } else {
      const res = await response.json();

      var options = {
        key: "" + res.key_id + "",
        amount: "" + res.amount + "",
        currency: "INR",
        name: "" + res.title + "",
        description: "" + res.description + "",
        image: "https://dummyimage.com/600x400/000/fff",
        order_id: "" + res.order_id + "",
        handler: function (response) {
          // alert("Payment Succeeded");
          fetch(`/confirm-add-fund?amount=${res.amount}`)
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
            })
            .then((data) => {
              window.location.reload();
            });
        },
        prefill: {
          contact: "" + res.contact + "",
          name: "" + res.name + "",
          email: "" + res.email + "",
        },
        notes: {
          description: "" + res.description + "",
        },
        theme: {
          color: "#2300a3",
        },
      };
      var razorpayObject = new Razorpay(options);
      razorpayObject.on("payment.failed", function (response) {
        alert("Payment Failed");
      });
      razorpayObject.open();
    }
  } catch (error) {
    console.log(error);
  }
});
