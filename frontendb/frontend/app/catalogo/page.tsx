"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import FiltroCatalogo from "@/components/filtrocat";
import { toast } from "sonner"
import Equivalencias from "@/components/Equivalencias";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import BuscadorProductos from "@/components/Buscador";
import FavoritosSwitch from "@/components/FavoritosSwitch";

function Catalogo() {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [likedButtons, setLikedButtons] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedFavorites = localStorage.getItem("favoritos");
            if (storedFavorites) {
                const favorites = JSON.parse(storedFavorites);
                return favorites.reduce((acc, fav) => ({
                    ...acc,
                    [fav.id_producto]: true
                }), {});
            }
        }
        return {};
    });
    const [quantityInputs, setQuantityInputs] = useState({});    
    const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
// Load favorites from localStorage on component mount
useEffect(() => {
    const storedFavorites = localStorage.getItem("favoritos");
    if (storedFavorites) {
        setLikedButtons(JSON.parse(storedFavorites));
    }
}, []);

  // Filtrar productos favoritos
  const filtrarFavoritos = (productos) => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos") || []);
    return productos.filter(producto => 
        favoritos.some(fav => fav.id_producto === producto.id_producto)
    );
};

    const toggleLike = (buttonId) => {
        setLikedButtons((prev) => ({
            ...prev,
            [buttonId]: !prev[buttonId],
        }));
    };
    
    const [productos, setProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

    useEffect(() => {
        if (!query) return;

        setIsLoading(true); // Start loading
        fetch(`https://test-api.beta-autopartes.com/api/v1/products/search/0?query=${encodeURIComponent(query)}`)
            .then((res) => res.json())
            .then((data) => setProductos(data))
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false)); // End loading
    }, [query]); // Se ejecuta cada vez que cambia query

        // Productos mostrados (filtrados o no)
        const productosMostrados = mostrarSoloFavoritos 
        ? filtrarFavoritos(productos) 
        : productos;

      // Paginación
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = productosMostrados.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(productos.length / itemsPerPage);
    const pageRange = 2; 

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - pageRange && i <= currentPage + pageRange)) {
                pages.push(i);
            } else if (i === currentPage - (pageRange + 1) || i === currentPage + (pageRange + 1)) {
                pages.push("...");
            }
        }
        return pages;
    };


    // Handle quantity change
    const handleQuantityChange = (productId, value) => {
        setQuantityInputs(prev => ({
            ...prev,
            [productId]: parseInt(value, 10) || 1
        }));
    };

    //funcion para agregar a favoritos
    const addToFavorite = (producto) => {
        // Obtener favoritos de localStorage y asegurarse de que sea un array
    let favo = localStorage.getItem("favoritos");

    try {
        favo = favo ? JSON.parse(favo) : [];
    } catch (error) {
        console.error("Error al parsear favoritos:", error);
        favo = []; // Si hay un error, inicializar como array vacío
    }

    // Asegurar que favo sea un array
    if (!Array.isArray(favo)) {
        favo = [];
    }

    // Buscar si el producto ya está en favoritos
    const existe = favo.some(item => item.id_producto === producto.id_producto);

    if (existe) {
        // Si existe, eliminarlo
        favo = favo.filter(item => item.id_producto !== producto.id_producto);
        console.log("Producto eliminado de favoritos:", producto.id_producto);
    } else {
        // Si no existe, agregarlo
        favo.push({
            id_producto: producto.id_producto,
            descripcion: producto.descripcion,
            imagen: producto.imagen,
            precio_pp: producto.precio_pp,
            precio_dto: producto.precio_dto,
            clave: producto.clave,
            marca: producto.marca,
        });
        console.log("Producto agregado a favoritos:", producto.id_producto);
    }

    // Guardar la nueva lista en localStorage
    localStorage.setItem("favoritos", JSON.stringify(favo));

    // Mostrar en consola para depuración
    console.log("Favoritos actualizados:", localStorage.getItem("favoritos"));
    };

    // Función para agregar al carrito
    const addToCart = (producto) => {
        const cart = JSON.parse((localStorage.getItem("cart") as string) || "[]");


        
        const quantity = quantityInputs[producto.id_producto] || 1;
    
        // Verifica si el producto ya está en el carrito
        const existingProductIndex = cart.findIndex((item) => item.id_producto === producto.id_producto);
    
        if (existingProductIndex === -1) {
            // Producto nuevo, agregar al carrito
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
            // Producto existente, actualizar cantidad
            cart[existingProductIndex].cantidad = quantity;
        }
    
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log(localStorage.getItem("cart"));
    };

    // Función para comprar directamente
    const handleDirectBuy = (producto) => {
        const cart = JSON.parse((localStorage.getItem("cart") as string) || "[]");
        const quantity = quantityInputs[producto.id_producto] || 1;
    
        // Verificar si el producto ya está en el carrito
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
            // Producto existente, actualizar cantidad
            cart[existingProductIndex].cantidad = quantity;
        }
    
        // Guardar el carrito en localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
    
        // Guardar el producto seleccionado en checkoutProducts
        localStorage.setItem("checkoutProducts", JSON.stringify([{
            id_producto: producto.id_producto,
            descripcion: producto.descripcion,
            imagen: producto.imagen,
            precio_pp: producto.precio_pp,
            precio_dto: producto.precio_dto,
            clave: producto.clave,
            marca: producto.marca,
            cantidad: quantity
        }]));
    
        // Redirigir a la página de pago
        router.push('/pago');
    };
    // In your catalog page component
