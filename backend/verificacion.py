from app import conectar_bd  # Reemplaza con el nombre de tu archivo Flask

conn = conectar_bd()
if conn:
    print("✅ Conexión exitosa a MySQL en DataGrip")
    conn.close()
else:
    print("❌ Fallo en la conexión")