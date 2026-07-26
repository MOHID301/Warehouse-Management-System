const API_URL = "https://warehouse-management-system-production-eb5b.up.railway.app";

window.onload = async () => {

    await loadCards();

    await loadChart();

    await loadProductsChart();

    await loadSummary();

};

async function loadCards(){

    const response =
        await fetch(`${API_URL}/reports`);

    const data =
        await response.json();

    document.getElementById("dailyOrders").innerText =
        data.daily_orders;

    document.getElementById("weeklyOrders").innerText =
        data.weekly_orders;

    document.getElementById("monthlyOrders").innerText =
        data.monthly_orders;

    document.getElementById("yearlyOrders").innerText =
        data.yearly_orders;
}

async function loadChart(){

    const response =
        await fetch(`${API_URL}/reports/monthly-orders`);

    const data =
        await response.json();

    const labels =
        data.map(item => item.month);

    const values =
        data.map(item => item.total);

    new Chart(

        document.getElementById("monthlyChart"),

        {
            type:"bar",

            data:{

                labels:labels,

                datasets:[{
                    label:"Orders",
                    data:values
                }]
            }
        }
    );
}

async function loadProductsChart(){

    const response =
        await fetch(
            `${API_URL}/reports/product-categories`
        );

    const data =
        await response.json();

    const labels =
        data.map(item => item.category);

    const values =
        data.map(item => item.total);

    new Chart(

        document.getElementById(
            "productsChart"
        ),

        {
            type:"pie",

            data:{
                labels:labels,

                datasets:[{
                    data:values
                }]
            }
        }
    );
}

