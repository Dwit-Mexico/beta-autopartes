"use client";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Label } from "@radix-ui/react-label";
import { Table, TableHeader, TableCell, TableRow } from "@/components/ui/table";
import { Tab, TableBody } from "@mui/material";

const Equivalencias = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded text-sm">Ver equivalencias</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[900px] max-w-[90vw]">
                <Label className="text-sm font-semibold">Equivalencias</Label>
                <div className="flex justify-between">
                <Table className="w-full mt-5">
                    <TableHeader>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Clave</TableCell>
                            <TableCell>Marca</TableCell>
                            <TableCell>Precio</TableCell>
                        </TableRow>
                    </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>INFLALLANTAS UNIVERSAL CON SELLADOR 350G CAJA CON 15 PIEZAS</TableCell>
                                <TableCell>dsklajd</TableCell>
                                <TableCell>patito</TableCell>
                                <TableCell>1000</TableCell>
                            </TableRow>
                        </TableBody>
                    
                </Table>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default Equivalencias;