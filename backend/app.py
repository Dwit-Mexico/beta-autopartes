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


# Replace buscar_producto_en_api with this new function
def buscar_producto(query):
    """Busca productos en la base de datos según la consulta del usuario."""
    try:
        conn = conectar_bd()
        if not conn:
            return "Error de conexión a la base de datos."

        cursor = conn.cursor(dictionary=True)
        
        # Primero buscar solo por nombre, marca o modelo
        consulta_nombre = """
        SELECT nombre, marca, modelo, anio_fabricacion, familia, 
               tipo_familia, sistema, stock, sku, precio
        FROM productos 
        WHERE LOWER(nombre) LIKE %s
           OR LOWER(marca) LIKE %s
           OR LOWER(modelo) LIKE %s
        """
        
        search_term = f"%{query.lower()}%"
        cursor.execute(consulta_nombre, (search_term, search_term, search_term))
        productos = cursor.fetchall()

        # Si hay más de 3 productos
        if len(productos) > 3:
            respuesta = "Encontré varios productos. Aquí tienes algunos:\n\n"
            for producto in productos[:5]:
                respuesta += f"📦 {producto['nombre']} - {producto['marca']} - {producto['modelo']} - SKU: {producto['sku']}\n"
            respuesta += "\nPuedes preguntarme usando el SKU específico para más detalles."
            return respuesta

        # Si no hay productos, intentar buscar por SKU
        if not productos and len(query) >= 4:  # Si la consulta podría ser un SKU
            consulta_sku = """
            SELECT nombre, marca, modelo, anio_fabricacion, familia, 
                   tipo_familia, sistema, stock, sku, precio
            FROM productos 
            WHERE LOWER(sku) LIKE %s
            LIMIT 1
            """
            cursor.execute(consulta_sku, (f"%{query.lower()}%",))
            productos = cursor.fetchall()

        cursor.close()
        conn.close()

        if not productos:
            return "No encontré ese producto en la tienda. ¿Podrías verificar el nombre o el SKU?"

        # Formatear resultados de manera simplificada
        datos_producto = "\n".join(
            [
                f"🛒 {producto['nombre']}\n"
                f"🏷️ Marca: {producto['marca']}\n"
                f"🚗 Modelo: {producto['modelo']}\n"
                f"💰 Precio: ${producto['precio']}\n"
                for producto in productos
            ]
        )
        
        # Generar respuesta ingeniosa con la IA
        modelo = genai.GenerativeModel("gemini-1.5-pro-002")
        prompt = f"Como Juan Carlos Bodoque, haz un comentario breve, amigable y carismático sobre este producto: {datos_producto}"
        respuesta_ai = modelo.generate_content(MENSAJE_PERSONALIDAD + "\n" + prompt)
        
        return f"{datos_producto}\n✨ {respuesta_ai.text.strip()}"

    except mysql.connector.Error as err:
        return f"❌ Error en la búsqueda: {err}"

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

def obtener_respuesta(pregunta):
    """Determina si la pregunta es sobre un producto o una duda general."""
    pregunta = limpiar_texto(pregunta)

    # Primera prioridad: comprobar si se trata de una consulta de SKU o de un SKU directo
    if 'sku' in pregunta.lower() or re.match(r'^[A-Z0-9]{8}$', pregunta.upper()):
        resultado = buscar_producto(pregunta)
        print("Resultado búsqueda SKU:", resultado)
        return resultado
    
    # Segunda prioridad: Verificar si se trata de stock o información de un producto específico
    if any(palabra in pregunta.lower() for palabra in [
        'busco', 'tienes', 'hay', 'necesito', 'quiero', 'precio', 
        'stock', 'modelo', 'marca', 'producto', 'parte', 'pieza', 'partes'  # Añadido 'partes'
    ]):
        # Extraer la marca o término de búsqueda después de palabras clave
        palabras = pregunta.split()
        for i, palabra in enumerate(palabras):
            if palabra in ['partes', 'parte', 'marca']:
                if i + 1 < len(palabras):
                    query = palabras[i + 1]
                    resultado = buscar_producto(query)
                    return resultado
        
        # Si no encuentra palabras clave específicas, buscar con la consulta completa
        resultado = buscar_producto(pregunta)
        if "No encontré" in resultado:
            return obtener_respuesta_ia(pregunta)
        return resultado
    
    # Tercera prioridad: Consultar promociones
    if any(palabra in pregunta.lower() for palabra in ['promocion', 'descuento', 'oferta']):
        try:
            return buscar_promociones()
        except:
            return obtener_respuesta_ia(pregunta)
    
    # Último recurso: utilizar IA para preguntas generales
    return obtener_respuesta_ia(pregunta)

# Función para consultar a la IA

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

        # Manejo de POST con envoltura de errores
        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"error": "Mensaje vacío"}), 400

        # Asegurarse de que la sesión exista
        if "historial" not in session:
            session["historial"] = [MENSAJE_PERSONALIDAD]

        # Mensaje de proceso con manejo de errores
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


#back que obtiene productos para el arbol

@app.route("/api/products", methods=["GET"])
def get_products_hierarchy():
    try:
        conn = conectar_bd()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)
        
        query = """
        SELECT DISTINCT marca, anio_fabricacion, sistema, familia, nombre, precio, imagen, id_producto
        FROM productos
        ORDER BY marca, anio_fabricacion, sistema, familia, nombre
        """
        
        cursor.execute(query)
        productos = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(productos)
        
    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)