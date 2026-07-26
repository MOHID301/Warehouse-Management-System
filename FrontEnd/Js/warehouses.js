// ==========================================================
// warehouses.js
// Full CRUD for the Warehouses table.
//
// Expected FastAPI routes:
//   GET    /warehouses
//   POST   /warehouses
//   PUT    /warehouses/{id}
//   DELETE /warehouses/{id}
// ==========================================================

const API_URL = "https://warehouse-management-system-production-eb5b.up.railway.app";

let warehouses = [];

const form = document.getElementById("warehouse-form");
const tableBody = document.getElementById("warehouse-table-body");
const idInput = document.getElementById("warehouse_id");
const nameInput = document.getElementById("warehouse_name");
const locationInput = document.getElementById("location");
const capacityInput = document.getElementById("capacity");
const submitBtn = document.getElementById("submit-btn");

window.onload = loadWarehouses;

async function loadWarehouses() {
  try {
    const res = await fetch(`${API_URL}/warehouses`);
    warehouses = await res.json();
    renderTable();
  } catch (err) {
    alert("Could not load warehouses. Is the API running?\n" + err.message);
  }
}

function renderTable() {
  tableBody.innerHTML = "";
  warehouses.forEach(w => {
    tableBody.innerHTML += `
      <tr>
        <td>${w.warehouse_id}</td>
        <td>${w.warehouse_name}</td>
        <td>${w.location ? w.location : ""}</td>
        <td>${w.capacity != null ? w.capacity : ""}</td>
        <td>
          <button onclick="editWarehouse(${w.warehouse_id})">Edit</button>
          <button onclick="deleteWarehouse(${w.warehouse_id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const warehouseData = {
    warehouse_name: nameInput.value,
    location: locationInput.value,
    capacity: capacityInput.value === "" ? null : parseInt(capacityInput.value)
  };

  try {
    if (idInput.value === "") {
      await fetch(`${API_URL}/warehouses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warehouseData)
      });
    } else {
      await fetch(`${API_URL}/warehouses/${idInput.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warehouseData)
      });
    }
    resetForm();
    loadWarehouses();
  } catch (err) {
    alert("Something went wrong while saving: " + err.message);
  }
});

function editWarehouse(id) {
  const w = warehouses.find(item => item.warehouse_id === id);
  if (!w) return;

  idInput.value = w.warehouse_id;
  nameInput.value = w.warehouse_name;
  locationInput.value = w.location ? w.location : "";
  capacityInput.value = w.capacity != null ? w.capacity : "";
  submitBtn.textContent = "Update Warehouse";
}

async function deleteWarehouse(id) {
  const sure = confirm("Delete this warehouse? This cannot be undone.");
  if (!sure) return;

  try {
    await fetch(`${API_URL}/warehouses/${id}`, { method: "DELETE" });
    loadWarehouses();
  } catch (err) {
    alert("Could not delete warehouse: " + err.message);
  }
}

function resetForm() {
  form.reset();
  idInput.value = "";
  submitBtn.textContent = "Add Warehouse";
}
