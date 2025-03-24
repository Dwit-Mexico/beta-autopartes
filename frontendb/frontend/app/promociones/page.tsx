import React from 'react';

export default function Promociones() {
  return (
    <div className="container mx-auto p-4">
      <div className="p-4 mt-5 mb-5 rounded-t-lg bg-gray-100 shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">PROMOCIONES ESPECIALES</h2>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <img 
            src="/images/pro1.png" 
            alt="Promoción principal" 
            className="w-full object-cover rounded-lg shadow-lg"
          />
          <div className="p-4 text-center bg-white rounded-b-lg shadow-md">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Oferta Especial del Mes</h3>
            <p className="text-gray-700">Aprovecha nuestras mejores promociones diseñadas especialmente para ti.</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mx-auto">
          <div className="bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800">DESTACADO</div>
          <img 
            src="/images/pro3.webp" 
            alt="Promoción 1"
            className="w-full h-48 object-cover"
          />
          <div className="p-3">
            <p className="text-gray-600 text-sm mb-2">Descripción breve de la promoción disponible.</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden mx-auto">
          <div className="bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800">DESTACADO</div>
          <img 
            src="/images/pro4.webp" 
            alt="Promoción 2"
            className="w-full h-48 object-cover"
          />
          <div className="p-3">
            <p className="text-gray-600 text-sm mb-2">Descripción breve de la promoción disponible.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
