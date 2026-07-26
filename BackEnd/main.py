import pandas as pd

from fastapi.responses import FileResponse

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector

app = FastAPI()

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# DATABASE CONNECTION
# =====================================================


def get_connection():
    return mysql.connector.connect(
        host="kodama.proxy.rlwy.net",
        port=50699,
        user="root",
        password="eqdLwtWPHmhZakkqYiCcdkZySjvPkGNo",
        database="railway"
    )

def add_log(table_name, action_type, record_id, description):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO activity_log
        (table_name, action_type, record_id, description)
        VALUES (%s,%s,%s,%s)
    """, (
        table_name,
        action_type,
        record_id,
        description
    ))

    conn.commit()

    cursor.close()
    conn.close()
# =====================================================
# MODELS
# =====================================================

class Login(BaseModel):
    username: str
    password: str

class Product(BaseModel):
    product_name: str
    category: str
    unit_price: float

class ChangePassword(BaseModel):
    username: str
    current_password: str
    new_password: str


class Warehouse(BaseModel):
    warehouse_name: str
    location: str
    capacity: int


class Vendor(BaseModel):
    vendor_name: str
    phone: str
    email: str


class Inventory(BaseModel):
    warehouse_id: int
    product_id: int
    quantity: int


class PurchaseOrder(BaseModel):
    vendor_id: int
    order_date: str
    STATUS: str


class OrderDetail(BaseModel):
    order_id: int
    product_id: int
    quantity: int

# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {"message": "Warehouse Management System API"}

# =====================================================
# PRODUCTS
# =====================================================

@app.get("/products")
def get_products():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM product")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


@app.post("/products")
def add_product(product: Product):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO product
        (product_name, category, unit_price)
        VALUES (%s,%s,%s)
    """, (
        product.product_name,
        product.category,
        product.unit_price
    ))

    conn.commit()

    product_id = cursor.lastrowid

    add_log(
    "product",
    "INSERT",
    product_id,
    f"Added product {product.product_name}"
)
    cursor.close()
    conn.close()

    return {"message": "Product Added"}


@app.put("/products/{product_id}")
def update_product(product_id: int, product: Product):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE product
        SET product_name=%s,
            category=%s,
            unit_price=%s
        WHERE product_id=%s
    """, (
        product.product_name,
        product.category,
        product.unit_price,
        product_id
    ))

    conn.commit()
    add_log(
    "product",
    "UPDATE",
    product_id,
    f"Updated product {product.product_name}"
)

    cursor.close()
    conn.close()

    return {"message": "Product Updated"}


@app.delete("/products/{product_id}")
def delete_product(product_id: int):

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
    "SELECT product_name FROM product WHERE product_id=%s",
    (product_id,)
)

    old_product = cursor.fetchone()

    try:

        cursor.execute(
            "DELETE FROM order_detail WHERE product_id=%s",
            (product_id,)
        )

        cursor.execute(
            "DELETE FROM inventory WHERE product_id=%s",
            (product_id,)
        )

        cursor.execute(
            "DELETE FROM product WHERE product_id=%s",
            (product_id,)
        )

        conn.commit()
        if old_product:
            add_log(
        "product",
        "DELETE",
        product_id,
        f"Deleted product {old_product[0]}"
    )

        return {"message": "Product Deleted"}

    except Exception as e:

        conn.rollback()
        return {"error": str(e)}

    finally:

        cursor.close()
        conn.close()

# =====================================================
# WAREHOUSES
# =====================================================

@app.get("/warehouses")
def get_warehouses():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM warehouses")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


@app.post("/warehouses")
def add_warehouse(warehouse: Warehouse):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO warehouses
        (warehouse_name, location, capacity)
        VALUES (%s,%s,%s)
    """, (
        warehouse.warehouse_name,
        warehouse.location,
        warehouse.capacity
    ))

    conn.commit()
    warehouse_id = cursor.lastrowid

    add_log(
    "warehouse",
    "INSERT",
    warehouse_id,
    f"Added warehouse {warehouse.warehouse_name}"
)

    cursor.close()
    conn.close()

    return {"message": "Warehouse Added"}


