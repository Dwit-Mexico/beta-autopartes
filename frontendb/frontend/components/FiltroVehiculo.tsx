"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "./ui/button";
const ProductSearch = () => {
    const router = useRouter(); 
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [año, setAño] = useState("");
    const [familia, setFamilia] = useState("");

  const FiltroVehiculo = () => {
    const filtros = [marca, modelo, año, familia].filter(f => f).join(" ");
  
    if (!filtros) {
      console.warn("X Debes seleccionar al menos un filtro");
      return;
    }
  
    const query = encodeURIComponent(filtros);
    const url = `https://test-api.beta-autopartes.com/api/v1/products/search/0?query=${query}`;
  
    console.log("🔍 URL de búsqueda:", url); 

     // Redirigir a la página de catálogo con los filtros en la URL
     router.push(`/catalogo?query=${encodeURIComponent(filtros)}`);
  };

  return (
    <div className="p-4 text-center">
      <div className="flex flex-col md:flex-row gap-2 mb-4 border p-4 rounded-lg shadow-md bg-white dark:bg-slate-900">
        <select className="border p-2 rounded dark:bg-slate-900 w-full md:w-auto mb-2 md:mb-0" onChange={(e) => setMarca(e.target.value)}>
          <option value="">Marca</option>
          <option value="Toyota">Toyota</option>
          <option value="Volkswagen">Volkswagen</option>
          <option value="KIA">KIA</option>
        </select>

        <select className="border p-2 rounded dark:bg-slate-900 " onChange={(e) => setModelo(e.target.value)}>
          <option value="">Modelo</option>
          <option value="Corolla">Corolla</option>
          <option value="Beetle">Beetle</option>
          <option value="RIO">RIO</option>
        </select>

        <select className="border p-2 rounded dark:bg-slate-900" onChange={(e) => setAño(e.target.value)}>
          <option value="">Año</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
        </select>

        <select className="border p-2 rounded dark:bg-slate-900" onChange={(e) => setFamilia(e.target.value)}>
          <option value="">Familia</option>
          <option value="Balero">Balero</option>
          <option value="Cilindro">Cilindro</option>
          <option value="AMORTIGUADOR">AMORTIGUADOR</option>
        </select>

        <Button onClick={FiltroVehiculo} className="w-full md:w-auto px-3 py-2 md:px-4 md:py-2 bg-blue-500 text-white rounded">
          Buscar
        </Button>
      </div>
    </div>
  );
}

export default ProductSearch;
