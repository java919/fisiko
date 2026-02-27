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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Agenda y Citas</h1>
          <p className="text-muted-foreground">Control de disponibilidad y reservas del centro.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Hueco
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Calendario</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-0 pb-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Citas para el {date ? date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '...'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {slotsForSelectedDay.length > 0 ? (
                slotsForSelectedDay.map(slot => {
                  const service = allServices.find(s => s.id === slot.serviceId);
                  const client = clients.find(c => c.id === slot.bookedBy);
                  return (
                    <div key={slot.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-bold text-primary w-16">
                          {slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div>
                          <p className="font-semibold">{service?.name}</p>
                          {slot.isBooked ? (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{client?.name}</span>
                            </div>
                          ) : (
                            <p className="text-xs text-green-600 font-medium">Disponible</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {slot.isBooked ? (
                          <Badge>Reservado</Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Libre</Badge>
                        )}
                        <Button variant="ghost" size="sm">Editar</Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No hay huecos configurados para este día.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
