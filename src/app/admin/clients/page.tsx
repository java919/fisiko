import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, PlusCircle, Users, UserCheck, UserMinus } from "lucide-react";
import { clients, clientServices, services } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClientsPage() {
  // Lógica para clasificar clientes
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
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">En tu base de datos</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients.length}</div>
            <p className="text-xs text-muted-foreground">Tienen sesiones pendientes</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
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
        <TabsList>
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
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Servicios / Bonos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={client.avatarUrl} alt={client.name} />
                      <AvatarFallback>{client.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {client.isActive ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Activo</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">Inactivo</Badge>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {client.subscriptions.map((sub: any) => {
                      const service = services.find(s => s.id === sub.serviceId);
                      return (
                        <Badge key={sub.serviceId} variant="secondary" className="text-[10px]">
                          {service?.name} ({sub.remainingSessions}/{sub.totalSessions})
                        </Badge>
                      );
                    })}
                    {client.subscriptions.length === 0 && <span className="text-xs text-muted-foreground italic">Sin historial</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/clients/${client.id}`}>Ver Perfil Completo</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Añadir Bono</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Dar de Baja</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No se han encontrado clientes en esta categoría.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
