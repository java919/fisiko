"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Clock, User, CalendarDays, Save, Sparkles, Loader2 } from "lucide-react";
import { calendarSlots as initialSlots, services as allServices, clients } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarSlot } from "@/lib/types";

export default function AdminCalendarPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<CalendarSlot[]>(initialSlots);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Form state
  const [newSlotService, setNewSlotService] = useState("generic");
  const [newSlotTime, setNewSlotTime] = useState("09:00");

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
  }, []);

  if (!mounted) return null;

  const slotsForSelectedDay = slots.filter(
    slot => date && slot.startTime.toDateString() === date.toDateString()
  ).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const [hours, minutes] = newSlotTime.split(":").map(Number);
    const startTime = new Date(date);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    const newSlot: CalendarSlot = {
      id: `slot-${Date.now()}`,
      startTime,
      endTime,
      serviceId: newSlotService === "generic" ? undefined : newSlotService,
      isBooked: false
    };

    setSlots([...slots, newSlot]);
    setIsDialogOpen(false);
    toast({
      title: "Hueco creado",
      description: `Sesión programada para las ${newSlotTime} correctamente.`
    });
  };

  const handleQuickSetup = () => {
    if (!date) return;
    setIsConfiguring(true);

    setTimeout(() => {
      const morningHours = ["09:00", "10:00", "11:00", "12:00", "13:00"];
      const newQuickSlots = morningHours.map((time, index) => {
        const [h, m] = time.split(":").map(Number);
        const start = new Date(date);
        start.setHours(h, m, 0, 0);
        const end = new Date(start);
        end.setHours(start.getHours() + 1);

        return {
          id: `quick-${date.getTime()}-${index}`,
          startTime: start,
          endTime: end,
          serviceId: undefined, // Hueco genérico
          isBooked: false
        };
      });

      const filteredNewSlots = newQuickSlots.filter(newSlot => 
        !slots.some(existing => existing.startTime.getTime() === newSlot.startTime.getTime())
      );

      if (filteredNewSlots.length === 0) {
        toast({
          variant: "destructive",
          title: "Horario ya configurado",
          description: "Ya existen huecos para las horas de la mañana en esta fecha."
        });
      } else {
        setSlots([...slots, ...filteredNewSlots]);
        toast({
          title: "Horario configurado",
          description: `Se han añadido ${filteredNewSlots.length} huecos libres genéricos para la mañana.`
        });
      }
      setIsConfiguring(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-primary uppercase">Agenda y Citas</h1>
          <p className="text-sm text-muted-foreground">Control de disponibilidad y reservas del centro.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
           <Button 
              variant="outline"
              onClick={handleQuickSetup}
              disabled={isConfiguring}
              className="border-primary/50 text-primary hover:bg-primary/5 font-bold shadow-sm"
            >
              {isConfiguring ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
              Mañana Rápida (Libre)
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="default" className="font-bold shadow-md w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Nuevo Hueco
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreateSlot}>
                  <DialogHeader>
                    <DialogTitle>Programar Nuevo Hueco</DialogTitle>
                    <DialogDescription>
                      Añade disponibilidad al calendario para el {date?.toLocaleDateString('es-ES')}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="service">Tipo de Hueco</Label>
                      <Select value={newSlotService} onValueChange={setNewSlotService}>
                        <SelectTrigger id="service">
                          <SelectValue placeholder="Selecciona servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="generic">Hueco Libre (Cualquier servicio)</SelectItem>
                          {allServices.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Hora de Inicio</Label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={newSlotTime} 
                        onChange={(e) => setNewSlotTime(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Disponibilidad
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </div>
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
                          <p className="font-bold text-base sm:text-lg truncate">
                            {service ? service.name : "Hueco Libre (Genérico)"}
                          </p>
                          {slot.isBooked ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <User className="h-3.5 w-3.5 shrink-0" />
                              <span className="font-medium truncate">{client?.name}</span>
                            </div>
                          ) : (
                            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1">
                              {service ? "Disponible para " + service.name : "Disponible para cualquier servicio"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        {slot.isBooked ? (
                          <Badge className="px-3 py-1">Reservado</Badge>
                        ) : (
                          <Badge variant="outline" className="px-3 py-1 text-green-600 border-green-200 bg-green-50">
                            Libre
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">Editar</Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-16 bg-muted/10 rounded-xl border-2 border-dashed px-4">
                  <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-muted-foreground font-medium italic">No hay huecos configurados.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 border-primary/30 hover:bg-primary/5"
                    onClick={handleQuickSetup}
                    disabled={isConfiguring}
                  >
                    {isConfiguring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                    Configurar horario libre rápido (Mañana)
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
