import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { clients, clientServices, services, calendarSlots } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Bell, CalendarPlus, Video } from "lucide-react";

export default function ClientDashboard() {
  // Mocking the logged in user as Juan Pérez
  const currentUser = clients.find(c => c.id === '1');
  const userServices = clientServices.filter(cs => cs.clientId === currentUser?.id);
  const upcomingAppointment = calendarSlots.find(slot => slot.bookedBy === currentUser?.id && slot.startTime > new Date());
  
  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">¡Bienvenido, {currentUser.name.split(' ')[0]}!</h1>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Tus Servicios</CardTitle>
              <CardDescription>Aquí tienes un resumen de tus paquetes de servicios activos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {userServices.map(sub => {
                const service = services.find(s => s.id === sub.serviceId);
                if (!service) return null;
                const progress = (sub.remainingSessions / sub.totalSessions) * 100;
                return (
                  <div key={sub.serviceId}>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <span className="text-sm font-medium">{sub.remainingSessions} / {sub.totalSessions} sesiones restantes</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )
              })}
              {userServices.length === 0 && <p className="text-muted-foreground">No tienes ningún servicio activo.</p>}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="font-headline">Reserva tu Próxima Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">¿Preparado para continuar tu viaje de bienestar? Reserva tu próxima cita ahora.</p>
              <Button variant="secondary" asChild className="w-full">
                <Link href="/booking">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Encontrar un hueco
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {upcomingAppointment && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Bell className="w-6 h-6 text-primary"/>
                <div>
                    <CardTitle className="font-headline">Próxima Cita</CardTitle>
                    <CardDescription>
                        {services.find(s => s.id === upcomingAppointment.serviceId)?.name}
                    </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{upcomingAppointment.startTime.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</p>
              </CardContent>
            </Card>
          )}

          <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <Video className="w-6 h-6 text-primary" />
                  <div>
                      <CardTitle className="font-headline">Nuevos Ejercicios</CardTitle>
                      <CardDescription>Consulta el nuevo contenido de tus servicios.</CardDescription>
                  </div>
              </CardHeader>
              <CardContent>
                 <Button variant="outline" asChild className="w-full">
                    <Link href="/exercises">Ver Contenido</Link>
                </Button>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