@app.put("/warehouses/{warehouse_id}")
def update_warehouse(warehouse_id: int, warehouse: Warehouse):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE warehouses
        SET warehouse_name=%s,
            location=%s,
            capacity=%s
        WHERE warehouse_id=%s
    """, (
        warehouse.warehouse_name,
        warehouse.location,
        warehouse.capacity,
        warehouse_id
    ))

    conn.commit()
    add_log(
    "warehouse",
    "UPDATE",
    warehouse_id,
    f"Updated warehouse {warehouse.warehouse_name}"
)

    cursor.close()
    conn.close()

    return {"message": "Warehouse Updated"}


@app.delete("/warehouses/{warehouse_id}")
def delete_warehouse(warehouse_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute(
            "DELETE FROM inventory WHERE warehouse_id=%s",
            (warehouse_id,)
        )

        cursor.execute(
            "DELETE FROM warehouses WHERE warehouse_id=%s",
            (warehouse_id,)
        )

        conn.commit()
        add_log(
    "warehouse",
    "DELETE",
    warehouse_id,
    "Warehouse Deleted"
)

        return {"message": "Warehouse Deleted"}

    except Exception as e:

        conn.rollback()
        return {"error": str(e)}

    finally:

        cursor.close()
        conn.close()

# =====================================================
# VENDORS
# =====================================================

@app.get("/vendors")
def get_vendors():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM vendors")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


@app.post("/vendors")
def add_vendor(vendor: Vendor):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO vendors
        (vendor_name, phone, email)
        VALUES (%s,%s,%s)
    """, (
        vendor.vendor_name,
        vendor.phone,
        vendor.email
    ))

    conn.commit()
    vendor_id = cursor.lastrowid

    add_log(
    "vendor",
    "INSERT",
    vendor_id,
    f"Added vendor {vendor.vendor_name}"
)

    cursor.close()
    conn.close()

    return {"message": "Vendor Added"}


@app.put("/vendors/{vendor_id}")
def update_vendor(vendor_id: int, vendor: Vendor):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE vendors
        SET vendor_name=%s,
            phone=%s,
            email=%s
        WHERE vendor_id=%s
    """, (
        vendor.vendor_name,
        vendor.phone,
        vendor.email,
        vendor_id
    ))

    conn.commit()
    add_log(
    "vendor",
    "UPDATE",
    vendor_id,
    f"Updated vendor {vendor.vendor_name}"
)

    cursor.close()
    conn.close()

    return {"message": "Vendor Updated"}


@app.delete("/vendors/{vendor_id}")
def delete_vendor(vendor_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute(
            "DELETE FROM purchase_order WHERE vendor_id=%s",
            (vendor_id,)
        )

        cursor.execute(
            "DELETE FROM vendors WHERE vendor_id=%s",
            (vendor_id,)
        )

        conn.commit()
        add_log(
    "vendor",
    "DELETE",
    vendor_id,
    "Vendor Deleted"
)

        return {"message": "Vendor Deleted"}

    except Exception as e:

        conn.rollback()
        return {"error": str(e)}

    finally:

        cursor.close()
        conn.close()

# =====================================================
# INVENTORY
# =====================================================

@app.get("/inventory")
def get_inventory():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM inventory")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


@app.post("/inventory")
def add_inventory(item: Inventory):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO inventory
        (warehouse_id, product_id, quantity)
        VALUES (%s,%s,%s)
    """, (
        item.warehouse_id,
        item.product_id,
        item.quantity
    ))

    conn.commit()
    inventory_id = cursor.lastrowid

    add_log(
    "inventory",
    "INSERT",
    inventory_id,
    f"Added inventory quantity {item.quantity}"
)

    cursor.close()

    conn.close()

    return {"message": "Inventory Added"}


@app.put("/inventory/{inventory_id}")
def update_inventory(inventory_id: int, item: Inventory):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE inventory
        SET warehouse_id=%s,
            product_id=%s,
            quantity=%s
        WHERE inventory_id=%s
    """, (
        item.warehouse_id,
        item.product_id,
        item.quantity,
        inventory_id
    ))

    conn.commit()
    add_log(
    "inventory",
    "UPDATE",
    inventory_id,
    f"Updated inventory quantity {item.quantity}"
)

    cursor.close()
    conn.close()

    return {"message": "Inventory Updated"}


@app.delete("/inventory/{inventory_id}")
def delete_inventory(inventory_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM inventory WHERE inventory_id=%s",
        (inventory_id,)
    )

    conn.commit()
    add_log(
    "inventory",
    "DELETE",
    inventory_id,
    "Inventory Deleted"
)
    cursor.close()
    conn.close()

    return {"message": "Inventory Deleted"}

# =====================================================
# PURCHASE ORDERS
# =====================================================

@app.get("/purchase-orders")
def get_purchase_orders():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM purchase_order")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


@app.post("/purchase-orders")
def add_purchase_order(order: PurchaseOrder):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO purchase_order
        (vendor_id, order_date, STATUS)
        VALUES (%s,%s,%s)
    """, (
        order.vendor_id,
        order.order_date,
        order.STATUS
    ))

    conn.commit()
    order_id = cursor.lastrowid

    add_log(
    "purchase_order",
    "INSERT",
    order_id,
    f"Created Purchase Order #{order_id}"
)

    cursor.close()
    conn.close()

    return {"message": "Purchase Order Added"}


