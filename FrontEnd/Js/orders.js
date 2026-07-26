
const API_URL = "https://warehouse-management-system-production-eb5b.up.railway.app";

let orders = [];
let vendors = [];
let products = [];
let orderItems = [];

// ----- Orders form elements -----
const orderForm = document.getElementById("order-form");
const orderTableBody = document.getElementById("order-table-body");
const orderIdInput = document.getElementById("order_id");
const vendorSelect = document.getElementById("vendor_id");
const orderDateInput = document.getElementById("order_date");
const statusSelect = document.getElementById("status");
const orderSubmitBtn = document.getElementById("order-submit-btn");

// ----- Order Items form elements -----
const itemForm = document.getElementById("item-form");
const itemTableBody = document.getElementById("item-table-body");
const detailIdInput = document.getElementById("detail_id");
const itemOrderSelect = document.getElementById("item_order_id");
const itemProductSelect = document.getElementById("item_product_id");
const itemQuantityInput = document.getElementById("item_quantity");
const itemSubmitBtn = document.getElementById("item-submit-btn");

window.onload = init;

async function init() {
  await loadVendorsAndProducts();
  await loadOrders();
  await loadOrderItems();
}

// ---------- lookups ----------
async function loadVendorsAndProducts() {
  try {
    let res = await fetch(`${API_URL}/vendors`);
    vendors = await res.json();
    vendors.forEach(v => {
      vendorSelect.innerHTML += `<option value="${v.vendor_id}">${v.vendor_name}</option>`;
    });

    res = await fetch(`${API_URL}/products`);
    products = await res.json();
    products.forEach(p => {
      itemProductSelect.innerHTML += `<option value="${p.product_id}">${p.product_name}</option>`;
    });
  } catch (err) {
    alert("Could not load vendors/products: " + err.message);
  }
}

function vendorName(id) {
  const v = vendors.find(item => item.vendor_id === id);
  return v ? v.vendor_name : "Unknown";
}

function productName(id) {
  const p = products.find(item => item.product_id === id);
  return p ? p.product_name : "Unknown";
}

// =========================================================
// ORDERS
// =========================================================

async function loadOrders() {
  try {
    const res = await fetch(`${API_URL}/purchase-orders`);
    orders = await res.json();
    renderOrderTable();
    fillOrderDropdown(); // keep the Order Items dropdown in sync too
  } catch (err) {
    alert("Could not load orders. Is the API running?\n" + err.message);
  }
}

function renderOrderTable() {
  orderTableBody.innerHTML = "";
  orders.forEach(o => {
    orderTableBody.innerHTML += `
      <tr>
        <td>${o.order_id}</td>
        <td>${vendorName(o.vendor_id)}</td>
        <td>${o.order_date ? o.order_date.slice(0, 10) : ""}</td>
        <td>${o.STATUS}</td>
        <td>
          <button onclick="editOrder(${o.order_id})">Edit</button>
          <button onclick="deleteOrder(${o.order_id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function fillOrderDropdown() {
  itemOrderSelect.innerHTML = `<option value="">Select Order</option>`;
  orders.forEach(o => {
    const dateText = o.order_date ? o.order_date.slice(0, 10) : "";
    itemOrderSelect.innerHTML += `<option value="${o.order_id}">Order #${o.order_id} (${dateText})</option>`;
  });
}

orderForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const orderData = {
    vendor_id: parseInt(vendorSelect.value),
    order_date: orderDateInput.value,
    STATUS: statusSelect.value
  };

  try {
    if (orderIdInput.value === "") {
      await fetch(`${API_URL}/purchase-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
    } else {
      await fetch(`${API_URL}/purchase-orders/${orderIdInput.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
    }
    resetOrderForm();
    loadOrders();
  } catch (err) {
    alert("Something went wrong while saving the order: " + err.message);
  }
});

function editOrder(id) {
  const o = orders.find(item => item.order_id === id);
  if (!o) return;

  orderIdInput.value = o.order_id;
  vendorSelect.value = o.vendor_id;
  orderDateInput.value = o.order_date ? o.order_date.slice(0, 10) : "";
  statusSelect.value = o.STATUS;
  orderSubmitBtn.textContent = "Update Order";
}

async function deleteOrder(id) {
  const sure = confirm("Delete this order? Its order items should be removed first.");
  if (!sure) return;

  try {
    await fetch(`${API_URL}/purchase-orders/${id}`, { method: "DELETE" });
    loadOrders();
  } catch (err) {
    alert("Could not delete order: " + err.message);
    
  }
}

function resetOrderForm() {
  orderForm.reset();
  orderIdInput.value = "";
  orderSubmitBtn.textContent = "Add Order";
}

// =========================================================
// ORDER ITEMS (Order_Details)
// =========================================================

async function loadOrderItems() {
  try {
    const res = await fetch(`${API_URL}/order-details`);
    orderItems = await res.json();
    renderItemTable();
  } catch (err) {
    alert("Could not load order items. Is the API running?\n" + err.message);
  }
}

function renderItemTable() {
  itemTableBody.innerHTML = "";
  orderItems.forEach(d => {
    itemTableBody.innerHTML += `
      <tr>
        <td>${d.detail_id}</td>
        <td>Order #${d.order_id}</td>
        <td>${productName(d.product_id)}</td>
        <td>${d.quantity}</td>
        <td>
          <button onclick="editItem(${d.detail_id})">Edit</button>
          <button onclick="deleteItem(${d.detail_id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

itemForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const itemData = {
    order_id: parseInt(itemOrderSelect.value),
    product_id: parseInt(itemProductSelect.value),
    quantity: parseInt(itemQuantityInput.value)
  };

  try {
    if (detailIdInput.value === "") {
      await fetch(`${API_URL}/order-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });
    } else {
      await fetch(`${API_URL}/order-details/${detailIdInput.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });
    }
    resetItemForm();
    loadOrderItems();
  } catch (err) {
    alert("Something went wrong while saving the item: " + err.message);
  }
});

function editItem(id) {
  const d = orderItems.find(item => item.detail_id === id);
  if (!d) return;

  detailIdInput.value = d.detail_id;
  itemOrderSelect.value = d.order_id;
  itemProductSelect.value = d.product_id;
  itemQuantityInput.value = d.quantity;
  itemSubmitBtn.textContent = "Update Item";
}

async function deleteItem(id) {
  const sure = confirm("Remove this item from the order?");
  if (!sure) return;

  try {
    await fetch(`${API_URL}/order-details/${id}`, { method: "DELETE" });
    loadOrderItems();
  } catch (err) {
    alert("Could not delete item: " + err.message);
  }
}

function resetItemForm() {
  itemForm.reset();
  detailIdInput.value = "";
  itemSubmitBtn.textContent = "Add Item";
}
