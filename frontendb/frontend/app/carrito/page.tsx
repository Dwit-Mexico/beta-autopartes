"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Carrito() {
    const [cart, setCart] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
        
        // Detectar tamaño de pantalla inicial
        handleResize();
        
        // Agregar event listener para detectar cambios en el tamaño de pantalla
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Función para detectar tamaño de pantalla
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    // Función para seleccionar todos los productos
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allProductIds = cart.map(producto => producto.id_producto);
            setSelectedProducts(allProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    // Función para seleccionar un producto individual
    const handleProductSelect = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    // Función para eliminar un producto del carrito
    const removeFromCart = (id) => {
        const updatedCart = cart.filter((producto) => producto.id_producto !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        // Actualizar los productos seleccionados
        setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    };

    // Función para eliminar múltiples productos seleccionados
    const removeSelectedFromCart = () => {
        if (selectedProducts.length === 0) return;
        
        const updatedCart = cart.filter((producto) => !selectedProducts.includes(producto.id_producto));
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setSelectedProducts([]);
    };

    // Función para actualizar la cantidad
    const updateQuantity = (id, change) => {
        const updatedCart = cart.map((producto) => {
            if (producto.id_producto === id) {
                return { ...producto, cantidad: Math.max((producto.cantidad || 1) + change, 1) };
            }
            return producto;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Función para agregar productos similares al carrito
    const addSimilarToCart = (articulo) => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        
        // Verificar si el producto ya está en el carrito
        const existingProductIndex = storedCart.findIndex((item) => item.id_producto === articulo.id);
        
        if (existingProductIndex === -1) {
            // Producto nuevo, agregar al carrito
            storedCart.push({
                id_producto: articulo.id,
                descripcion: articulo.nombre,
                imagen: articulo.imagen,
                precio_pp: articulo.precio,
                precio_dto: articulo.precio,
                clave: `SIM-${articulo.id}`,
                marca: "Similar",
                cantidad: 1
            });
        } else {
            // Producto existente, incrementar cantidad
            storedCart[existingProductIndex].cantidad += 1;
        }
        
        localStorage.setItem("cart", JSON.stringify(storedCart));
        setCart(storedCart);
    };

    // Función para compra directa de artículos similares
    const handleDirectBuy = (articulo) => {
        // Primero agregamos al carrito
        addSimilarToCart(articulo);
        // Redirección a la página de pago
        window.location.href = "/pago";
    };

    const handleProceedToCheckout = () => {
        if (selectedProducts.length === 0) {
            // Si no hay productos seleccionados, enviar todos los productos del carrito
            localStorage.setItem("checkoutProducts", JSON.stringify(cart));
        } else {
            // Filtrar los productos seleccionados
            const checkoutProducts = cart.filter(producto => selectedProducts.includes(producto.id_producto));
            localStorage.setItem("checkoutProducts", JSON.stringify(checkoutProducts));
        }
        
        // Redirección a la página de pago
        window.location.href = "/pago";
    };

    const articulosSimilares = [
        {
            id: 101,
            nombre: "INFLALLANTAS UNIVERSAL 341 G QUIMICA TF CAJA 12 PZAS ()",
            precio: 0,
            imagen: "/images/art.jpg"
        },
        {
            id: 102,
            nombre: "BALATA SEMI METALICA DELANTERA DODGE TRUCK D150 ()",
            precio: 0,
            imagen: "/images/art2.jpg"
        },
        {
            id: 103,
            nombre: "BALATA SEMI METALICA DELANTERA FORD TOPAZ 1984-1994  ()",
            precio: 0,
            imagen: "/images/art3.jpg"
        }
    ];

    // Calcular precios
    const subtotal = cart.reduce((sum, producto) => sum + (producto.precio_dto || producto.precio_pp) * (producto.cantidad || 1), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    
    // Verificar si el carrito está vacío
    const carritoVacio = cart.length === 0;

    // Vista de tabla (diseño original) para pantallas grandes
    const TablaCarrito = () => (
        <table className="w-full">
            <thead className="border-b">
                <tr className="dark:bg-sky-900">
                    <th className="w-8 p-3 text-left font-normal text-gray-500 dark:text-white">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4" 
                            checked={selectedProducts.length === cart.length && cart.length > 0}
                            onChange={handleSelectAll}
                            disabled={carritoVacio}
                        />
                    </th>
                    <th className="text-left p-3 font-normal text-gray-500 dark:text-white">Productos</th>
                    <th className="text-center p-3 font-normal text-gray-500 dark:text-white">Cantidad</th>
                    <th className="text-center p-3 font-normal text-gray-500 dark:text-white">Estado de existencias</th>
                    <th className="text-right p-3 font-normal text-gray-500 dark:text-white">Precio</th>
                </tr>
            </thead>      
            {carritoVacio ? (
                <tbody>
                    <tr>
                        <td colSpan="5">
                            <div className="flex flex-col items-center justify-center h-96 w-full text-center">
                                <img src="https://farm8.staticflickr.com/7881/31914878607_25f295492a_o.gif" 
                                alt="Carrito vacío" 
                                className="w-40 h-40"/>
                                <Label className="mt-4 text-lg dark:text-white">El carrito está vacío</Label>
                            </div>
                        </td>
                    </tr>
                </tbody>
            ) : (                 
            <tbody>
                {cart.map((producto) => (
                    <tr key={producto.id_producto} className="border-b">
                        <td className="p-3">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4"
                                checked={selectedProducts.includes(producto.id_producto)}
                                onChange={() => handleProductSelect(producto.id_producto)}
                            />
                        </td>
                        <td className="p-3">
                            <div className="flex items-start">
                                <div className="w-16 h-16 mr-3 bg-gray-100 p-1 flex items-center justify-center">
                                    <img src={producto.imagen} alt={producto.descripcion} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="font-medium text-xs">{producto.descripcion}</p>
                                    <div className="text-xs text-gray-600 mt-1 dark:text-white">
                                        <p>Clave: <span className="font-semibold">{producto.clave}</span></p>
                                        <p>Marca: <span className="font-semibold">{producto.marca}</span></p>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="p-3">
                            {producto.disponible !== false ? (
                                <div className="flex flex-col items-center justify-center">
                                    <div className="flex items-center">
                                        <button 
                                            className="px-2 py-1 border border-gray-300 bg-gray-50 rounded-l hover:bg-gray-100 dark:bg-slate-900"
                                            onClick={() => updateQuantity(producto.id_producto, -1)}
                                        >
                                            −   
                                        </button>
                                        <input 
                                            type="text" 
                                            value={producto.cantidad || 1} 
                                            className="w-8 py-1 text-center border-t border-b border-gray-300" 
                                            readOnly 
                                        />
                                        <button 
                                            className="px-2 py-1 border border-gray-300 bg-gray-50 rounded-r hover:bg-gray-100 dark:bg-slate-900"
                                            onClick={() => updateQuantity(producto.id_producto, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="flex items-center mt-1 text-gray-400 text-xs">
                                        <Button variant="outline" onClick={() => removeFromCart(producto.id_producto)}>
                                            <Trash2 className="mr-1" /> Eliminar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700">
                                        AVISENME!
                                    </button>
                                </div>
                            )}
                        </td>
                        <td className="p-3 text-center">
                            <span className={`font-medium text-sm ${producto.disponible !== false ? "text-green-600" : "text-red-600"}`}>
                                {producto.disponible !== false ? "Disponible" : "Sin disponibilidad"}
                            </span>
                        </td>
                        <td className="p-3 text-right">
                            {producto.precio_pp && (
                                <div className="line-through text-gray-400">
                                    ${(producto.precio_pp || 0).toFixed(2)}
                                </div>
                            )}
                            <div className="font-medium">
                                ${(producto.precio_dto || producto.precio_pp || 0).toFixed(2)}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            )}
        </table>
    );

    // Vista de tarjetas (diseño responsivo) para pantallas pequeñas
    const TarjetasCarrito = () => (
        <ScrollArea className="h-96">
            {carritoVacio ? (
                <div className="flex flex-col items-center justify-center h-96 w-full text-center">
                    <img src="https://farm8.staticflickr.com/7881/31914878607_25f295492a_o.gif" 
                    alt="Carrito vacío" 
                    className="w-40 h-40"/>
                    <Label className="mt-4 text-lg dark:text-white">El carrito está vacío</Label>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                    {cart.map((producto, index) => (
                        <div key={`${producto.id_producto}-${index}`} className="bg-white rounded-lg shadow p-4 dark:bg-slate-900">
                            <div className="flex items-start space-x-2">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 mt-1"
                                    checked={selectedProducts.includes(producto.id_producto)}
                                    onChange={() => handleProductSelect(producto.id_producto)}
                                />
                                <div className="flex-1">
                                    <div className="flex justify-center mb-3">
                                        <img src={producto.imagen} alt={producto.descripcion} className="w-24 h-24 object-contain" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium text-sm">{producto.descripcion}</p>
                                        <p className="text-xs text-gray-600 dark:text-white">Clave: <span className="font-semibold">{producto.clave}</span></p>
                                        <p className="text-xs text-gray-600 dark:text-white">Marca: <span className="font-semibold">{producto.marca}</span></p>
                                        
                                        <div className="flex justify-center items-center mt-2">
                                            <button 
                                                className="px-2 py-1 border border-gray-300 bg-gray-50 rounded-l hover:bg-gray-100 dark:bg-slate-900"
                                                onClick={() => updateQuantity(producto.id_producto, -1)}
                                            >
                                                −   
                                            </button>
                                            <input 
                                                type="text" 
                                                value={producto.cantidad || 1} 
                                                className="w-8 py-1 text-center border-t border-b border-gray-300" 
                                                readOnly 
                                            />
                                            <button 
                                                className="px-2 py-1 border border-gray-300 bg-gray-50 rounded-r hover:bg-gray-100 dark:bg-slate-900"
                                                onClick={() => updateQuantity(producto.id_producto, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <div className="mt-2">
                                            <Button variant="outline" size="sm" onClick={() => removeFromCart(producto.id_producto)}>
                                                <Trash2 className="mr-1 h-3 w-3" /> Eliminar
                                            </Button>
                                        </div>
                                        
                                        <div className="mt-2">
                                            <span className={`font-medium text-sm ${producto.disponible !== false ? "text-green-600" : "text-red-600"}`}>
                                                {producto.disponible !== false ? "Disponible" : "Sin disponibilidad"}
                                            </span>
                                        </div>
                                        
                                        // En la vista de tarjetas, actualiza la sección de precio
                                        <div className="font-medium mt-2">
                                            ${(producto.precio_dto || producto.precio_pp || 0).toFixed(2)}
                                        </div>
                                        
                                        // En la sección de artículos similares, actualiza el precio
                                        <p className="font-bold text-sm mb-2">
                                            ${(articulo.precio || 0).toFixed(2)}
                                        </p>
                                        
                                        // En el cálculo del subtotal, agrega verificación
                                        const subtotal = cart.reduce((sum, producto) => 
                                            sum + ((producto.precio_dto || producto.precio_pp || 0) * (producto.cantidad || 1)), 0
                                        );
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
    );

    // También en la sección de artículos similares
    {articulosSimilares.map((articulo, index) => (
        <div key={`similar-${articulo.id}-${index}`} className="bg-white rounded shadow overflow-hidden relative dark:bg-slate-900 w-full max-w-xs">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
            <div className="p-2 flex justify-center bg-gray-100 h-32">
                <img src={articulo.imagen} alt={articulo.nombre} className="h-full object-contain" />
            </div>
            <div className="p-2">
                <h3 className="text-xs font-medium mb-1 line-clamp-2" title={articulo.nombre}>
                    {articulo.nombre}
                </h3>
                <p className="font-bold text-sm mb-2">${articulo.precio.toFixed(2)}</p>
                <div className="flex gap-1 mt-1">
                    <button 
                        className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-1 px-1 rounded text-xs"
                        onClick={() => addSimilarToCart(articulo)}
                    >
                        Agregar
                    </button>
                    <button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-1 rounded text-xs uppercase"
                        onClick={() => handleDirectBuy(articulo)}
                    >
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    ))}
            return (
                <div className="container mx-auto p-4 mt-10">
                    <div className={`flex ${isMobile ? 'flex-col' : 'lg:flex-row'} gap-4`}>
                        <div className="flex-grow bg-white rounded-lg shadow dark:bg-slate-900">
                            <div className="flex justify-between items-center border-b p-3">
                                <div className="flex items-center">
                                    {/* Espacio para otros elementos de la barra superior */}
                                </div>
                                {selectedProducts.length > 0 && (
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        onClick={removeSelectedFromCart}
                                        className="flex items-center"
                                    >
                                        <Trash2 className="mr-1 h-4 w-4" /> Eliminar ({selectedProducts.length})
                                    </Button>
                                )}
                            </div>
                            
                            {/* Renderizar tabla o tarjetas según el tamaño de pantalla */}
                            {isMobile ? <TarjetasCarrito /> : <TablaCarrito />}
                        </div>
                    
                        {/* Sección del total */}
                        <div className={`${isMobile ? 'w-full' : 'w-100 h-70'} bg-white rounded-lg shadow dark:bg-slate-900`}>
                            <div className="bg-gray-900 text-white p-3 font-medium dark:bg-sky-900">
                                Total carrito
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between py-2 border-b">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>IVA:</span>
                                    <span className="font-medium">${iva.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-3 text-lg font-semibold mt-2">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <button 
                                    onClick={handleProceedToCheckout}
                                    className={`${buttonVariants({ variant: "BotonVerde" })} w-full ${carritoVacio ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={carritoVacio}
                                >
                                    Proceder al Pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }