"use client";

import { useState } from "react";

export default function About() {
    const [selectedCity, setSelectedCity] = useState("Mérida");

    const locations = {
        "Mérida": {
            address: "C. 35 257, entre 12 y 14, Sta Maria Chuburná, 97138 Mérida, Yuc.",
            hours: "Lunes-Viernes: 8:30 am - 7:00 pm\nSábado: 8:30 am - 2:00 pm",
            image: "/images/mapa1.png" 
        },
        "Ciudad de México": {
            address: "Los Olivos, 13210 Ciudad de México, CDMX",
            hours: "Lunes-Viernes: 8:00 am - 6:00 pm\nSábado: 9:00 am - 2:00 pm",
            image: "/images/mapa2.png" 
        },
        "Querétaro": {
            address: "Dirección en Querétaro",
            hours: "Lunes-Viernes: 9:00 am - 6:00 pm\nSábado: 9:00 am - 2:00 pm"
        },
        "Cancún": {
            address: "Dirección en Cancún",
            hours: "Lunes-Viernes: 8:30 am - 6:00 pm\nSábado: 8:30 am - 2:00 pm"
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-gray-800 text-white p-6 rounded-lg dark:bg-slate-900">
                <h3 className="text-xl font-semibold flex items-center">
                    <span className="mr-2"></span> SOBRE NOSOTROS
                </h3>
            </div>
            <div className="text-center my-6 dark:text-white">
                <p className="text-lg">
                    <strong>Más de 30 años</strong> siendo un centro mayorista 
                    distribuidor de las mejores marcas automotrices...
                </p>
            </div>
            <div className="bg-gray-900 text-white p-6 rounded-lg text-center dark:bg-slate-900">
                <h4 className="text-lg font-semibold">DUDAS O SUGERENCIAS?</h4>
                <p>Contáctanos a través de nuestro correo</p>
                <button className="bg-blue-600 text-white px-4 py-2 mt-3 rounded-lg hover:bg-blue-700">
                    Contáctanos &gt;
                </button>
            </div>
            <div className="mt-8 border-t pt-6 dark:border-slate-700">
                <h4 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
                    NUESTRAS UBICACIONES Y HORARIOS
                </h4>
                <div className="flex flex-wrap justify-center space-x-4 text-blue-600 underline mt-4">
                    {Object.keys(locations).map(city => (
                        <button 
                            key={city}
                            onClick={() => setSelectedCity(city)}
                            className={`px-4 py-2 transition duration-300 ease-in-out transform hover:scale-105 ${selectedCity === city ? 'font-bold text-blue-800' : ''}`}
                        >
                            {city}
                        </button>
                    ))}
                </div>

                <div className="mt-6 text-center bg-gray-100 dark:bg-slate-800 dark:text-white p-4 rounded-lg shadow-md">
                    <p className="text-lg font-semibold"><strong>{locations[selectedCity].address}</strong></p>
                    <p className="text-gray-700 dark:text-gray-300">{locations[selectedCity].hours}</p>
                </div>
                {locations[selectedCity].image && (
                    <div className="mt-6 flex justify-center">
                        <img 
                            src={locations[selectedCity].image} 
                            alt={`Mapa de ${selectedCity}`} 
                            className="rounded-lg shadow-md w-full max-w-[300px] md:w-1/3" 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
