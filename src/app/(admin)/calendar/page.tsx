"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Clock } from "lucide-react";
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
          <h1 className="font-headline text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage available slots for client bookings.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Slot
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0 sm:p-2 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>
        </div>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline">
                    Schedule for {date ? date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'selected date'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {slotsForSelectedDay.length > 0 ? slotsForSelectedDay.map(slot => {
                        const service = allServices.find(s => s.id === slot.serviceId);
                        const client = clients.find(c => c.id === slot.bookedBy);
                        return (
                            <div key={slot.id} className={cn("flex items-center justify-between p-3 border rounded-lg", slot.isBooked && "bg-muted/50")}>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-semibold">{slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {slot.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-sm text-muted-foreground">{service?.name}</p>
                                    </div>
                                </div>
                                {slot.isBooked ? (
                                    <Badge>{client?.name}</Badge>
                                ) : (
                                    <Badge variant="outline">Available</Badge>
                                )}
                            </div>
                        )
                    }) : (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground">No slots scheduled for this day.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
