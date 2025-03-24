"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const BuscadorProductos = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const buscarProductos = () => {
    if (!query.trim()) return;
    router.push(`/catalogo?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full max-w-[900px] mx-auto px-4">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-400">
          <Search size={20} />
        </div>
        <Input
          type="text"
          placeholder="Busca autopartes por nombre, marca o SKU..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscarProductos()}
          className="w-full h-14 pl-12 pr-32 text-lg rounded-full border-2 border-gray-300 
                   hover:border-gray-400 focus:border-blue-500 transition-colors
                   dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600"
        />
        <Button 
          onClick={buscarProductos}
          className="absolute right-2 h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700
                     text-white font-semibold transition-colors"
        >
          Buscar
        </Button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
        Encuentra las mejores autopartes para tu vehículo
      </p>
    </div>
  );
};

export default BuscadorProductos;
