import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clients, clientServices, services as allServices, sessions } from "@/lib/data";
import { ArrowLeft, CheckCircle, PlusCircle, Cake, ShieldCheck } from "lucide-react";
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
      <Link href="/admin/clients" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Volver a Clientes
      </Link>
      
      <div className="flex flex-col md:flex-row items-start gap-6 bg-card p-6 rounded-2xl border-2 shadow-sm">
        <div className="flex items-center gap-5">
            <Avatar className="h-24 w-24 border-4 border-primary/10">
            <AvatarImage src={client.avatarUrl} alt={client.name}/>
            <AvatarFallback className="text-3xl">{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
                <h1 className="font-headline text-3xl font-bold tracking-tight">{client.name}</h1>
                <p className="text-muted-foreground">{client.email}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex items-center gap-2">
                      <Cake className="h-4 w-4 text-primary" />
                      <Label htmlFor="birthday" className="text-xs font-bold uppercase whitespace-nowrap">Fecha de Nacimiento</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                          id="birthday"
                          type="date" 
                          defaultValue={client.birthday} 
                          className="h-9 w-40 text-xs bg-background" 
                      />
                      <Button size="sm" className="h-9 px-4 text-xs font-bold">
                        Guardar
                      </Button>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-primary/70 font-medium ml-2">
                      <ShieldCheck className="h-3 w-3" />
                      Solo edición Admin
                    </div>
                </div>
            </div>
        </div>
        <div className="md:ml-auto">
            <Button variant="outline" className="font-bold border-2">
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Bono/Servicio
            </Button>
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Servicios Activos
            </CardTitle>
            <CardDescription>Gestión de bonos y sesiones restantes para este cliente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              {subscriptions.map(sub => {
                  const service = allServices.find(s => s.id === sub.serviceId);
                  if (!service) return null;
                  return (
                      <div key={service.id} className="p-5 border-2 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-muted/5 hover:border-primary/20 transition-all">
                          <div className="flex-1">
                              <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-lg">{service.name}</h3>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{service.price}€ / sesión</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                          </div>
                          <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end">
                              <div className="flex gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-primary">{sub.remainingSessions}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">restantes</p>
                                </div>
                                <Separator orientation="vertical" className="h-10" />
                                <div className="text-center">
                                    <p className="text-2xl font-black">{sub.totalSessions}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">totales</p>
                                </div>
                              </div>
                              <Button disabled={sub.remainingSessions === 0} className="font-bold shadow-sm">
                                  Validar Sesión
                              </Button>
                          </div>
                      </div>
                  )
              })}
              {subscriptions.length === 0 && <p className="text-muted-foreground text-center py-12 italic">Sin servicios activos actualmente.</p>}
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="font-headline">Historial e Ingresos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                  <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-6">Servicio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right pr-6">Ingreso</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {clientSessions.length > 0 ? clientSessions.map(session => {
                      const service = allServices.find(s => s.id === session.serviceId);
                      return (
                          <TableRow key={session.id}>
                              <TableCell className="font-bold pl-6">{service?.name}</TableCell>
                              <TableCell className="text-xs">{session.completedAt.toLocaleDateString('es-ES')}</TableCell>
                              <TableCell className="text-right pr-6 font-black text-primary">{session.revenue}€</TableCell>
                          </TableRow>
                      )
                  }) : (
                      <TableRow>
                          <TableCell colSpan={3} className="text-center h-32 text-muted-foreground italic">Sin sesiones registradas.</TableCell>
                      </TableRow>
                  )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
