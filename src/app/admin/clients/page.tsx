
"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, PlusCircle, Users, UserCheck, UserMinus, Save } from "lucide-react";
import { clients as initialClients, clientServices as initialClientServices, services } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ClientsPage() {
  const { toast } = useToast();
  const [clients, setClients] = useState(initialClients);
  const [clientServices, setClientServices] = useState(initialClientServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBirthday, setNewBirthday] = useState("");

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pick a random placeholder avatar for the new client
    const avatarPlaceholders = PlaceHolderImages.filter(img => img.id.includes('avatar'));
    const randomAvatar = avatarPlaceholders[Math.floor(Math.random() * avatarPlaceholders.length)];
    
    const newClient = {
      id: `client-${Date.now()}`,
      name: newName,
      email: newEmail,
      avatarUrl: randomAvatar?.imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      birthday: newBirthday || undefined
    };

    setClients([newClient, ...clients]);
    setIsDialogOpen(false);
    setNewName("");
    setNewEmail("");
    setNewBirthday("");
    
    toast({
      title: "Cliente registrado",
      description: `${newName} ha sido añadido a la base de datos correctamente.`
    });
  };

  // Logic to classify clients
  const clientsWithStatus = clients.map(client => {
    const subscriptions = clientServices.filter(cs => cs.clientId === client.id);
    const activeSubscriptions = subscriptions.filter(sub => sub.remainingSessions > 0);
    const isActive = activeSubscriptions.length > 0;
    
    return {
      ...client,
      subscriptions,
      isActive
    };
  });

  const activeClients = clientsWithStatus.filter(c => c.isActive);
  const inactiveClients = clientsWithStatus.filter(c => !c.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Gestión de Clientes</h1>
          <p className="text-muted-foreground">Administra tu base de datos y el estado de sus servicios.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-bold shadow-md">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddClient}>
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Introduce los datos básicos para dar de alta a un nuevo usuario en FISIKO.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input 
                    id="name" 
                    placeholder="Ej: Ana López" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="ana@ejemplo.com" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthday">Fecha de Nacimiento</Label>
                  <Input 
                    id="birthday" 
                    type="date" 
                    value={newBirthday} 
                    onChange={(e) => setNewBirthday(e.target.value)} 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full font-bold">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cliente
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">En tu base de datos</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients.length}</div>
            <p className="text-xs text-muted-foreground">Tienen sesiones pendientes</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Inactivos</CardTitle>
            <UserMinus className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveClients.length}</div>
            <p className="text-xs text-muted-foreground">Sin bonos o agotados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="all">Todos ({clients.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-green-600">Activos ({activeClients.length})</TabsTrigger>
          <TabsTrigger value="inactive" className="text-destructive">Inactivos ({inactiveClients.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <ClientTable list={clientsWithStatus} />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <ClientTable list={activeClients} />
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          <ClientTable list={inactiveClients} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ClientTable({ list }: { list: any[] }) {
  return (
    <Card className="border-2 shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/20">
              <TableHead className="font-bold">Nombre</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="hidden md:table-cell font-bold">Servicios / Bonos</TableHead>
              <TableHead className="text-right font-bold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((client) => (
              <TableRow key={client.id} className="group transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={client.avatarUrl} alt={client.name} />
                      <AvatarFallback className="font-bold text-xs">{client.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {client.isActive ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 font-bold px-2 py-0">Activo</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground font-bold px-2 py-0">Inactivo</Badge>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1 max-w-[300px]">
                    {client.subscriptions.map((sub: any) => {
                      const service = services.find(s => s.id === sub.serviceId);
                      return (
                        <Badge key={sub.serviceId} variant="secondary" className="text-[9px] font-bold h-5 px-1.5">
                          {service?.name} ({sub.remainingSessions}/{sub.totalSessions})
                        </Badge>
                      );
                    })}
                    {client.subscriptions.length === 0 && <span className="text-[10px] text-muted-foreground italic">Sin historial</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/clients/${client.id}`} className="cursor-pointer">Ver Perfil Completo</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Añadir Bono</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive cursor-pointer">Dar de Baja</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-16 text-muted-foreground">
                  <PlusCircle className="h-8 w-8 mx-auto mb-2 opacity-10" />
                  <p className="font-medium">No se han encontrado clientes en esta categoría.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
