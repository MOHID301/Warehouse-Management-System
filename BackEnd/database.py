import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="db_project"
    )

    print("Database Connected Successfully!")

except Exception as e:
    print("Error:", e)