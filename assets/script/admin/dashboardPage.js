const totalOrders = document.getElementById("totalOrders");
const toatalEarnings = document.getElementById("totalEarnings");
const totalRefunds = document.getElementById("totalRefunds");
const mainEarnings = document.getElementById("main-total-earnings");
//////
async function getInitialData() {
  const response = await fetch("/admin/get-weekly-orders");
  const responseData = await response.json();

  return responseData.data;
}

window.onload = async function () {
  try {
    const initialData = await getInitialData();

    let ordersData = initialData.orders;
    let earningsData = initialData.earnings;
    let refundsData = initialData.refunds;
    let totalOrder = ordersData.reduce((a, b) => a + b, 0);
    let totalEarning = earningsData.reduce((a, b) => a + b, 0);
    let totalRefund = refundsData.reduce((a, b) => a + b, 0);

    totalOrders.innerHTML = totalOrder;
    toatalEarnings.innerHTML = totalEarning;
    totalRefunds.innerHTML = totalRefund;

    mainEarnings.innerHTML = totalEarning;
    createApexChart(timePeriods, ordersData, earningsData, refundsData);
  } catch (error) {
    console.error(error);
  }
};

var linechartDatalabelColors = getChartColorsArray("line_chart_datalabel");
const timePeriods = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

let main_chart;
function createApexChart(categories, orders, earnings, refunds) {
  const options = {
    chart: {
      height: 405,
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.2,
      },
      borderColor: "#f1f1f1",
    },
    series: [
      {
        name: "Orders",
        data: orders,
      },
      {
        name: "Refund",
        data: refunds,
      },
      {
        name: "Earnings",
        data: earnings,
      },
    ],
    colors: linechartDatalabelColors,
    markers: {
      size: 0,
      colors: "#ffffff",
      strokeColors: linechartDatalabelColors,
      strokeWidth: 1,
      strokeOpacity: 0.9,
      fillOpacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: "smooth",
    },

    xaxis: {
      categories: categories,
      title: {
        text: "Time Period",
      },
    },
    yaxis: {
      title: {
        text: "Values",
      },
    },
  };

  main_chart = new ApexCharts(
    document.querySelector("#line_chart_datalabel"),
    options
  );
  main_chart.render();
}

// onclick for week month yaear
async function changeAxis(axisType) {
  let categories;
  let orders;
  let earnings;
  let refunds;

  if (axisType === "days") {
    const response = await fetch("/admin/get-weekly-orders");
    const responseData = await response.json();

    categories = timePeriods;
    orders = responseData.data.orders;
    earnings = responseData.data.earnings;
    refunds = responseData.data.refunds;
  } else if (axisType === "weeks") {
    const response = await fetch("/admin/get-monthly-orders");
    const responseData = await response.json();

    categories = ["Week 1", "Week 2", "Week 3", "Week 4"];
    orders = responseData.data.orders;
    earnings = responseData.data.earnings;
    refunds = responseData.data.refunds;

    ///
    let totalOrder = orders.reduce((a, b) => a + b, 0);
    let totalEarning = earnings.reduce((a, b) => a + b, 0);
    let totalRefund = refunds.reduce((a, b) => a + b, 0);

    totalOrders.innerHTML = totalOrder;
    toatalEarnings.innerHTML = totalEarning;
    totalRefunds.innerHTML = totalRefund;
    ///
  } else if (axisType === "months") {
    const response = await fetch("/admin/get-yearly-orders");
    const responseData = await response.json();

    categories = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    orders = responseData.data.orders;
    earnings = responseData.data.earnings;
    refunds = responseData.data.refunds;
    ////
    let totalOrder = orders.reduce((a, b) => a + b, 0);
    let totalEarning = earnings.reduce((a, b) => a + b, 0);
    let totalRefund = refunds.reduce((a, b) => a + b, 0);

    totalOrders.innerHTML = totalOrder;
    toatalEarnings.innerHTML = totalEarning;
    totalRefunds.innerHTML = totalRefund;
    ///
  }
  main_chart.updateOptions({
    xaxis: {
      categories: categories,
      title: {
        text: `Time Period (${axisType})`,
      },
    },
    series: [
      {
        name: "Orders",
        data: orders,
      },
      {
        name: "Refunds",
        data: refunds,
      },
      {
        name: "Earnings",
        data: earnings,
      },
    ],
  });
}
