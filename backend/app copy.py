import os
import re
import google.generativeai as genai
from dotenv import load_dotenv
import mysql.connector
from flask_cors import CORS
from flask import Flask, request, jsonify, render_template, session
import requests


app = Flask(__name__)
load_dotenv()
app.secret_key = os.getenv("FLASK_PASSWORD")
CORS(app)  # Habilita CORS para todas las rutas

MENSAJE_PERSONALIDAD = (
    "Trabajas como asistente en una tienda online de autopartes. "
    "Te llamas Juan Carlos Bodoque. "
    "Solo puedes hablar sobre autopartes, sus características, precios y disponibilidad. "
    "Si te preguntan por otros productos, responde que solo vendes autopartes. "
    "Eres un asistente de ventas amable y profesional. "
    "No digas que eres una IA. "
    "No hagas respuestas tan largas. "
    "Responde con carisma y sin repetir saludos innecesarios. "
)
API_URL = "https://test-api.beta-autopartes.com/api/v1/products/search/0?query="

@app.route("/api/data", methods=["GET"])
def configurar_gemini():
    api_key = os.getenv("PASSWORD_API")
    if not api_key:
        raise ValueError("⚠️ Falta la clave API de Gemini en las variables de entorno")
    genai.configure(api_key=api_key)

# Conectar a la base de datos MySQL
def conectar_bd():
    """Conecta a la base de datos MySQL y devuelve la conexión."""
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),      
            user=os.getenv("DB_USER"),            
            password=os.getenv("DB_PASSWORD"),           
            database=os.getenv("DB_NAME"), 
            port=os.getenv("DB_PORT") 
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error al conectar a MySQL: {err}")
        return None

def limpiar_texto(texto):
    texto = texto.lower()
    texto = re.sub(r'\b(el|un|una|los|las|de|la)\b', '', texto)  # Elimina artículos
    return texto.strip()

def buscar_producto_en_api(pregunta):
    """Consulta la API para buscar productos según la pregunta del usuario."""
    try:
        # Aquí concatenamos correctamente la pregunta al final de la URL
        response = requests.get(API_URL + pregunta, timeout=5)

        # Verificar si la API realmente devuelve JSON
        if "application/json" not in response.headers.get("Content-Type", ""):
            return f"⚠️ La API devolvió un formato inesperado: {response.text[:200]}"  # Muestra los primeros 200 caracteres para ver el error.

        productos = response.json()

        if not productos:
            return "No encontré ese producto en la tienda."

        if len(productos) > 3:
            return (
                f"Encontré varios productos que coinciden con '{pregunta}', ¿podrías darme más detalles? "
                "Por ejemplo, la marca o el modelo. "
                "Si tienes el SKU del producto (campo 'clave'), sería ideal para encontrarlo más rápido. 😉"
            )

        # Si hay pocos resultados, mostrarlos (máximo 3)
        respuesta = "\n".join(
            [
                f"🛒 **{producto.get('nombre', 'Desconocido')}**\n"
                f"🏷️ **Marca:** {producto.get('marca', 'No especificada')}\n"
                f"🚗 **Modelo:** {producto.get('modelo', 'No especificado')}\n"
                f"📅 **Año de fabricación:** {producto.get('anio_fabricacion', 'No disponible')}\n"
                f"🔢 **SKU (Clave):** {producto.get('clave', 'No disponible')}\n"
                "--------------------------------"
                for producto in productos[:3]
            ]
        )

        return respuesta

    except requests.RequestException as e:
        return f"❌ Error al conectarse con la API: {e}"
    
def obtener_datos_producto(clave_producto):
    """Obtiene los datos del producto desde una API externa."""
    url = f"https://api.tienda.com/productos/{clave_producto}"  # Cambia esto a la URL correcta de tu API
    response = requests.get(url)

    if response.status_code == 200:
        datos = response.json()
        return {
            "descripcion": datos.get("descripcion"),
            "precio": datos.get("precio"),
            "stock": datos.get("stock"),
        }
    else:
        return None   
    
    
