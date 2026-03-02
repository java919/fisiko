"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, MessageSquare, Gift } from "lucide-react";
import { clients, services, sessions, calendarSlots } from "@/lib/data";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const now = new Date();
  const totalClients = clients.length;
  const activeServices = services.length;
  const sessionsThisMonth = sessions.filter(s => s.completedAt.getMonth() === now.getMonth()).length;

  // Próximos cumpleaños (en los próximos 30 días)
  const upcomingBirthdays = clients.filter(c => {
    if (!c.birthday) return false;
    const bday = new Date(c.birthday);
    const today = new Date();
    const nextBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
    if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1);
    const diffTime = Math.abs(nextBday.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }).slice(0, 3);

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
            <p className="text-xs text-muted-foreground">Base de datos total</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices}</div>
            <p className="text-xs text-muted-foreground">Catálogo operativo</p>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Actividad mensual</p>
          </CardContent>
        </Card>
         <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Mensajes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-lg">Próximos Cumpleaños</CardTitle>
                <Gift className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {upcomingBirthdays.length > 0 ? upcomingBirthdays.map(client => (
                        <div key={client.id} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{client.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(client.birthday!).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground italic text-center py-4">No hay cumpleaños cercanos.</p>
                    )}
                </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sessions.slice(0, 3).map(session => {
                        const client = clients.find(c => c.id === session.clientId);
                        const service = services.find(s => s.id === session.serviceId);
                        return (
                            <div key={session.id} className="flex flex-col border-b pb-2 last:border-0">
                                <p className="text-sm font-medium">{client?.name}</p>
                                <p className="text-xs text-muted-foreground">{service?.name} • {session.completedAt.toLocaleDateString('es-ES')}</p>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>

        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Próximas Citas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {calendarSlots.filter(s => s.isBooked && s.startTime > now).slice(0, 3).map(slot => {
                        const client = clients.find(c => c.id === slot.bookedBy);
                        const service = services.find(s => s.id === slot.serviceId);
                        return (
                            <div key={slot.id} className="flex flex-col border-b pb-2 last:border-0">
                                <p className="text-sm font-medium">{client?.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {slot.startTime.toLocaleString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} • {service?.name}
                                </p>
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
