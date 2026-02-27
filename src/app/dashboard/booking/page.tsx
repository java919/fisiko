"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Check, ChevronRight, Info } from "lucide-react";
import { calendarSlots as allSlots, services as allServices } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const slotsForSelectedDay = allSlots.filter(
    slot => date && slot.startTime.toDateString() === date.toDateString()
  ).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">Reserva tu Sesión</h1>
        <p className="text-muted-foreground text-lg">Selecciona el día que mejor te venga y reserva tu hueco en FISIKO.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado izquierdo: Calendario */}
        <div className="lg:col-span-5 sticky top-24">
          <Card className="shadow-lg border-2 border-primary/5">
            <CardHeader>
              <CardTitle className="text-lg font-bold">1. Selecciona Fecha</CardTitle>
              <CardDescription>Visualiza los días con disponibilidad.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md w-full"
                fromDate={new Date()}
                classNames={{
                  months: "w-full",
                  table: "w-full",
                }}
              />
            </CardContent>
          </Card>
          
          <div className="mt-6 p-4 rounded-xl bg-accent/10 flex gap-4">
            <Info className="h-6 w-6 text-accent-foreground shrink-0" />
            <p className="text-sm text-accent-foreground">
              Recuerda que puedes cancelar tu reserva hasta con 24 horas de antelación desde tu historial de sesiones.
            </p>
          </div>
        </div>

        {/* Lado derecho: Selección de Hora */}
        <div className="lg:col-span-7">
          <Card className="shadow-xl border-none overflow-hidden min-h-[400px]">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="font-headline text-xl">2. Selecciona Horario</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {date ? date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Selecciona una fecha'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {slotsForSelectedDay.length > 0 ? (
                  slotsForSelectedDay.map(slot => {
                    const service = allServices.find(s => s.id === slot.serviceId);
                    return (
                      <div 
                        key={slot.id} 
                        className={cn(
                          "group flex items-center justify-between p-5 hover:bg-muted/40 transition-all",
                          slot.isBooked && "opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-5">
                          <div className="bg-muted rounded-lg p-3 text-center min-w-[70px]">
                            <p className="font-bold text-foreground">{slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div>
                            <p className="font-bold text-lg">{service?.name}</p>
                            <Badge variant="secondary" className="text-[10px] font-bold mt-1">60 min</Badge>
                          </div>
                        </div>
                        
                        {slot.isBooked ? (
                          <Badge variant="outline" className="px-4 py-1">No disponible</Badge>
                        ) : (
                          <Button className="font-bold shadow-md hover:scale-105 transition-transform">
                            Reservar
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-20 px-6">
                    <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-bold opacity-50">Sin huecos disponibles</h3>
                    <p className="text-muted-foreground text-sm">Prueba a seleccionar otro día en el calendario.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
