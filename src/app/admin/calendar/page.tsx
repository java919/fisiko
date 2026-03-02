
"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Clock, User, CalendarDays } from "lucide-react";
import { calendarSlots as allSlots, services as allServices, clients } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function AdminCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const slotsForSelectedDay = allSlots.filter(
    slot => date && slot.startTime.toDateString() === date.toDateString()
  ).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Agenda y Citas</h1>
          <p className="text-sm text-muted-foreground">Control de disponibilidad y reservas del centro.</p>
        </div>
        <Button size="lg" className="font-bold shadow-md w-full sm:w-auto">
          <PlusCircle className="mr-2 h-5 w-5" />
          Nuevo Hueco
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 h-fit border-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Seleccionar Fecha
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-0 pb-6 overflow-hidden">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none scale-90 sm:scale-100"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-8 border-2">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="truncate">Sesiones del {date ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : '...'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              {slotsForSelectedDay.length > 0 ? (
                slotsForSelectedDay.map(slot => {
                  const service = allServices.find(s => s.id === slot.serviceId);
                  const client = clients.find(c => c.id === slot.bookedBy);
                  return (
                    <div key={slot.id} className="group p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-card border-2 rounded-xl hover:border-primary/50 transition-all shadow-sm gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center bg-primary/10 text-primary font-bold px-3 py-2 rounded-lg w-16 sm:w-20 shrink-0">
                          <span className="text-xs sm:text-sm">{slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-base sm:text-lg truncate">{service?.name}</p>
                          {slot.isBooked ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <User className="h-3.5 w-3.5 shrink-0" />
                              <span className="font-medium truncate">{client?.name}</span>
                            </div>
                          ) : (
                            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1">Disponible</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        {slot.isBooked ? (
                          <Badge className="px-3 py-1">Reservado</Badge>
                        ) : (
                          <Badge variant="outline" className="px-3 py-1 text-green-600 border-green-200 bg-green-50">Libre</Badge>
                        )}
                        <Button variant="ghost" size="sm" className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">Editar</Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-16 bg-muted/10 rounded-xl border-2 border-dashed px-4">
                  <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-muted-foreground font-medium italic">No hay huecos configurados.</p>
                  <Button variant="outline" size="sm" className="mt-4">Configurar horario rápido</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
