const API_URL = "https://warehouse-management-system-production-eb5b.up.railway.app";

function exportProducts(){

    window.open(
        `${API_URL}/export/products`,
        "_blank"
    );

}

function exportOrders(){

    window.open(
        `${API_URL}/export/orders`,
        "_blank"
    );

}

function exportVendors(){

    window.open(
        `${API_URL}/export/vendors`,
        "_blank"
    );

}

function exportWarehouses(){

    window.open(
        `${API_URL}/export/warehouses`,
        "_blank"
    );

}

function exportInventory(){

    window.open(
        `${API_URL}/export/inventory`,
        "_blank"
    );

}