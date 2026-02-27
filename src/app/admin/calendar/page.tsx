"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Clock, MapPin, User } from "lucide-react";
import { calendarSlots as allSlots, services as allServices, clients } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const slotsForSelectedDay = allSlots.filter(
    slot => date && slot.startTime.toDateString() === date.toDateString()
  ).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">Agenda y Citas</h1>
          <p className="text-muted-foreground text-lg">Control total de la disponibilidad y reservas del centro.</p>
        </div>
        <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
          <PlusCircle className="mr-2 h-5 w-5" />
          Nuevo Hueco
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado izquierdo: Calendario */}
        <div className="lg:col-span-4 sticky top-24">
          <Card className="shadow-md border-2 border-primary/5">
            <CardContent className="p-4 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md w-full"
                classNames={{
                  months: "w-full",
                  table: "w-full",
                }}
              />
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-primary/5 border-none">
            <CardContent className="p-6">
              <h4 className="font-bold text-sm uppercase tracking-wider text-primary mb-3">Resumen del día</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sesiones reservadas:</span>
                  <span className="font-bold">{slotsForSelectedDay.filter(s => s.isBooked).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Huecos libres:</span>
                  <span className="font-bold text-green-600">{slotsForSelectedDay.filter(s => !s.isBooked).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lado derecho: Lista de citas */}
        <div className="lg:col-span-8">
          <Card className="shadow-lg border-none min-h-[500px]">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {date ? date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Fecha seleccionada'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {slotsForSelectedDay.length > 0 ? (
                  slotsForSelectedDay.map(slot => {
                    const service = allServices.find(s => s.id === slot.serviceId);
                    const client = clients.find(c => c.id === slot.bookedBy);
                    return (
                      <div 
                        key={slot.id} 
                        className={cn(
                          "flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-muted/20 transition-colors gap-4",
                          slot.isBooked ? "bg-primary/5" : ""
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-background border-2 border-primary/20 rounded-xl p-3 text-center min-w-[80px] shadow-sm">
                            <p className="text-lg font-bold text-primary">{slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">{slot.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-lg leading-tight">{service?.name}</h3>
                            <div className="flex flex-col gap-1">
                              {slot.isBooked ? (
                                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                                  <User className="h-3.5 w-3.5 text-primary" />
                                  <span>{client?.name}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground italic">
                                  <span>Disponible para reserva</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>Box Principal - FISIKO</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {slot.isBooked ? (
                            <Badge className="bg-primary text-white hover:bg-primary/90 px-3 py-1">Reservado</Badge>
                          ) : (
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 px-3 py-1 font-bold">Libre</Badge>
                          )}
                          <Button variant="ghost" size="sm" className="h-8">Editar</Button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-24 px-6">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Sin actividad programada</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">No hay huecos configurados para este día en el calendario.</p>
                    <Button variant="outline" className="mt-6">Añadir disponibilidad</Button>
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
