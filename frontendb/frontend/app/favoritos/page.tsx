"use client";
import React from "react";
import BuscadorProductos from "@/components/Buscador";
import Equivalencias from "@/components/Equivalencias";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function favoritos() {
    const router = useRouter();
    const [favoritos, setFavoritos] = useState([]);
    const [likedButtons, setLikedButtons] = useState({});
    const [quantityInputs, setQuantityInputs] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favoritos") || "[]");
        setFavoritos(storedFavorites);
        
        const initialLikedState = {};
        storedFavorites.forEach(item => {
            initialLikedState[item.id_producto] = true;
        });
        setLikedButtons(initialLikedState);
    }, []);

    const handleQuantityChange = (productId, value) => {
        setQuantityInputs(prev => ({
            ...prev,
            [productId]: parseInt(value, 10) || 1
        }));
    };

    // eliminar favoritos
    const removeFromFavorite = (producto) => {
        const updatedFavorites = favoritos.filter(item => item.id_producto !== producto.id_producto);
    
        setFavoritos(updatedFavorites);
        
        // actualiza localStorage
        localStorage.setItem("favoritos", JSON.stringify(updatedFavorites));
        
        setLikedButtons(prev => ({
            ...prev,
            [producto.id_producto]: false
        }));
    };
    
    const addToCart = (producto) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const quantity = quantityInputs[producto.id_producto] || 1;
        
       
        const existingProductIndex = cart.findIndex((item) => item.id_producto === producto.id_producto);
        
        if (existingProductIndex === -1) {
           
            cart.push({
                id_producto: producto.id_producto,
                descripcion: producto.descripcion,
                imagen: producto.imagen,
                precio_pp: producto.precio_pp,
                precio_dto: producto.precio_dto,
                clave: producto.clave,
                marca: producto.marca,
                cantidad: quantity
            });
        } else {
            
            cart[existingProductIndex].cantidad = quantity;
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
    };


    const handleDirectBuy = (producto) => {
        addToCart(producto);
        router.push('/pago');
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = favoritos.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className="container mx-auto p-4 space-x-20 py-15">
                <h1 className="text-2xl font-semibold mb-6">Mis Productos Favoritos</h1>
                <div className="container mx-auto p-4">
                    {favoritos.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-xl mb-4">No tienes productos favoritos guardados</p>
                            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/robot-triste-11881816-9692903.png?f=webp" alt="fav lost" className="mx-auto" width="120" height="120" />
                            <Button 
                                className="bg-blue-600 hover:bg-blue-700 mt-4"
                                onClick={() => router.push('/')}
                            >
                                Ir al Inicio
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {currentItems.map((producto) => (
                                <div key={producto.id_producto} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full h-auto pb-4 dark:bg-slate-900">
                                    <div className="p-3 pb-2 min-h-[80px]">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 overflow-hidden">
                                                <h2 className="text-sm font-bold text-gray-800 dark:text-white leading-tight line-clamp-3">
                                                    {producto.descripcion}
                                                </h2>
                                            </div>
                                            <button 
                                                className="ml-2 text-red-500 hover:text-red-700"
                                                onClick={() => {
                                                    removeFromFavorite(producto);
                                                    toast("Se ha eliminado el producto de favoritos.", {
                                                        description: "Producto eliminado de favoritos.",
                                                    });
                                                }}
                                            >
                                                <Heart size={18} />
                                            </button>
                                        </div>
                                    </div>

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
                                        <p className="text-sm font-medium text-green-600">
                                            Disponibilidad
                                        </p>
                                    </div>
                                    <div className="px-3 py-2">
                                        <p className="text-lg text-gray-500 line-through dark:text-white">
                                            ${producto.precio_pp}
                                        </p>
                                        <div className="flex items-center">
                                            <p className="text-xl font-bold text-gray-800 mr-2 dark:text-white">
                                                ${producto.precio_dto}
                                            </p>
                                            <p className="text-lg font-medium text-amber-500">
                                                ¡OFERTA!
                                            </p>
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
                                            defaultValue="1"
                                            onChange={(e) => handleQuantityChange(producto.id_producto, e.target.value)}
                                            className="border border-gray-300 rounded w-16 px-2 py-1 text-sm"
                                        />
                                    </div>
                                    <div className="px-3 pb-3">
                                        <div className="flex gap-2 mb-2">
                                            <Button
                                                className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 px-2 rounded text-sm"
                                                onClick={() => {
                                                    addToCart(producto);
                                                    toast("Se ha agregado el producto al carrito.", {
                                                        description: `Producto agregado al carrito (${quantityInputs[producto.id_producto] || 1} unidades).`,
                                                    });
                                                }}
                                            >
                                                Agregar al carrito
                                            </Button>
                                            <Button 
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-2 rounded text-sm uppercase"
                                                onClick={() => handleDirectBuy(producto)}
                                            >
                                                Comprar
                                            </Button>
                                        </div>
                                        <Equivalencias />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}