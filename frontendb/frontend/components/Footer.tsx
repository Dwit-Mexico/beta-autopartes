"use client";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";


const Footer = () => {
    return(
        <>
        <div className="flex flex-col px-4 md:px-24 bg-slate-500 dark:bg-slate-800 py-8 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 max-w-[1400px] mx-auto w-full">
                {/* Redes Sociales */}
                <div className="flex flex-col gap-2 md:w-1/4">
                    <Label>Síguenos en redes sociales</Label>
                    <Link 
                        href="https://es-es.facebook.com/GrupoBETAAutopartes/" 
                        className={buttonVariants({ variant: "link", size: "icon"})}
                        target="_blank"
                    >
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png" 
                            alt="Facebook" 
                            className="w-8 h-8 hover:scale-105 transition-transform"
                        />
                    </Link>
                </div>

                {/* Newsletter */}
                <div className="flex flex-col gap-2 md:w-1/3 md:items-end">
                    <Label>Mantente al día con nuestras promociones</Label>
                    <div className="flex flex-col sm:flex-row gap-2 max-w-[300px]">
                        <Input 
                            type="email" 
                            placeholder="Email" 
                            className="dark:bg-slate-700 w-full sm:w-[200px]"
                        />
                        <Button 
                            type="submit" 
                            className="w-full sm:w-auto"
                        >
                            Suscríbete
                        </Button>
                    </div>
                </div>
            </div>

            {/* Derechos reservados - Desktop */}
            <div className="hidden md:flex w-full justify-center items-center mt-6">
                <Label className="text-sm md:text-base text-slate-300 dark:text-slate-400">
                    © 2024 Beta Autopartes. Todos los derechos reservados
                </Label>
            </div>

        {/* Derechos reservados - Mobile */}
        <div className="md:hidden w-full flex justify-center border-t border-slate-400 mt-6 pt-4">
            <Label className="text-sm text-slate-300 dark:text-slate-400">
                © 2024 Beta Autopartes. Todos los derechos reservados
            </Label>
        </div>
        </div>

        </>
    );
}

    export default Footer;