"use client";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FavoritosSwitchProps {
  mostrarSoloFavoritos: boolean;
  onToggle: (checked: boolean) => void;
}

function FavoritosSwitch({ mostrarSoloFavoritos, onToggle }: FavoritosSwitchProps) {
  const [hasFavorites, setHasFavorites] = useState(false);

  useEffect(() => {
    // Inicializar favoritos si no existen
    if (!localStorage.getItem('favoritos')) {
      localStorage.setItem('favoritos', JSON.stringify([]));
    }

    // Check if there are favorites
    const favorites = JSON.parse(localStorage.getItem('favoritos') || '[]');
    setHasFavorites(favorites.length > 0);
  }, [mostrarSoloFavoritos]);

  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="favoritos" 
          checked={mostrarSoloFavoritos}
          onCheckedChange={onToggle}
        />
        <Label htmlFor="favoritos">Mostrar solo favoritos</Label>
      </div>
      {mostrarSoloFavoritos && !hasFavorites && (
        <p className="text-sm text-gray-500 mt-2">No hay coincidencia en favoritos</p>
      )}
    </div>
  );
}

export default FavoritosSwitch;