"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Arbol() {
  const router = useRouter();
  const [likedButtons, setLikedButtons] = useState({});
  const [quantityInputs, setQuantityInputs] = useState({});
  const [treeData, setTreeData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const addToCart = (producto) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const quantity = quantityInputs[producto.id_producto] || 1;
    
    const existingProductIndex = cart.findIndex((item) => item.id_producto === producto.id_producto);
    
    if (existingProductIndex === -1) {
      cart.push({...producto, cantidad: quantity});
    } else {
      cart[existingProductIndex].cantidad = quantity;
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleDirectBuy = (producto) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const quantity = quantityInputs[producto.id_producto] || 1;
    
    cart.push({...producto, cantidad: quantity});
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("checkoutProducts", JSON.stringify([{...producto, cantidad: quantity}]));
    
    router.push('/pago');
  };

  const addToFavorite = (producto) => {
    let favo = JSON.parse(localStorage.getItem("favoritos") || "[]");
    const existe = favo.some(item => item.id_producto === producto.id_producto);
    
    if (existe) {
      favo = favo.filter(item => item.id_producto !== producto.id_producto);
    } else {
      favo.push(producto);
    }
    
    localStorage.setItem("favoritos", JSON.stringify(favo));
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data recibida del backend:', data); // Ver la estructura de los datos

        const organized = data.reduce((acc, product) => {
          console.log('Procesando producto:', product); // Ver cada producto mientras se procesa
          const { marca, anio_fabricacion, sistema, familia } = product;
          
          if (!acc[marca]) acc[marca] = {};
          if (!acc[marca][anio_fabricacion]) acc[marca][anio_fabricacion] = {};
          if (!acc[marca][anio_fabricacion][sistema]) acc[marca][anio_fabricacion][sistema] = {};
          if (!acc[marca][anio_fabricacion][sistema][familia]) acc[marca][anio_fabricacion][sistema][familia] = [];
          
          acc[marca][anio_fabricacion][sistema][familia].push(product);
          return acc;
        }, {});

        console.log('Datos organizados:', organized);
        setTreeData(organized);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const renderProductCard = (product) => {
      return (
        <div className="border border-gray-200 rounded-lg shadow-sm p-4 dark:bg-slate-900">
          <div className="flex gap-4 items-center">
            <div className="w-1/4">
              <div className="h-15 bg-gray-100 rounded flex items-center justify-center">
                {product.imagen ? (
                  <img 
                    src={product.imagen} 
                    alt={product.nombre}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">Imagen no disponible</span>
                )}
              </div>
            </div>
            
            <div className="w-3/4 flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-2 mb-1">
                  {product.nombre}
                </h3>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  ${product.precio}
                </p>
              </div>
  
              <div className="flex gap-2 items-center">
                <button 
                  className={`${likedButtons[product.id_producto] ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
                  onClick={() => {
                    addToFavorite(product);
                    setLikedButtons(prev => ({
                      ...prev,
                      [product.id_producto]: !prev[product.id_producto]
                    }));
                    toast(likedButtons[product.id_producto] ? 
                      "Se ha eliminado el producto de favoritos." : 
                      "Se ha agregado el producto a favoritos.");
                  }}
                >
                  <Heart size={16} />
                </button>
                <Button
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-800 text-white text-xs"
                  onClick={() => {
                    addToCart(product);
                    toast("Producto agregado al carrito");
                  }}
                >
                  Agregar
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                  onClick={() => handleDirectBuy(product)}
                >
                  Comprar
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    };
  
  const renderTree = (nodes, parentId = '') => {
      return Object.entries(nodes).map(([key, value]) => {
        const currentId = parentId ? `${parentId}-${key}` : key;
        
        if (typeof value === 'object' && !Array.isArray(value)) {
          return (
            <TreeItem key={currentId} itemId={currentId} label={key}>
              {renderTree(value, currentId)}
            </TreeItem>
          );
        } else {
          return (
            <TreeItem 
              key={currentId} 
              itemId={currentId} 
              label={
                <div className="grid grid-cols-1 gap-4 w-full px-4">
                  {Array.isArray(value) && value.map((item) => (
                    <div key={`${currentId}-${item.id_producto}`} className="w-full max-w-[1200px] mx-auto">
                      {renderProductCard(item)}
                    </div>
                  ))}
                </div>
              }
            />
          );
        }
      });
    };
  
  if (isLoading) {
    return <div>Cargando datos del árbol...</div>;
  }
  
  if (Object.keys(treeData).length === 0) {
    return <div>No se encontraron datos para mostrar</div>;
  }
  
  return (
    <Box sx={{ 
      minHeight: 200,
      md: { minHeight: 352 },
      width: '100%', 
      maxWidth: '100vw',
      overflow: 'auto'
    }}>
      <SimpleTreeView>
        {renderTree(treeData)}
      </SimpleTreeView>
    </Box>
  );