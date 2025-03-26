"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Login() {
    return (
        <Dialog>
        <DialogTrigger asChild>
            <Button variant="link">
                <User />INICIAR SESIÓN
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] w-[95%] mx-auto">
        <Tabs defaultValue="account" className="w-full">
          <DialogHeader>
              <TabsList className="grid w-full grid-cols-2 mt-3">
                <TabsTrigger value="Usuario" className="px-2 py-1 text-sm sm:text-base">Usuario</TabsTrigger>
                <TabsTrigger value="Agente" className="px-2 py-1 text-sm sm:text-base">Agente</TabsTrigger>
            </TabsList>
          </DialogHeader>
          <TabsContent value="Usuario">
            <Card className="mt-4">
              <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                <div className="space-y-2 sm:space-y-4">
                  <Label htmlFor="name" className="dark:text-white text-sm sm:text-base">Usuario</Label>
                  <Input 
                    id="name" 
                    placeholder="Ingresa tu usuario" 
                    className="dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2 sm:space-y-4">
                  <Label htmlFor="username" className="dark:text-white text-sm sm:text-base">Contraseña</Label>
                  <Input 
                    id="username" 
                    placeholder="Ingresa tu contraseña" 
                    type="password"
                    className="dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>
              </CardContent>
              <CardFooter className="p-3 sm:p-6">
                <Button className="w-full sm:w-auto">Ingresar</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="Agente">
            <Card className="mt-4">
              <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                <div className="space-y-2 sm:space-y-4">
                  <Label htmlFor="name" className="dark:text-white text-sm sm:text-base">Usuario</Label>
                  <Input 
                    id="name" 
                    placeholder="Ingresa tu usuario" 
                    className="dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2 sm:space-y-4">
                  <Label htmlFor="username" className="dark:text-white text-sm sm:text-base">Contraseña</Label>
                  <Input 
                    id="username" 
                    placeholder="Ingresa tu contraseña" 
                    type="password"
                    className="dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-400 text-sm sm:text-base"
                  />
                </div>
              </CardContent>
              <CardFooter className="p-3 sm:p-6">
                <Button className="w-full sm:w-auto">Ingresar</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        </DialogContent>
      </Dialog>

    );
}