"use client";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, PlayCircle, Users, Tag } from "lucide-react";

export default function Recompensas() {
    return (
        <div className="max-w-md mx-auto p-4">
            <h3 className="text-2xl font-semibold m-4 text-center">🎁 Recompensas</h3>
            
            {/* Sección de puntos */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center dark:bg-slate-900">
                <h4 className="text-lg font-bold">Mis Puntos</h4>
                <p className="text-3xl font-semibold text-yellow-500 flex items-center justify-center gap-1">
                    <Star className="w-6 h-6" /> 600
                </p>
                <p className="text-sm">Gana más puntos, canjea regalos emocionantes y disfruta la experiencia.</p>
            </div>

            {/* Sección para ganar más puntos */}
            <div className="mt-4 bg-white p-4 rounded-lg shadow-md dark:bg-slate-900">
                <h4 className="text-lg font-bold">Gana más puntos</h4>
                <ul className="space-y-2 mt-2">
                    <li className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-yellow-500" /> Realizar un cuestionario
                        </span>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1">
                            <Star className="w-4 h-4" /> 500 
                        </button>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <PlayCircle className="w-5 h-5 text-yellow-500" /> Ver video
                        </span>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1">
                            <Star className="w-4 h-4" /> 50 
                        </button>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-yellow-500" /> Recomendar a un amigo
                        </span>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1">
                            <Star className="w-4 h-4" /> 500 
                        </button>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-yellow-500" /> Visitar promociones
                        </span>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1">
                            <Star className="w-4 h-4" /> 300 
                        </button>
                    </li>
                </ul>
            </div>

            {/* Sección de recompensas */}
            <div className="mt-4">
            <Button variant="ghost" >
                <h4 className="text-lg font-bold">Canjear</h4>
            </Button>
            </div>
        </div>
    );
}
