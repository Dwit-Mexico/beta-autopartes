"use client";

import React from "react";
import { Cog, Moon, Sun } from "lucide-react"; 
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Config = () => {
      const { setTheme } = useTheme()
    
    return (
        <Sheet>
        <SheetTrigger asChild>
            <Button variant="link" className="p-2 flex items-center gap-2">
                <Cog className="h-5 w-5 md:h-6 md:w-6"/>
                <span className="md:hidden">CONFIGURACIONES</span>
            </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle className="text-lg md:text-xl px-4 py-3">Personalización</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4 px-2">
            <div className="flex justify-between items-center px-2">
              <Label className="text-sm md:text-base">Modo nocturno</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Filtros */}
            {[['Vehículos', 'Filtro-Vei'], ['Familia', 'Filtro-Fam'], ['Árbol', 'Filtro-Arb']].map(([label, id]) => (
            <div key={id} className="flex justify-between items-center px-2">
                <Label htmlFor={id} className="text-sm md:text-base">Ocultar {label}</Label>
                <Switch id={id} className="scale-75 md:scale-100"/>
            </div>
            ))}
            
            {/* Enlaces */}
            <div className="flex flex-col gap-2 px-2">
                <Link href="/favoritos" className={`${buttonVariants({ variant: "link" })} justify-start text-sm md:text-base`}>
                    Favoritos
                </Link>
                <Link href="/Historial" className={`${buttonVariants({ variant: "link" })} justify-start text-sm md:text-base`}>
                    Historial
                </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
}

export default Config;