@app.put("/purchase-orders/{order_id}")
def update_purchase_order(order_id: int, order: PurchaseOrder):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE purchase_order
        SET vendor_id=%s,
            order_date=%s,
            STATUS=%s
        WHERE order_id=%s
    """, (
        order.vendor_id,
        order.order_date,
        order.STATUS,
        order_id
    ))

    conn.commit()
    add_log(
    "purchase_order",
    "UPDATE",
    order_id,
    f"Updated Purchase Order #{order_id}"
)

    cursor.close()
    conn.close()

    return {"message": "Purchase Order Updated"}


@app.delete("/purchase-orders/{order_id}")
def delete_purchase_order(order_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    try:

        cursor.execute(
            "DELETE FROM order_detail WHERE order_id=%s",
            (order_id,)
        )

        cursor.execute(
            "DELETE FROM purchase_order WHERE order_id=%s",
            (order_id,)
        )

        conn.commit()
        add_log(
    "purchase_order",
    "DELETE",
    order_id,
    f"Deleted Purchase Order #{order_id}"
)

        return {"message": "Purchase Order Deleted"}

    except Exception as e:

        conn.rollback()
        return {"error": str(e)}

    finally:

        cursor.close()
        conn.close()

# =====================================================
# ORDER DETAILS
# =====================================================

@app.get("/order-details")
def get_order_details():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM order_detail")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


@app.post("/order-details")
def add_order_detail(detail: OrderDetail):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO order_detail
        (order_id, product_id, quantity)
        VALUES (%s,%s,%s)
    """, (
        detail.order_id,
        detail.product_id,
        detail.quantity
    ))

    conn.commit()
    detail_id = cursor.lastrowid

    add_log(
    "order_detail",
    "INSERT",
    detail_id,
    f"Added item to Order #{detail.order_id}"
)
    cursor.close()
    conn.close()

    return {"message": "Order Detail Added"}


@app.put("/order-details/{detail_id}")
def update_order_detail(detail_id: int, detail: OrderDetail):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE order_detail
        SET order_id=%s,
            product_id=%s,
            quantity=%s
        WHERE detail_id=%s
    """, (
        detail.order_id,
        detail.product_id,
        detail.quantity,
        detail_id
    ))

    conn.commit()
    add_log(
    "order_detail",
    "UPDATE",
    detail_id,
    f"Updated item in Order #{detail.order_id}"
)

    cursor.close()
    conn.close()

    return {"message": "Order Detail Updated"}


@app.delete("/order-details/{detail_id}")
def delete_order_detail(detail_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM order_detail WHERE detail_id=%s",
        (detail_id,)
    )

    conn.commit()
    add_log(
    "order_detail",
    "DELETE",
    detail_id,
    "Order Detail Deleted"
)
    cursor.close()
    conn.close()

    return {"message": "Order Detail Deleted"}

# =====================================================
# DASHBOARD
# =====================================================

@app.get("/dashboard")
def dashboard():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) total FROM product")
    products = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) total FROM warehouses")
    warehouses = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) total FROM vendors")
    vendors = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) total FROM inventory")
    stock = cursor.fetchone()["total"] or 0

    cursor.execute(
    "SELECT COUNT(*) total FROM purchase_order"
)
    orders = cursor.fetchone()["total"]

    cursor.close()
    conn.close()

    return {
        "products": products,
        "warehouses": warehouses,
        "vendors": vendors,
        "orders": orders,
        "stock": stock
        
    }
# =====================================================
# ACTIVITY LOGS
# =====================================================

@app.get("/activity-log")
def get_activity_log():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM activity_log
        ORDER BY action_time DESC
    """)

    logs = cursor.fetchall()

    cursor.close()
    conn.close()

    return logs

@app.get("/recent-activities")
def recent_activities():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM activity_log
        ORDER BY action_time DESC
        LIMIT 10
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data


