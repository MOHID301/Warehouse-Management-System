// ==========================================================
// vendors.js
// Full CRUD for the Vendors table.
//
// Expected FastAPI routes:
//   GET    /vendors
//   POST   /vendors
//   PUT    /vendors/{id}
//   DELETE /vendors/{id}
// ==========================================================

const API_URL = "http://127.0.0.1:8000";

let vendors = [];

const form = document.getElementById("vendor-form");
const tableBody = document.getElementById("vendor-table-body");
const idInput = document.getElementById("vendor_id");
const nameInput = document.getElementById("vendor_name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const submitBtn = document.getElementById("submit-btn");

window.onload = loadVendors;

async function loadVendors() {
  try {
    const res = await fetch(`${API_URL}/vendors`);
    vendors = await res.json();
    renderTable();
  } catch (err) {
    alert("Could not load vendors. Is the API running?\n" + err.message);
  }
}

function renderTable() {
  tableBody.innerHTML = "";
  vendors.forEach(v => {
    tableBody.innerHTML += `
      <tr>
        <td>${v.vendor_id}</td>
        <td>${v.vendor_name}</td>
        <td>${v.phone ? v.phone : ""}</td>
        <td>${v.email ? v.email : ""}</td>
        <td>
          <button onclick="editVendor(${v.vendor_id})">Edit</button>
          <button onclick="deleteVendor(${v.vendor_id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const vendorData = {
    vendor_name: nameInput.value,
    phone: phoneInput.value,
    email: emailInput.value
  };

  try {
    if (idInput.value === "") {
      await fetch(`${API_URL}/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorData)
      });
    } else {
      await fetch(`${API_URL}/vendors/${idInput.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorData)
      });
    }
    resetForm();
    loadVendors();
  } catch (err) {
    alert("Something went wrong while saving: " + err.message);
  }
});

function editVendor(id) {
  const v = vendors.find(item => item.vendor_id === id);
  if (!v) return;

  idInput.value = v.vendor_id;
  nameInput.value = v.vendor_name;
  phoneInput.value = v.phone ? v.phone : "";
  emailInput.value = v.email ? v.email : "";
  submitBtn.textContent = "Update Vendor";
}

async function deleteVendor(id) {
  const sure = confirm("Delete this vendor? This cannot be undone.");
  if (!sure) return;

  try {
    await fetch(`${API_URL}/vendors/${id}`, { method: "DELETE" });
    loadVendors();
  } catch (err) {
    alert("Could not delete vendor: " + err.message);
  }
}

function resetForm() {
  form.reset();
  idInput.value = "";
  submitBtn.textContent = "Add Vendor";
}
