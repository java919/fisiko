"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Check } from "lucide-react";
import { calendarSlots as allSlots, services as allServices } from "@/lib/data";

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const slotsForSelectedDay = allSlots.filter(
    slot => date && slot.startTime.toDateString() === date.toDateString()
  ).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Book a Session</h1>
        <p className="text-muted-foreground">Select a day and book an available slot.</p>
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
                fromDate={new Date()}
              />
            </CardContent>
          </Card>
        </div>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline">
                    Available Slots for {date ? date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'selected date'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {slotsForSelectedDay.map(slot => {
                        const service = allServices.find(s => s.id === slot.serviceId);
                        return (
                            <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-semibold">{slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {slot.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-sm text-muted-foreground">{service?.name}</p>
                                    </div>
                                </div>
                                {slot.isBooked ? (
                                    <Button disabled variant="outline">Booked</Button>
                                ) : (
                                    <Button><Check className="mr-2 h-4 w-4" />Book</Button>
                                )}
                            </div>
                        )
                    })
                    }
                    {slotsForSelectedDay.length === 0 && <div className="text-center py-16"><p className="text-muted-foreground">No slots available for this day.</p></div>}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