@app.post("/login")
def login(data: Login):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM users
        WHERE username=%s
        AND password=%s
    """, (
        data.username,
        data.password
    ))

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return {
            "success": True,
            "role": user["role"],
            "username": user["username"]
        }

    return {
        "success": False
    }

@app.get("/reports")
def reports():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Daily Orders
    cursor.execute("""
        SELECT COUNT(*) total
        FROM purchase_order
        WHERE DATE(order_date)=CURDATE()
    """)
    daily_orders = cursor.fetchone()["total"]

    # Weekly Orders
    cursor.execute("""
        SELECT COUNT(*) total
        FROM purchase_order
        WHERE YEARWEEK(order_date)=YEARWEEK(NOW())
    """)
    weekly_orders = cursor.fetchone()["total"]

    # Monthly Orders
    cursor.execute("""
        SELECT COUNT(*) total
        FROM purchase_order
        WHERE MONTH(order_date)=MONTH(NOW())
        AND YEAR(order_date)=YEAR(NOW())
    """)
    monthly_orders = cursor.fetchone()["total"]

    # Yearly Orders
    cursor.execute("""
        SELECT COUNT(*) total
        FROM purchase_order
        WHERE YEAR(order_date)=YEAR(NOW())
    """)
    yearly_orders = cursor.fetchone()["total"]

    return {
        "daily_orders": daily_orders,
        "weekly_orders": weekly_orders,
        "monthly_orders": monthly_orders,
        "yearly_orders": yearly_orders
    }

@app.get("/monthly-orders-chart")
def monthly_orders_chart():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            MONTH(order_date) month,
            COUNT(*) total
        FROM purchase_order
        GROUP BY MONTH(order_date)
        ORDER BY MONTH(order_date)
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data

@app.get("/reports")
def reports():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT COUNT(*) total
        FROM purchase_order
        WHERE DATE(order_date)=CURDATE()
    """)
    daily_orders = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) total
        FROM purchase_order
        WHERE YEARWEEK(order_date)=YEARWEEK(NOW())
    """)
    weekly_orders = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) total
        FROM purchase_order
        WHERE MONTH(order_date)=MONTH(NOW())
        AND YEAR(order_date)=YEAR(NOW())
    """)
    monthly_orders = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) total
        FROM purchase_order
        WHERE YEAR(order_date)=YEAR(NOW())
    """)
    yearly_orders = cursor.fetchone()["total"]

    cursor.close()
    conn.close()

    return {
        "daily_orders": daily_orders,
        "weekly_orders": weekly_orders,
        "monthly_orders": monthly_orders,
        "yearly_orders": yearly_orders
    }

@app.get("/reports/monthly-orders")
def monthly_orders():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            MONTHNAME(order_date) month,
            COUNT(*) total
        FROM purchase_order
        GROUP BY MONTH(order_date)
        ORDER BY MONTH(order_date)
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data

@app.get("/reports/product-categories")
def product_categories():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            category,
            COUNT(*) total
        FROM product
        GROUP BY category
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data

    @app.get("/reports/system-summary")
    def system_summary():

        conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) total FROM product")
    products = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) total FROM warehouses")
    warehouses = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) total FROM vendors")
    vendors = cursor.fetchone()["total"]

    cursor.execute("SELECT SUM(quantity) total FROM inventory")
    stock = cursor.fetchone()["total"] or 0

    cursor.close()
    conn.close()

    return {
        "products": products,
        "warehouses": warehouses,
        "vendors": vendors,
        "stock": stock
    }

@app.get("/export/products")
def export_products():

    conn = get_connection()

    query = """
        SELECT *
        FROM product
    """

    df = pd.read_sql(query, conn)

    file_name = "products.xlsx"

    df.to_excel(
        file_name,
        index=False
    )

    conn.close()

    return FileResponse(
        file_name,
        filename=file_name
    )

@app.get("/export/orders")
def export_orders():

    conn = get_connection()

    query = """
        SELECT *
        FROM purchase_order
    """

    df = pd.read_sql(query, conn)

    file_name = "orders.xlsx"

    df.to_excel(
        file_name,
        index=False
    )

    conn.close()

    return FileResponse(
        file_name,
        filename=file_name
    )

@app.get("/export/vendors")
def export_vendors():

    conn = get_connection()

    query = """
        SELECT *
        FROM vendors
    """

    df = pd.read_sql(query, conn)

    file_name = "vendors.xlsx"

    df.to_excel(
        file_name,
        index=False
    )

    conn.close()

    return FileResponse(
        file_name,
        filename=file_name
    )

@app.get("/export/warehouses")
def export_warehouses():

    conn = get_connection()

    query = """
        SELECT *
        FROM warehouses
    """

    df = pd.read_sql(query, conn)

    file_name = "warehouses.xlsx"

    df.to_excel(
        file_name,
        index=False
    )

    conn.close()

    return FileResponse(
        file_name,
        filename=file_name
    )

@app.get("/export/inventory")
def export_inventory():

    conn = get_connection()

    query = """
        SELECT *
        FROM inventory
    """

    df = pd.read_sql(query, conn)

    file_name = "inventory.xlsx"

    df.to_excel(
        file_name,
        index=False
    )

    conn.close()

    return FileResponse(
        file_name,
        filename=file_name
    )

@app.put("/change-password")
def change_password(data: ChangePassword):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Check if current password is correct
    cursor.execute("""
        SELECT * FROM users
        WHERE username=%s AND password=%s
    """, (data.username, data.current_password))

    user = cursor.fetchone()

    if not user:
        cursor.close()
        conn.close()

        return {
            "success": False,
            "message": "Current password is incorrect."
        }

    # Update password
    cursor.execute("""
        UPDATE users
        SET password=%s
        WHERE username=%s
    """, (data.new_password, data.username))

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Password changed successfully."
    }