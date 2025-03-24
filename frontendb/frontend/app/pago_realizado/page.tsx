"use client";

import React, { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function PagoRealizado() {
  // Generar números aleatorios para pedido y folio
  const [orderInfo, setOrderInfo] = useState({
    orderNumber: "",
    invoice: "",
    backorder: "No aplica",
  });
  
  // Estado para almacenar los productos del carrito
  const [cart, setCart] = useState([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    iva: 0,
    total: 0
  });
  
  useEffect(() => {
    // Genera números aleatorios al cargar el componente
    const randomOrderNum = Math.floor(100000 + Math.random() * 900000);
    const randomInvoice = Math.floor(10000 + Math.random() * 90000);
    
    setOrderInfo({
      orderNumber: `#P-${randomOrderNum}`,
      invoice: `AW-${randomInvoice}`,
      backorder: "No aplica",
    });
    
    // Obtener carrito desde localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    
    // Calcular totales basados en el carrito
    const subtotal = storedCart.reduce((sum, producto) => 
      sum + (producto.precio_dto || producto.precio_pp || 0) * (producto.cantidad || 1), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    
    setTotals({
      subtotal,
      iva,
      total
    });
    
    // Opcional: Limpiar el carrito después de completar el pedido
    // localStorage.removeItem("cart");
  }, []);

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="px-6 py-8">
          {/* Success Icon */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-bold text-center">¡Gracias por tu pedido!</h1>
          </div>

          {/* Order Info */}
          <div className="mb-6 text-gray-600 text-sm">
            <div className="flex py-1">
              <span className="w-36">Número de pedido:</span>
              <span className="font-medium">{orderInfo.orderNumber}</span>
            </div>
            <div className="flex py-1">
              <span className="w-36">Folio factura:</span>
              <span className="font-medium">{orderInfo.invoice}</span>
            </div>
            <div className="flex py-1">
              <span className="w-36">Folio backorder:</span>
              <span className="font-medium">{orderInfo.backorder}</span>
            </div>
          </div>

          {/* Order Items with ScrollArea */}
          <div className="mb-4">
            <h2 className="font-bold mb-2">Tu pedido</h2>
            
            <ScrollArea className="h-60">
              {cart.length > 0 ? (
                cart.map((producto) => (
                  <div key={producto.id_producto} className="flex px-3 space-x-4 border-t border-b py-3">
                    <img
                      src={producto.imagen || "/api/placeholder/100/100"}
                      width="100"
                      height="100"
                      alt={producto.descripcion}
                      className="object-contain"
                    />
                    <div className="flex-1">
                      <h2 className="text-sm font-bold text-gray-800 dark:text-white leading-tight line-clamp-3">
                        {producto.descripcion}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-white">
                        <strong>SKU:</strong> {producto.clave} &nbsp;&nbsp; <strong>Marca:</strong> {producto.marca}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-white">
                        <strong>Cantidad:</strong> {producto.cantidad || 1} &nbsp;&nbsp; <strong>Precio:</strong> ${producto.precio_dto || producto.precio_pp || 0}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">No hay productos en tu pedido</div>
              )}
            </ScrollArea>
          </div>

          {/* Totals */}
          <div className="px-3 pb-2">
            <div className="text-sm text-gray-600 dark:text-white p-3 space-y-3">
              <div className="flex justify-between">
                <Label>Subtotal:</Label>
                <Label>${totals.subtotal.toFixed(2)}</Label>
              </div>
              <div className="flex justify-between border-b py-3">
                <Label>IVA:</Label>
                <Label>${totals.iva.toFixed(2)}</Label>
              </div>
              <div className="flex justify-between">
                <Label>Total:</Label>
                <Label>${totals.total.toFixed(2)}</Label>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-6 pb-6">
          <Link href="/" passHref>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Continuar comprando
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}