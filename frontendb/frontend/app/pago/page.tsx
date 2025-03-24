"use client";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Store, Truck, Coins, NotebookText } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import MetodoP from "@/components/Formulario_metodoP";

export default function Pago() {
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const opciones = [
      { id: 1, label: "Entrega a domicilio", icon: Truck },
      { id: 2, label: "Recoger en sucursal", icon: Store },
      { id: 3, label: "Venta mostrador (contado)", icon: Coins },
      { id: 4, label: "Múltiples facturas", icon: NotebookText },
  ];

  useEffect(() => {
    // Obtener los productos seleccionados desde localStorage
    const checkoutProducts = JSON.parse(localStorage.getItem("checkoutProducts") || "[]");
    
    // Si hay productos seleccionados, usarlos; de lo contrario, usar todos los productos del carrito
    if (checkoutProducts.length > 0) {
        setSelectedProducts(checkoutProducts);
    } else {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setSelectedProducts(storedCart);
    }
}, []);
  // Calcular total basado en los productos seleccionados en caso de que ya tengan los precios
  const subtotal = selectedProducts.reduce(
    (sum, producto) =>
      sum +
      (producto.precio_dto || producto.precio_pp) * (producto.cantidad || 1),
    0
  );
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return (
    <>
      {/* Main container */}
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4 md:gap-8 py-8">
        {/* Payment Method Section */}
        <div className="flex-1 border p-4 md:p-6 rounded-lg">
          <h3 className="text-xl md:text-2xl font-semibold mb-4">Comprar</h3>
          <Label className="w-full z-50 flex justify-center space-x-2 bg-sky-100 dark:bg-sky-900 py-3">
            Productos
          </Label>
          <div className="space-x-2 py-5">
            <Label>Método de pago</Label>
            

          </div>
          <MetodoP />

          <div className="flex justify-center items-center space-x-2 py-3 flex-wrap">
            {opciones.map((opcion) => {
              const isSelected = selected === opcion.id;
              return (
                <Button
                  key={opcion.id}
                  variant="ghost"
                  className={`w-full justify-start border-gray-300 ${
                    isSelected ? "text-blue-500" : "text-gray-900 dark:text-white"
                  }`}
                  onClick={() => setSelected(opcion.id)}
                >
                  <opcion.icon
                    className={`w-5 h-5 mr-2 ${
                      isSelected ? "text-blue-500" : "text-gray-700 dark:text-white"
                    }`}
                  />
                  {opcion.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="flex-1 border p-4 md:p-6 rounded-lg">
          <Label className="w-full flex justify-center space-x-2 bg-sky-100 dark:bg-sky-900 py-3 text-sm md:text-base">
            Tu pedido {selectedProducts.length > 0 ? `(${selectedProducts.length} productos)` : ''}
          </Label>

          <div className="space-y-4 md:space-y-6">
            <ScrollArea className="h-[300px] md:h-[400px]">
              {selectedProducts.length > 0 ? (
                selectedProducts.map((producto) => (
                  <div key={producto.id_producto} className="flex p-2 md:p-3 space-x-2 md:space-x-4 border-t border-b">
                    <img
                      src={producto.imagen || "/images/optimus.webp"}
                      className="w-16 md:w-20 h-16 md:h-20 object-contain flex-shrink-0"
                      alt={producto.descripcion}
                    />
                    <div className="flex-1">
                      <h2 className="text-sm font-bold text-gray-800 dark:text-white leading-tight line-clamp-3">
                        {producto.descripcion}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-white">
                        <strong>SKU:</strong> {producto.clave} &nbsp;&nbsp; <strong>Marca:</strong> {producto.marca}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-white">
                        <strong>Cantidad:</strong> {producto.cantidad || 1} &nbsp;&nbsp; <strong>Precio:</strong> ${producto.precio_dto || producto.precio_pp}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">No hay productos seleccionados</p>
                </div>
              )}
            </ScrollArea>

            {/* Total Section */}
            <div className="px-2 md:px-4 space-y-3">
              <div className="text-sm md:text-base space-y-2">
                <div className="flex justify-between">
                  <Label>Subtotal:</Label>
                  <Label className="md:text-right">${subtotal.toFixed(2)}</Label>
                </div>
                <div className="flex justify-between border-b py-3">
                  <Label>IVA:</Label>
                  <Label>${iva.toFixed(2)}</Label>
                </div>
                <div className="flex justify-between">
                  <Label>Total:</Label>
                  <Label>${total.toFixed(2)}</Label>
                </div>
              </div>
              <Link 
                href="/pago_realizado" 
                className={`${buttonVariants({ variant: "BotonVerde" })} w-full md:w-auto`}
              >
                Finalizar compra
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
