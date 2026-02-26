import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, MessageSquare } from "lucide-react";
import { clients, services, sessions, calendarSlots } from "@/lib/data";

export default function AdminDashboard() {
  const totalClients = clients.length;
  const activeServices = services.length;
  const sessionsThisMonth = sessions.filter(s => s.completedAt.getMonth() === new Date().getMonth()).length;

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold text-primary tracking-tight">Panel de Administración FISIKO</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">+2 este mes</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices}</div>
            <p className="text-xs text-muted-foreground">Todos operativos</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsThisMonth}</div>
            <p className="text-xs text-muted-foreground">+10% vs mes anterior</p>
          </CardContent>
        </Card>
         <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Mensajes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Pendientes de respuesta</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sessions.slice(0, 3).map(session => {
                        const client = clients.find(c => c.id === session.clientId);
                        const service = services.find(s => s.id === session.serviceId);
                        return (
                            <div key={session.id} className="flex items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{client?.name} completó {service?.name}.</p>
                                    <p className="text-sm text-muted-foreground">{session.completedAt.toLocaleDateString('es-ES')}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Próximas Citas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {calendarSlots.filter(s => s.isBooked && s.startTime > new Date()).slice(0, 3).map(slot => {
                        const client = clients.find(c => c.id === slot.bookedBy);
                        const service = services.find(s => s.id === slot.serviceId);
                        return (
                            <div key={slot.id} className="flex items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{client?.name} - {service?.name}</p>
                                    <p className="text-sm text-muted-foreground">{slot.startTime.toLocaleString('es-ES', {dateStyle: 'full', timeStyle: 'short'})}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