# Buscar promociones en la base de datos
def buscar_promociones():
    """Busca las promociones disponibles en la base de datos."""
    try:
        conn = conectar_bd()
        cursor = conn.cursor(dictionary=True)  # Permite acceder a los datos por nombre de columna

        consulta = """
        SELECT p.nombre AS producto, pr.porcentaje_descuento 
        FROM promociones pr 
        JOIN productos p ON pr.id_producto = p.id_producto
        """
     
        cursor.execute(consulta)
        promociones = cursor.fetchall()

        if promociones:
            respuesta = "🎉 **Promociones actuales:**\n"
            for promocion in promociones:
                respuesta += f"🔹 {promocion['producto']}: {promocion['porcentaje_descuento']}% de descuento\n"
            respuesta += "\n¡Aprovecha estas ofertas antes de que terminen! 🛍️"
            return respuesta

        else:
            respuesta = "Actualmente no tenemos promociones activas, pero pronto tendremos nuevas ofertas. ¡Estate atento! 😊"
        cursor.close()
        conn.close()

    except mysql.connector.Error as err:
        return f"⚠️ Error al buscar promociones: {err}"
    
def buscar_promocion_por_producto(nombre_producto):
    """
    Busca la promoción de un producto específico en la base de datos.
    
    :param nombre_producto: Nombre del producto a buscar.
    :return: Respuesta con la promoción del producto o un mensaje indicando que no hay promoción.
    """
    try:
        conn = conectar_bd()
        cursor = conn.cursor(dictionary=True)  # Permite acceder a los datos por nombre de columna

        # Query para buscar la promoción de un producto específico
        consulta = """
        SELECT p.nombre AS producto, pr.porcentaje_descuento 
        FROM promociones pr 
        JOIN productos p ON pr.id_producto = p.id_producto
        WHERE LOWER(p.nombre) LIKE %s;
        """
        
        # Ejecutar la consulta con el nombre del producto como parámetro
        cursor.execute(consulta, (f'%{nombre_producto.lower()}%',))  # Búsqueda insensible a mayúsculas/minúsculas

        # Obtener el resultado
        promocion = cursor.fetchone()

        if promocion:
            respuesta = f"🎉 **Promoción encontrada:**\n"
            respuesta += f"🔹 {promocion['producto']}: {promocion['porcentaje_descuento']}% de descuento\n"
            respuesta += "\n¡Aprovecha esta oferta antes de que termine! 🛍️"
        else:
            respuesta = f"ℹ️ No encontramos promociones para el producto '{nombre_producto}'. ¡Pero sigue atento a nuestras ofertas! 😊"

        # Cerrar la conexión
        cursor.close()
        conn.close()

        return respuesta

    except mysql.connector.Error as err:
        return f"⚠️ Error al buscar promociones: {err}"

def extraer_producto(pregunta):
    """
    Extrae el nombre del producto de la pregunta del usuario.
    
    :param pregunta: La pregunta del usuario.
    :return: El nombre del producto o None si no se encuentra.
    """
    # Expresión regular para extraer el nombre del producto
    match = re.search(r"(?:tienen|tienes|hay)\s+stock\s+(?:de|en|del|los|las)?\s*([\w\s]+)\??", pregunta, re.IGNORECASE)
    if match:
        return match.group(1).strip()  # Devuelve el nombre del producto sin espacios adicionales
    return None

def verificar_stock(nombre_producto):
    """Verifica el stock de un producto en la base de datos y devuelve una respuesta personalizada."""
    conn = conectar_bd()
    if not conn:
        return "Error de conexión a la base de datos."

    try:
        cursor = conn.cursor()
        consulta = "SELECT nombre, stock FROM productos WHERE nombre LIKE %s"
        cursor.execute(consulta, (f"%{nombre_producto}%",))
        resultado = cursor.fetchone()

        if resultado:
            nombre, stock = resultado
            if stock >= 100:
                respuesta = f"✅ **{nombre}**: Tenemos suficiente stock disponible. ¡No te quedes sin él!"
            elif 50 <= stock < 100:
                respuesta = f"⚠️ **{nombre}**: Aún queda stock, pero no mucho. ¡Date prisa!"
            elif 1 <= stock < 50:
                respuesta = f"⏳ **{nombre}**: El stock se está agotando. ¡Compra ahora antes de que se acabe!"
            else:
                respuesta = f"❌ **{nombre}**: Lo sentimos, este producto está agotado. ¡Pronto tendremos más!"
        else:
            respuesta = f"ℹ️ No encontré el producto **{nombre_producto}** en la tienda."

        cursor.close()
        conn.close()
        return respuesta
    except mysql.connector.Error as err:
        return f"❌ Error en la consulta: {err}"

