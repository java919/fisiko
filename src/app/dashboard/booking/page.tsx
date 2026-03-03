"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, ChevronRight, Sparkles } from "lucide-react";
import { calendarSlots as allSlots, services as allServices } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function BookingPage() {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
  }, []);

  if (!mounted) return null;

  const slotsForSelectedDay = allSlots.filter(
    slot => date && slot.startTime.toDateString() === date.toDateString()
  ).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Reserva tu Sesión</h1>
        <p className="text-muted-foreground">Elige el día y la hora que mejor se adapten a tu rutina.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="h-fit border-2 shadow-sm">
          <CardHeader className="border-b bg-muted/5">
            <CardTitle className="text-lg font-headline">1. Selecciona el día</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
              fromDate={new Date()}
            />
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-lg font-headline">2. Elige la hora</CardTitle>
            <CardDescription className="font-medium text-primary/80">
              {date ? date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Selecciona una fecha'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y-2">
              {slotsForSelectedDay.length > 0 ? (
                slotsForSelectedDay.map(slot => {
                  const service = allServices.find(s => s.id === slot.serviceId);
                  return (
                    <div key={slot.id} className="p-5 flex items-center justify-between hover:bg-muted/10 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg font-black text-sm w-16 text-center">
                          {slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground">
                            {service ? service.name : "Sesión Libre / Flexible"}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
                            {service ? "Duración estimada: 60 min" : "Reserva y elige servicio después"}
                          </p>
                        </div>
                      </div>
                      
                      {slot.isBooked ? (
                        <Badge variant="secondary" className="px-3 py-1 opacity-60">Ocupado</Badge>
                      ) : (
                        <Button size="sm" className="font-bold group-hover:scale-105 transition-transform">
                          {service ? "Reservar" : "Solicitar Hueco"}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-20 text-muted-foreground px-6">
                  <Sparkles className="h-10 w-10 mx-auto mb-4 opacity-10" />
                  <p className="font-medium italic">No hay disponibilidad para esta fecha.</p>
                  <p className="text-xs mt-1">Prueba con otro día o contacta con nosotros.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
