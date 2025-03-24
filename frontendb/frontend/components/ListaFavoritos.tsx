"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const favoritos = () => {
  const [favoritos, setFavoritos] = useState<Producto[]>([]);
  favoritos.map((producto) => console.log(producto.nombre)); // ✅ Funciona
}
useEffect(() => {
  const carritoGuardado = localStorage.getItem("carrito") ?? "[]";
  const carrito = JSON.parse(carritoGuardado);
  

}, []);
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

const agregarAFavoritos = (producto: Producto) => {
  console.log(producto.nombre, producto.precio, producto.cantidad, producto.id);  
};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productos.map((producto) => (
        <div
          key={producto.id_producto}
          className="border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full h-auto pb-4 dark:bg-slate-900"
        >
          <div className="p-3 pb-2 min-h-[80px]">
            <div className="flex justify-between items-start">
              <div className="flex-1 overflow-hidden">
                <h2 className="text-sm font-bold text-gray-800 dark:text-white leading-tight line-clamp-3">
                  {producto.descripcion}
                </h2>
              </div>
              <button
                className={`ml-2 ${
                  favoritos[producto.id_producto] ? "text-red-500" : "text-gray-400"
                } hover:text-red-500`}
                onClick={() => toggleLike(producto.id_producto)}
              >
                <Heart size={18} />
              </button>
            </div>
          </div>

          {/* Imagen */}
          <div className="px-3">
            <img
              src={producto.imagen}
              width="150"
              height="100"
              alt={producto.descripcion}
              className="w-full object-contain h-48"
            />
          </div>

          <div className="px-3 mt-1">
            <p className="text-sm font-medium text-green-600">Disponibilidad</p>
          </div>

          <div className="px-3 py-2">
            <p className="text-lg text-gray-500 line-through dark:text-white">
              ${producto.precio_pp}
            </p>
            <div className="flex items-center">
              <p className="text-xl font-bold text-gray-800 mr-2 dark:text-white">
                ${producto.precio_dto}
              </p>
              <p className="text-lg font-medium text-amber-500">¡OFERTA!</p>
            </div>
          </div>

          <div className="px-3 pb-2">
            <p className="text-sm text-gray-600 dark:text-white">
              SKU: {producto.clave} &nbsp;&nbsp; Marca: {producto.marca}
            </p>
          </div>

          <div className="px-3 pb-2 flex items-center">
            <p className="text-sm mr-2">Cantidades</p>
            <input
              type="number"
              min="1"
              value={quantities[producto.id_producto] || 1}
              onChange={(e) => handleQuantityChange(producto.id_producto, e.target.value)}
              className="border border-gray-300 rounded w-16 px-2 py-1 text-sm"
            />
          </div>

          <div className="px-3 pb-3">
            <div className="flex gap-2 mb-2">
              <Button
                className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 px-2 rounded text-sm"
                onClick={() => addToCart(producto)}
              >
                Agregar al carrito
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-2 rounded text-sm uppercase"
                onClick={() => console.log("Compra directa")}
              >
                Comprar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaFavoritos;