import requests

def obtener_respuesta(pregunta):
    """Determina si la pregunta es sobre un producto o una duda general."""
    pregunta = limpiar_texto(pregunta)

    # 🔍 Verificar si la pregunta es sobre un producto específico
    producto = extraer_producto(pregunta)

    if producto:
        datos_producto = obtener_datos_producto(producto)

        if datos_producto:
            return (
                f"📦 Producto encontrado:\n"
                f"**{datos_producto['descripcion']}**\n"
                f"💲 Precio: ${datos_producto['precio']}\n"
                f"📦 Stock: {datos_producto['stock']} unidades"
            )
        else:
            return "No encontré ese producto en nuestra base de datos. ¿Podrías verificar la clave o el nombre?"

    # 🤖 Si no es un producto, usar la IA para responder dudas generales
    return obtener_respuesta_ia(pregunta)

# ==============================
# 🔹 FUNCIONES DE CONSULTA A LA IA
# ==============================
def consultar_ia(pregunta):
    """Consulta a la IA (Gemini) para responder dudas generales."""
    try:
        response = requests.post(os.getenv('PASSWORD_API'), json={"prompt": pregunta, "max_tokens": 200})
        data = response.json()
        return data.get("text", "No estoy seguro de la respuesta. ¿Podrías reformular la pregunta?")
    except Exception:
        return "Hubo un error al procesar tu pregunta con la IA."

def obtener_respuesta_ia(pregunta):
    """Consulta a Gemini para responder dudas generales sobre autopartes."""
    # Resetear historial solo para el saludo inicial
    if "historial" not in session or len(session["historial"]) == 0:
        session["historial"] = [MENSAJE_PERSONALIDAD]
    
    session["historial"].append(f"Usuario: {pregunta}")

    # Historial de la conversación
    historial_chat = "\n".join(session["historial"])

    # Cargar el modelo de Gemini
    modelo = genai.GenerativeModel("gemini-1.5-pro-002")

    # Generar respuesta
    respuesta_ai = modelo.generate_content(MENSAJE_PERSONALIDAD + "\n" + historial_chat)
    
    # Obtener texto de la respuesta
    respuesta_final = respuesta_ai.text.strip()

    # Guardar en historial
    session["historial"].append(f"Bot: {respuesta_final}")

    return respuesta_final

# cargar html
@app.route("/")
def index():
    return render_template("index.html")

# Ruta para recibir el mensaje del usuario y devolver la respuesta
@app.route("/chat", methods=["GET", "POST"])
def chat():
    try:
        if request.method == "GET":
            session["historial"] = [MENSAJE_PERSONALIDAD]  # Forzar reinicio de contexto
            
            # Prompt directo y estructurado
            welcome_prompt = (
                "Saluda al usuario diciendo: '¡Hola! Soy Juan Carlos Bodoque, "
                "tu experto en autopartes. ¿Qué autopartes necesitas hoy?' "
                "Máximo 1 línea, sin emojis."
            )
            
            # Generar respuesta sin modificar el historial real
            temp_historial = [MENSAJE_PERSONALIDAD, f"Usuario: {welcome_prompt}"]
            modelo = genai.GenerativeModel("gemini-1.5-pro-002")
            respuesta_ai = modelo.generate_content("\n".join(temp_historial))
            
            return jsonify({"response": respuesta_ai.text.strip()})

        # POST handling with error wrapping
        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"error": "Mensaje vacío"}), 400

        # Ensure session exists
        if "historial" not in session:
            session["historial"] = [MENSAJE_PERSONALIDAD]

        # Process message with error handling
        try:
            respuesta = obtener_respuesta(user_message)
            session["historial"].append(f"Bot: {respuesta}")
            return jsonify({"response": respuesta})
            
        except Exception as e:
            print(f"Error en chat: {str(e)}")
            return jsonify({
                "error": "Error interno del servidor",
                "details": str(e)
            }), 500
            
    except Exception as e:
        return jsonify({
            "error": "Error en el formato de la solicitud",
            "details": str(e)
        }), 400

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    pregunta = data.get("mensaje", "")

    if not pregunta:
        return jsonify({"respuesta": "No entendí tu mensaje."})

    respuesta = obtener_respuesta(pregunta)  # Función que ya tienes

    return jsonify({"respuesta": respuesta})

if __name__ == "__main__":
    app.run(debug=True)