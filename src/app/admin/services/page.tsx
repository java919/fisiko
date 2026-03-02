"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2, Tag, Save, X } from "lucide-react";
import { services as initialServices } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function AdminServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = useState(initialServices);
  const [editingService, setEditingService] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, name, price, description } : s));
      toast({ title: "Servicio actualizado", description: "Los cambios se han guardado correctamente." });
    } else {
      const newService = {
        id: `service-${Date.now()}`,
        name,
        price,
        description
      };
      setServices([...services, newService]);
      toast({ title: "Servicio creado", description: "El nuevo servicio ha sido añadido al catálogo." });
    }
    
    setIsDialogOpen(false);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    toast({ variant: "destructive", title: "Servicio eliminado", description: "El servicio ha sido retirado del catálogo." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Servicios y Bonos</h1>
          <p className="text-muted-foreground">Gestiona los servicios de FISIKO, sus tarifas y descripciones.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingService(null)} className="font-bold">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle>{editingService ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}</DialogTitle>
                <DialogDescription>Define el nombre, descripción y precio por sesión del servicio.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Servicio/Bono</Label>
                  <Input id="name" name="name" defaultValue={editingService?.name} placeholder="Ej: Pilates Máquina 10 Sesiones" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" name="description" defaultValue={editingService?.description} placeholder="Detalles sobre lo que incluye el servicio..." className="min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio por Sesión (€)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={editingService?.price} placeholder="0.00" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-2 shadow-sm">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="font-headline flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Catálogo Vigente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[250px]">Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Descripción</TableHead>
                <TableHead className="text-right">Precio/Sesión</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} className="group transition-colors">
                  <TableCell className="font-bold text-lg">{service.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm italic line-clamp-2 max-w-[400px]">
                    {service.description || "Sin descripción"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="text-sm font-bold bg-primary/10 text-primary border-primary/20">
                      {service.price.toFixed(2)}€
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => {
                          setEditingService(service);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
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
  );
}
