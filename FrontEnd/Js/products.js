// ==========================================================
// products.js
// Full CRUD for the Products table.
// Change API_URL if your FastAPI server runs somewhere else.
//
// Expected FastAPI routes:
//   GET    /products
//   POST   /products
//   PUT    /products/{id}
//   DELETE /products/{id}
// ==========================================================

const API_URL = "https://warehouse-management-system-production-eb5b.up.railway.app";

let products = []; // keeps the last list we loaded, so Edit can look items up by id

const form = document.getElementById("product-form");
const tableBody = document.getElementById("product-table-body");
const idInput = document.getElementById("product_id");
const nameInput = document.getElementById("product_name");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("unit_price");
const submitBtn = document.getElementById("submit-btn");

window.onload = loadProducts;

// ---------- READ ----------
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    products = await res.json();
    renderTable();
  } catch (err) {
    alert("Could not load products. Is the API running?\n" + err.message);
  }
}

function renderTable() {
  tableBody.innerHTML = "";
  products.forEach(p => {
    tableBody.innerHTML += `
      <tr>
        <td>${p.product_id}</td>
        <td>${p.product_name}</td>
        <td>${p.category ? p.category : ""}</td>
        <td>${p.unit_price}</td>
        <td>
          <button onclick="editProduct(${p.product_id})">Edit</button>
          <button onclick="deleteProduct(${p.product_id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ---------- CREATE + UPDATE (same form) ----------
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const productData = {
    product_name: nameInput.value,
    category: categoryInput.value,
    unit_price: parseFloat(priceInput.value)
  };

  try {
    if (idInput.value === "") {
      // no id in the hidden field -> this is a new product
      await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
    } else {
      // id is set -> we are updating an existing product
      await fetch(`${API_URL}/products/${idInput.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
    }
    resetForm();
    loadProducts();
  } catch (err) {
    alert("Something went wrong while saving: " + err.message);
  }
});

// ---------- fill the form to edit a row ----------
function editProduct(id) {
  const p = products.find(item => item.product_id === id);
  if (!p) return;

  idInput.value = p.product_id;
  nameInput.value = p.product_name;
  categoryInput.value = p.category ? p.category : "";
  priceInput.value = p.unit_price;
  submitBtn.textContent = "Update Product";
}

// ---------- DELETE ----------
async function deleteProduct(id) {
  const sure = confirm("Delete this product? This cannot be undone.");
  if (!sure) return;

  try {
    await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
    loadProducts();
  } catch (err) {
    alert("Could not delete product: " + err.message);
  }
}

// ---------- back to "Add" mode ----------
function resetForm() {
  form.reset();
  idInput.value = "";
  submitBtn.textContent = "Add Product";
}
