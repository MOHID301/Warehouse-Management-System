const role = localStorage.getItem("role");

if(role !== "Staff"){
    window.location.href = "login.html";
}

const API_URL = "https://warehouse-management-system-production-eb5b.up.railway.app";

window.onload = async function() {
   await loadCounts();
    await loadRecentActivities();
}

async function loadCounts() {
  try {
    let res = await fetch(`${API_URL}/products`);
    let data = await res.json();
    document.getElementById("count-products").textContent = data.length;

    res = await fetch(`${API_URL}/warehouses`);
    data = await res.json();
    document.getElementById("count-warehouses").textContent = data.length;

    res = await fetch(`${API_URL}/vendors`);
    data = await res.json();
    document.getElementById("count-vendors").textContent = data.length;

    res = await fetch(`${API_URL}/purchase-orders`);
    data = await res.json();
    document.getElementById("count-orders").textContent = data.length;

  } catch (err) {
    alert("Could not load dashboard data. Is the API running?\n" + err.message);
  }
}

async function loadRecentActivities() {

    try {

        const response =
            await fetch(`${API_URL}/recent-activities`);

        const logs = await response.json();

        const body =
            document.getElementById("recent-activity-body");

        body.innerHTML = "";

        logs.forEach(log => {

            body.innerHTML += `
                <tr>
                    <td>${log.action_time}</td>
                    <td>${log.action_type}</td>
                    <td>${log.table_name}</td>
                    <td>${log.description}</td>
                </tr>
            `;
        });

    } catch(err) {

        console.error(err);

    }
}