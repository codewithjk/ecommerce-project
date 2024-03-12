console.log("wallet page");

const wallet_tab = document.getElementById("wallet"); //here id of triggering element (a tag)
wallet_tab.addEventListener("shown.bs.tab", async function (event) {
  try {
    // event.preventDefault();
    console.log("wallet clicked");

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
    console.log(data.wallet);
    const historys = data.wallet.history;
    historys.forEach((history) => {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `<td>${history.name}</td>
      <td>${history.description}</td>
      <td>${history.amount} </td>`;
      walletContent.appendChild(tableRow);
    });
  } catch (error) {
    console.log(error);
  }
}
