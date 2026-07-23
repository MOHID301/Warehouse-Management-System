
const role = localStorage.getItem("role");

if(role !== "Admin"){
    window.location.href = "login.html";
}
const API_URL = "http://127.0.0.1:8000";
window.onload = loadDashboard;
async function loadDashboard() {

    try {

        const response =
        await fetch(`${API_URL}/dashboard`);

        const data =
        await response.json();

        document.getElementById("products").innerText =
        data.products;

        document.getElementById("warehouses").innerText =
        data.warehouses;

        document.getElementById("stock").innerText =
        data.stock;

        document.getElementById("orders").innerText =
        data.orders || 0;

    }
    catch(error){

        console.log(error);

    }

    loadRecentActivities();
}

async function loadRecentActivities(){

    try{

        const response =
        await fetch(`${API_URL}/recent-activities`);

        const data =
        await response.json();

        const tbody =
        document.getElementById("recent-body");

        tbody.innerHTML = "";

        data.forEach(log=>{

            tbody.innerHTML += `
            <tr>
    <td>${log.action_time}</td>
    <td>${log.action_type}</td>
    <td>${log.table_name}</td>
    <td>${log.description}</td>
</tr>
`;
        });

    }
    catch(error){

        console.log(error);

    }
}