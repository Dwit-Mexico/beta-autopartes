"use client"

import Image from 'next/image';
import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import Login from "@/components/login";
import Config from "@/components/config";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/components/ui/sheet';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-sky-100 dark:bg-sky-900 py-3 px-5" suppressHydrationWarning>
      <div className="flex items-center justify-between">
        {/* Sección logo */}
        <div className="flex items-center">
          <Link href={"/"}>
            <Image 
              src="/images/logo.png" 
              alt="Logo" 
              width={180} 
              height={100} 
              className="w-[100px] md:w-[180px] h-auto"
            />
          </Link>
        </div>

        {/* Botón móvil con Sheet */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button 
              className="md:hidden text-gray-600 dark:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </SheetTrigger>
          
          <SheetContent side="right" className="bg-sky-100 dark:bg-sky-900 w-64 pt-4">
            <div className="flex flex-col space-y-3 h-full mt-4 items-start pl-4">
              {/* Título y separador */}
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Menú</h3>
              <div className="w-full border-t border-gray-300 dark:border-gray-600 mb-2"></div>

              <SheetClose asChild>
                <Link href="/" className={buttonVariants({ variant: "link", className: "justify-start" })}>
                  INICIO
                </Link>
              </SheetClose>
              {/* Repeat same change for other links */}
              <SheetClose asChild>
                <Link href="/carrito" className={buttonVariants({ variant: "link" })}>CARRITO</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/about_us" className={buttonVariants({ variant: "link" })}>SOBRE NOSOTROS</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/promociones" className={buttonVariants({ variant: "link" })}>PROMOCIONES</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/recompensas" className={buttonVariants({ variant: "link" })}>RECOMPENSAS</Link>
              </SheetClose>
              <SheetClose asChild>
                <Login />
              </SheetClose>
              <SheetClose asChild>
                <Config />
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
        {/* Vista desktop original (sin cambios) */}
        <div className="hidden md:flex items-center space-x-5">
          <div className="flex items-center space-x-2">
            <Link href="/" className={buttonVariants({ variant: "link" })}>INICIO</Link>
            <Link href="/carrito" className={buttonVariants({ variant: "link" })}>CARRITO</Link>
            <Link href="/about_us" className={buttonVariants({ variant: "link" })}>SOBRE NOSOTROS</Link>
            <Link href="/promociones" className={buttonVariants({ variant: "link" })}>PROMOCIONES</Link>
            <Link href="/recompensas" className={buttonVariants({ variant: "link" })}>RECOMPENSAS</Link>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <Login />
            <Config />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;