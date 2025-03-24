"use client";
  
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "./ui/button";

const FiltroFamilia = () => {
    const router = useRouter();
    const [fabricante, setFabricante] = useState("");
    const [marca, setMarca] = useState("");
    const [familia, setFamilia] = useState("");
    const [tipofa, setTipoFa] = useState("");
    const [sistema, setSistema] = useState("");

    const FiltroFam = () => {
        const filtros = [fabricante, marca, familia, tipofa, sistema].filter(f => f).join(" ");

        if(!filtros) {
            console.warn("Debes de seleccionar al menos un filtro");
        }

        const query = encodeURIComponent(filtros);
        const url = `https://test-api.beta-autopartes.com/api/v1/products/search/0?query=${query}`;

        router.push(`/catalogo?query=${encodeURIComponent(filtros)}`);
    };
    
    return(
        <div className="flex flex-col md:flex-row gap-2 mt-4 mb-4 border p-4 rounded-lg shadow-md bg-white dark:bg-slate-900">
            <select className="border p-2 rounded dark:bg-slate-900 w-full md:w-auto mb-2 md:mb-0" onChange={(e) => setMarca(e.target.value)}>
                <option>Fabricante</option>
                <option>Seleccionar</option>
            </select>
            {/* Repeat same responsive classes for other selects */}
            <select className="border p-2 rounded dark:bg-slate-900 w-full md:w-auto mb-2 md:mb-0">
                <option>Marca</option>
                <option>Seleccionar</option>
            </select>
            <select className="border p-2 rounded dark:bg-slate-900 w-full md:w-auto mb-2 md:mb-0">
                <option>Familia</option>
                <option>Seleccionar</option>
            </select>
            <select className="border p-2 rounded dark:bg-slate-900 w-full md:w-auto mb-2 md:mb-0">
                <option>Tipo de familia</option>
                <option>Seleccionar</option>
            </select>
            <select className="border p-2 rounded dark:bg-slate-900 w-full md:w-auto mb-2 md:mb-0">
                <option>Sistema</option>
                <option>Seleccionar</option>
            </select>
            <Button 
                className="w-full md:w-auto px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded text-sm md:text-base"
                onClick={FiltroFam}
            >
                Buscar
            </Button>
        </div>
    );
}

export default FiltroFamilia;