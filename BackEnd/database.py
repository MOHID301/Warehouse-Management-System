import os
import mysql.connector


def get_connection():
    cfg = {
        "host": os.getenv("DB_HOST", "localhost"),
        "port": int(os.getenv("DB_PORT", "3306")),
        "user": os.getenv("DB_USER", "root"),
        "password": os.getenv("DB_PASSWORD", ""),
        "database": os.getenv("DB_NAME", "db_project"),
    }
    if os.getenv("DB_SSL", "0") == "1":
        cfg["ssl_disabled"] = False
        ca = os.getenv("DB_SSL_CA")
        if ca:
            cfg["ssl_ca"] = ca
    return mysql.connector.connect(**cfg)


if __name__ == "__main__":
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM product")
        print("Database Connected Successfully! Products:", cur.fetchone()[0])
        conn.close()
    except Exception as e:
        print("Error:", e)