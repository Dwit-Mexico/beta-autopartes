"use client";

import { useState, useEffect } from "react";
import ProductSearch from "@/components/FiltroVehiculo";
import { BrowserRouter } from "react-router-dom";
import Arbol from "@/components/Arbol";  
import BuscadorProductos from "@/components/Buscador";  
import FiltroFamilia from "@/components/FiltroFamilia";    


const images = [
  "/images/carhd5.jpg",
  "/images/carhd2.webp",
  "/images/carhd3.jpg",
  "/images/carhd4.jpg",
];

export default function Home() {

  

  const [activeTab, setActiveTab] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fix the changeTab function
  const changeTab = (index: number) => {
    setActiveTab(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000); // Cambiado a 6000 milisegundos
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <BrowserRouter>
        <div className="pt-4 flex flex-col items-center pb-16 py-10 px-4 sm:px-6 overflow-x-hidden">
          {/* Carrusel responsivo */}
          <div className="relative w-screen h-[250px] sm:h-[380px] -mx-4">
            {images.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover transform scale-100 hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  width={1920}
                  height={1080}
                  style={{
                    objectPosition: 'center',
                    imageRendering: 'high-quality'
                  }}
                />
                {/* Modern overlay with multiple gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-black/50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Content container with animated elements */}
                <div className="absolute inset-0 flex items-center justify-start px-8 sm:px-16">
                  <div className="max-w-2xl space-y-4">
                    <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight animate-fade-in-up">
                      ENCUENTRA LAS 
                      <span className="block text-blue-400">MEJORES MARCAS</span>
                    </h2>
                    <p className="text-gray-200 text-sm sm:text-base max-w-lg opacity-90">
                      Descubre nuestra selección premium de autopartes
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            ))}
            
            {/* Slide indicators */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? "bg-white w-6" 
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>

          <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center -mt-10 sm:-mt-20 lg:-mt-[80px]">
            {/* Contenedor de componentes */}
            <div className="w-full p-2 sm:p-4 text-center min-h-[300px] flex justify-center items-center mt-16 sm:mt-0">
              {activeTab === 0 && <BuscadorProductos />}
              {activeTab === 1 && <ProductSearch />}
              {activeTab === 2 && <FiltroFamilia />}
            </div>

            {/* Tabs responsivos */}
            <div className="w-full flex justify-center -mt-4 sm:-mt-16 lg:-mt-[80px] mx-auto">
              <div className="tabs flex flex-wrap gap-1 border rounded-lg shadow-md bg-white dark:bg-slate-900 p-1">
                <button className={`tab px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base transition-all ${
                  activeTab === 0 ? "font-bold border-b-2 border-blue-500" : "hover:bg-gray-50 dark:hover:bg-slate-800"
                }`} onClick={() => changeTab(0)}>
                  Texto
                </button>
                {/* Aplicar mismos cambios a los demás botones */}
                <button className={`tab px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base ${activeTab === 1 ? "font-bold border-b-2 border-blue-500" : ""}`} onClick={() => changeTab(1)}>
                  Vehículo
                </button>
                <button className={`tab px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base ${activeTab === 2 ? "font-bold border-b-2 border-blue-500" : ""}`} onClick={() => changeTab(2)}>
                  Familia
                </button>
                <button className={`tab px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base ${activeTab === 3 ? "font-bold border-b-2 border-blue-500" : ""}`} onClick={() => changeTab(3)}>
                  Arbol
                </button>
              </div>
            </div>

            {/* Árbol component below options */}
            {activeTab === 3 && (
              <div className="w-full mt-6">
                <Arbol />
              </div>
            )}
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}