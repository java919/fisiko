"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, ChevronRight } from "lucide-react";
import { calendarSlots as allSlots, services as allServices } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const slotsForSelectedDay = allSlots.filter(
    slot => date && slot.startTime.toDateString() === date.toDateString()
  ).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Reserva tu Sesión</h1>
        <p className="text-muted-foreground">Elige el día y la hora que mejor te vengan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">1. Selecciona el día</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-0 pb-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
              fromDate={new Date()}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-lg">2. Elige la hora</CardTitle>
            <CardDescription>
              {date ? date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Selecciona una fecha'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {slotsForSelectedDay.length > 0 ? (
                slotsForSelectedDay.map(slot => {
                  const service = allServices.find(s => s.id === slot.serviceId);
                  return (
                    <div key={slot.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-muted px-3 py-1 rounded-md font-bold text-sm">
                          {slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div>
                          <p className="font-medium">{service?.name}</p>
                          <p className="text-xs text-muted-foreground">60 min</p>
                        </div>
                      </div>
                      
                      {slot.isBooked ? (
                        <Badge variant="secondary">Ocupado</Badge>
                      ) : (
                        <Button size="sm">
                          Reservar
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-16 text-muted-foreground px-4">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>No hay huecos disponibles para esta fecha.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
