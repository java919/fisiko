import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clients, clientServices, services as allServices, sessions } from "@/lib/data";
import { ArrowLeft, CheckCircle, PlusCircle, Cake } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = clients.find(c => c.id === id);
  const subscriptions = clientServices.filter(cs => cs.clientId === id);
  const clientSessions = sessions.filter(s => s.clientId === id).sort((a,b) => b.completedAt.getTime() - a.completedAt.getTime());

  if (!client) {
    return <div className="p-8 text-center">Cliente no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/clients" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Volver a Clientes
      </Link>
      
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
            <AvatarImage src={client.avatarUrl} alt={client.name}/>
            <AvatarFallback className="text-2xl">{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="font-headline text-3xl font-bold">{client.name}</h1>
                <p className="text-muted-foreground">{client.email}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                    <Cake className="h-4 w-4 text-primary" />
                    <span className="font-medium">Cumpleaños:</span>
                    <Input 
                        type="date" 
                        defaultValue={client.birthday} 
                        className="h-8 w-40 text-xs" 
                    />
                    <Button size="sm" variant="ghost" className="h-8 text-xs">Guardar</Button>
                </div>
            </div>
        </div>
        <div className="md:ml-auto">
            <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Servicio
            </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Servicios Activos</CardTitle>
          <CardDescription>Gestión de bonos y sesiones restantes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {subscriptions.map(sub => {
                const service = allServices.find(s => s.id === sub.serviceId);
                if (!service) return null;
                return (
                    <div key={service.id} className="p-4 border rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{service.name}</h3>
                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-bold">{service.price}€ / sesión</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{sub.remainingSessions}</p>
                                <p className="text-xs text-muted-foreground">restantes</p>
                            </div>
                            <Separator orientation="vertical" className="h-10" />
                            <div className="text-center">
                                <p className="text-2xl font-bold">{sub.totalSessions}</p>
                                <p className="text-xs text-muted-foreground">totales</p>
                            </div>
                            <Button disabled={sub.remainingSessions === 0}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Completar Sesión
                            </Button>
                        </div>
                    </div>
                )
            })}
             {subscriptions.length === 0 && <p className="text-muted-foreground text-center py-8">Sin servicios activos.</p>}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Historial de Sesiones e Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Ingreso</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clientSessions.length > 0 ? clientSessions.map(session => {
                    const service = allServices.find(s => s.id === session.serviceId);
                    return (
                        <TableRow key={session.id}>
                            <TableCell className="font-medium">{service?.name}</TableCell>
                            <TableCell>{session.completedAt.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</TableCell>
                            <TableCell className="text-right font-bold text-primary">{session.revenue}€</TableCell>
                        </TableRow>
                    )
                }) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">Sin sesiones registradas.</TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
