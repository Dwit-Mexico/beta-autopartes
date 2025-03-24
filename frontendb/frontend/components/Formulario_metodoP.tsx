import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

const MetodoP = () => {
    const [paymentMethod, setPaymentMethod] = useState("efectivo");

    return (
        <div className="flex flex-col space-y-4 w-full max-w-2xl mx-auto p-4 md:p-8">
            <Select onValueChange={setPaymentMethod} defaultValue="efectivo">
                <SelectTrigger className="w-full md:h-12">
                    <SelectValue placeholder="Selecciona tu método de pago" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Formas de pago</SelectLabel>
                        <SelectItem value="tarjeta">Tarjeta de crédito/débito</SelectItem>
                        <SelectItem value="efectivo">Pago en efectivo</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            {paymentMethod === "tarjeta" ? (
                <div className="space-y-4">
                    <div className="space-y-2 md:space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm md:text-base font-semibold">Nombre del titular</Label>
                            <Input type="text" className="dark:bg-slate-700 w-full md:h-12" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm md:text-base font-semibold">Numero de tarjeta</Label>
                            <Input 
                                type="text" 
                                className="dark:bg-slate-700 w-full md:h-12"
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                maxLength={16}
                                pattern="[0-9]*"
                                inputMode="numeric"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm md:text-base font-semibold">Fecha de vencimiento</Label>
                            <Input 
                                type="text" 
                                className="dark:bg-slate-700 w-full md:h-12"
                                placeholder="MM/YYYY"
                                maxLength={7}
                                onKeyPress={(e) => {
                                    if (!/[0-9/]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (value.length === 2 && !value.includes('/')) {
                                        value += '/';
                                        e.target.value = value;
                                    }
                                    if (value.length === 2) {
                                        const month = parseInt(value);
                                        if (month < 1 || month > 12) {
                                            e.target.value = '';
                                        }
                                    }
                                    if (value.length === 7) {
                                        const year = parseInt(value.slice(3));
                                        if (year < 2024 || year > 2034) {
                                            e.target.value = value.slice(0, 3);
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm md:text-base font-semibold">Codigo de seguridad</Label>
                            <Input type="text" className="dark:bg-slate-700 w-full md:h-12" />
                        </div>
                    </div>

                    <div className="md:flex md:justify-end mt-6">
                        <Button className="w-full md:w-48 md:h-12 md:text-lg">Guardar Datos</Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-4 mt-6">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/EAN13.svg/1200px-EAN13.svg.png" 
                        alt="Código de barras" 
                        className="w-64 h-32 object-contain"
                    />
                    <Label className="text-center text-lg font-semibold">
                        Escanee en tienda
                    </Label>
                    <p className="text-sm text-gray-500 text-center">
                        Presente este código en cualquier tienda participante para realizar su pago
                    </p>
                </div>
            )}
        </div>
    );
}

export default MetodoP;