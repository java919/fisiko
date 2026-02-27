"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2, Tag } from "lucide-react";
import { services as initialServices } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function AdminServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [editingService, setEditingService] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serviceData = {
      id: editingService?.id || `service-${Date.now()}`,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
    };

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? serviceData : s));
    } else {
      setServices([...services, serviceData]);
    }
    
    setIsDialogOpen(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Servicios y Bonos</h1>
          <p className="text-muted-foreground">Configura los servicios que ofreces y sus precios por sesión.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingService(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle>{editingService ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Servicio/Bono</Label>
                  <Input id="name" name="name" defaultValue={editingService?.name} placeholder="Ej: Pilates Máquina 10 Sesiones" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" name="description" defaultValue={editingService?.description} placeholder="Breve descripción del servicio..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio por Sesión (€)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={editingService?.price} placeholder="0.00" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Catálogo Actual
            </CardTitle>
            <CardDescription>
              Estos son los servicios visibles para los clientes y administradores.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Precio/Sesión</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-bold">{service.name}</TableCell>
                    <TableCell className="max-w-[300px] text-xs text-muted-foreground italic">
                      {service.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-sm font-bold">
                        {service.price}€
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setEditingService(service);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setServices(services.filter(s => s.id !== service.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
