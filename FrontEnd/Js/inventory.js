// ==========================================================
// inventory.js
// Full CRUD for the Inventory table. Also loads Warehouses
// and Products first, to fill the two dropdowns and to show
// names (instead of raw IDs) in the table.
//
// Expected FastAPI routes:
//   GET    /inventory
//   POST   /inventory
//   PUT    /inventory/{id}
//   DELETE /inventory/{id}
//   GET    /warehouses
//   GET    /products
// ==========================================================

const API_URL = "http://127.0.0.1:8000";

let inventoryList = [];
let warehouses = [];
let products = [];

const form = document.getElementById("inventory-form");
const tableBody = document.getElementById("inventory-table-body");
const idInput = document.getElementById("inventory_id");
const warehouseSelect = document.getElementById("warehouse_id");
const productSelect = document.getElementById("product_id");
const quantityInput = document.getElementById("quantity");
const submitBtn = document.getElementById("submit-btn");

window.onload = init;

async function init() {
  await loadDropdowns();
  await loadInventory();
}

// ---------- load Warehouses + Products to fill the dropdowns ----------
async function loadDropdowns() {
  try {
    let res = await fetch(`${API_URL}/warehouses`);
    warehouses = await res.json();
    warehouses.forEach(w => {
      warehouseSelect.innerHTML += `<option value="${w.warehouse_id}">${w.warehouse_name}</option>`;
    });

    res = await fetch(`${API_URL}/products`);
    products = await res.json();
    products.forEach(p => {
      productSelect.innerHTML += `<option value="${p.product_id}">${p.product_name}</option>`;
    });
  } catch (err) {
    alert("Could not load warehouses/products: " + err.message);
  }
}

function warehouseName(id) {
  const w = warehouses.find(item => item.warehouse_id === id);
  return w ? w.warehouse_name : "Unknown";
}

function productName(id) {
  const p = products.find(item => item.product_id === id);
  return p ? p.product_name : "Unknown";
}

// ---------- READ ----------
async function loadInventory() {
  try {
    const res = await fetch(`${API_URL}/inventory`);
    inventoryList = await res.json();
    renderTable();
  } catch (err) {
    alert("Could not load inventory. Is the API running?\n" + err.message);
  }
}

function renderTable() {
  tableBody.innerHTML = "";
  inventoryList.forEach(i => {
    tableBody.innerHTML += `
      <tr>
        <td>${i.inventory_id}</td>
        <td>${productName(i.product_id)}</td>
        <td>${warehouseName(i.warehouse_id)}</td>
        <td>${i.quantity}</td>
        <td>
          <button onclick="editEntry(${i.inventory_id})">Edit</button>
          <button onclick="deleteEntry(${i.inventory_id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ---------- CREATE + UPDATE ----------
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const entryData = {
    warehouse_id: parseInt(warehouseSelect.value),
    product_id: parseInt(productSelect.value),
    quantity: parseInt(quantityInput.value)
  };

  try {
    if (idInput.value === "") {
      await fetch(`${API_URL}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryData)
      });
    } else {
      await fetch(`${API_URL}/inventory/${idInput.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryData)
      });
    }
    resetForm();
    loadInventory();
  } catch (err) {
    alert("Something went wrong while saving: " + err.message);
  }
});

function editEntry(id) {
  const i = inventoryList.find(item => item.inventory_id === id);
  if (!i) return;

  idInput.value = i.inventory_id;
  warehouseSelect.value = i.warehouse_id;
  productSelect.value = i.product_id;
  quantityInput.value = i.quantity;
  submitBtn.textContent = "Update Stock";
}

// ---------- DELETE ----------
async function deleteEntry(id) {
  const sure = confirm("Delete this stock entry? This cannot be undone.");
  if (!sure) return;

  try {
    await fetch(`${API_URL}/inventory/${id}`, { method: "DELETE" });
    loadInventory();
  } catch (err) {
    alert("Could not delete entry: " + err.message);
  }
}

function resetForm() {
  form.reset();
  idInput.value = "";
  submitBtn.textContent = "Add Stock";
}
