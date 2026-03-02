"use client"

import { useState, useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { clients, clientServices, services, calendarSlots } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Bell, CalendarPlus, Video, Activity, Cake } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientDashboard() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentUser = clients.find(c => c.id === '1');
  const userServices = clientServices.filter(cs => cs.clientId === currentUser?.id);
  const now = new Date();
  const upcomingAppointment = calendarSlots.find(slot => slot.bookedBy === currentUser?.id && slot.startTime > now);
  
  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-primary">¡Hola de nuevo, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-sm text-muted-foreground">Bienvenido a tu portal de bienestar integral en FISIKO.</p>
        </div>
        <Card className="w-full lg:w-auto p-4 border-2 border-primary/20 bg-primary/5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Cake className="h-5 w-5 text-primary shrink-0" />
              <Label htmlFor="birthday" className="text-xs font-bold uppercase whitespace-nowrap">Mi Cumpleaños</Label>
            </div>
            <div className="flex w-full gap-2">
              <Input 
                id="birthday"
                type="date" 
                defaultValue={currentUser.birthday} 
                className="h-9 w-full sm:w-40 text-xs bg-background" 
              />
              <Button size="sm" variant="outline" className="h-9 text-xs shrink-0">Guardar</Button>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-primary/10 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1 text-primary">
                <Activity className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Tu Actividad</span>
              </div>
              <CardTitle className="font-headline text-xl md:text-2xl">Mis Bonos Activos</CardTitle>
              <CardDescription>Controla tus sesiones disponibles y renueva cuando lo necesites.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {userServices.map(sub => {
                const service = services.find(s => s.id === sub.serviceId);
                if (!service) return null;
                const progress = (sub.remainingSessions / sub.totalSessions) * 100;
                return (
                  <div key={sub.serviceId} className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-lg truncate">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">Sesiones consumidas: {sub.totalSessions - sub.remainingSessions}</p>
                        </div>
                        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full shrink-0">
                          {sub.remainingSessions} / {sub.totalSessions} restantes
                        </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                )
              })}
              {userServices.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground italic">No tienes bonos activos en este momento.</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/dashboard/booking">Ver Servicios Disponibles</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground shadow-lg border-none">
            <CardHeader>
              <CardTitle className="font-headline text-xl">¿Tu próxima cita?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-sm text-primary-foreground/90 leading-relaxed">Mantén tu rutina y reserva tu hueco preferido en nuestro calendario interactivo.</p>
              <Button variant="secondary" asChild className="w-full font-bold shadow-md hover:scale-[1.02] transition-transform">
                <Link href="/dashboard/booking">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Reservar Ahora
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {upcomingAppointment && (
            <Card className="border-l-4 border-l-primary shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                  <Bell className="w-5 h-5 text-primary"/>
                </div>
                <div className="min-w-0">
                    <CardTitle className="font-headline text-base truncate">Próxima Sesión</CardTitle>
                    <CardDescription className="text-xs truncate">
                        {services.find(s => s.id === upcomingAppointment.serviceId)?.name}
                    </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-lg text-foreground">
                  {upcomingAppointment.startTime.toLocaleString('es-ES', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="group hover:border-primary transition-colors cursor-pointer shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="p-2 bg-accent/10 rounded-full shrink-0">
                    <Video className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="min-w-0">
                      <CardTitle className="font-headline text-base truncate">Contenido Extra</CardTitle>
                      <CardDescription className="text-xs">Vídeos y guías exclusivas.</CardDescription>
                  </div>
              </CardHeader>
              <CardContent>
                 <Button variant="outline" asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Link href="/dashboard/exercises">Acceder a Biblioteca</Link>
                </Button>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
