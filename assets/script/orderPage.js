console.log("orderPage is loaded");

const orderContent = document.getElementById("orderContent");
orderContent.innerHTML = "";
const order_tab = document.getElementById("orders"); //here id of triggering element (a tag)
order_tab.addEventListener("shown.bs.tab", async function (event) {
  // event.preventDefault();
  const orderContent = document.getElementById("orderContent");
  orderContent.innerHTML = "";
  console.log("orders clicked");

  const response = await fetch(`/orders`);
  const data = await response.json();
  console.log(data.orders);
  data.orders.forEach((order) => {
    let productNamesHTML = "";
    order.productNames.forEach((product) => {
      productNamesHTML += `<h6 class="fs-15 mb-1">✹ ${product}</h6>`;
    });
    const dateString = new Date(order.orderDate).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
  <td>
    <p >
      ${productNamesHTML}
    </p>
    
  </td>
  <td><span class="text-muted">${dateString}</span></td>
  <td class="fw-medium">₹ ${order.totalAmount}</td>
  <td>
    <span class="badge bg-info-subtle text-info"
      >${order.status}</span
    >
  </td>
  <td>
    <a
      href="/order-details?orderId=${order.orderId}"
     
      class="btn btn-info btn-sm"
      >View</a
    >
  </td>`;
    orderContent.appendChild(tableRow);
  });

  try {
  } catch (error) {
    console.log(error);
  }
});
