"use client";   

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Carrito = () => {
    const [carrito, setCarrito] = useState<Producto[]>([]);
    carrito.map((producto) => console.log(producto.nombre)); // ✅ Funciona

  // Cargar carrito desde localStorage al iniciar
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

  // Agregar producto al carrito
  const agregarAlCarrito = (producto: Producto) => {
    console.log(producto.nombre, producto.precio, producto.cantidad, producto.id);
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>
      <Button onClick={() => agregarAlCarrito({ id: 10, nombre: "subete a mi motora", precio: 10000,  cantidad: 3  })}>
        Agregar Producto A
      </Button>
      <ul>
        {carrito.map((item, index) => (
          <li key={index}>{item.nombre} - ${item.precio}</li>
        ))}
      </ul>
    </div>
  );
};

export default Carrito;