useEffect(() => {
  const handleFavoritosToggle = (event) => {
    const { mostrarSoloFavoritos } = event.detail;
    setMostrarSoloFavoritos(mostrarSoloFavoritos);
  };

  // Only add event listeners in the browser environment
  if (typeof window !== 'undefined') {
    window.addEventListener('toggleLike', handleFavoritosToggle);
    
    return () => {
      window.removeEventListener('toggleLike', handleFavoritosToggle);
    };
  }
}, []);

    return (
        <>
        <div className="mt-3 md:mt-8 flex justify-end px-4 md:px-8 lg:px-12">
            <div className="w-full max-w-md ml-auto">
                <BuscadorProductos />
            </div>
        </div>
            <div className="container mx-auto p-4 ">
            <div className="flex items-center space-x-2">
            <FavoritosSwitch 
                        mostrarSoloFavoritos={mostrarSoloFavoritos}
                        onToggle={() => setMostrarSoloFavoritos(!mostrarSoloFavoritos)}
                    />
            </div>
                <div className="flex flex-col md:flex-row gap-6">
                    
                    <FiltroCatalogo />

                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {isLoading ? (
                                <div className="col-span-full md:col-span-1 flex md:justify-start justify-center">
                                    <div className="flex flex-col space-y-3">
                                        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                </div>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((producto) => (
                                    <div key={producto.id_producto} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full h-auto pb-4 dark:bg-slate-900">
                                        <div className="p-3 pb-2 min-h-[80px]">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 overflow-hidden">
                                                    <h2 className="text-sm font-bold text-gray-800 dark:text-white leading-tight line-clamp-3">
                                                        {producto.descripcion}
                                                    </h2>
                                                </div>
                                                <button 
    className={`ml-2 ${likedButtons[producto.id_producto] ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
    onClick={() => {
        // Add to favorites
        addToFavorite(producto);

        // Update the likedButtons state to reflect the change
        setLikedButtons(prev => ({
            ...prev,
            [producto.id_producto]: !prev[producto.id_producto]
        }));

        // Show toast notification with Undo action
        toast(likedButtons[producto.id_producto] ? 
            "Se ha eliminado el producto de favoritos." : 
            "Se ha agregado el producto a favoritos.", {
            description: likedButtons[producto.id_producto] ? 
                "Producto eliminado de favoritos." : 
                "Producto agregado a favoritos.",
            action: {
                label: "Ir a favoritos",
                onClick: () => router.push('/favoritos'),
            },
        });
    }}
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
                                                alt="Rotor distribuidor"
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
                                        <div className="px-3 pb-2 flex items-center justify-between">
    <p className="text-sm text-gray-600 dark:text-white whitespace-nowrap">
        SKU: {producto.clave}
    </p>
    <p className="text-sm text-gray-600 dark:text-white truncate max-w-[150px] text-right">
        Marca: {producto.marca}
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
                                ))
                            ) : (
                                <div className="col-span-full flex justify-center">
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        No se encontró el producto
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {productos.length > 0 ? (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) {
                                        paginate(currentPage - 1);
                                    }
                                }}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>

                        {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index}>
                                {page === "..." ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            paginate(page);
                                        }}
                                        isActive={currentPage === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < totalPages) {
                                        paginate(currentPage + 1);
                                    }
                                }}
                                disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            ) : null}
        </>
    );
}

export default Catalogo;