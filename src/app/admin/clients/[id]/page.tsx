"use client"

import { useState, use, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { clients as initialClients, clientServices as initialClientServices, services as allServices, sessions as initialSessions } from "@/lib/data";
import { ArrowLeft, CheckCircle, PlusCircle, Cake, ShieldCheck, Save, CalendarCheck2, Activity } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type Props = {
  params: Promise<{ id: string }>;
};

export default function ClientDetailPage({ params }: Props) {
  const { id } = use(params);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  
  const [subscriptions, setSubscriptions] = useState(initialClientServices.filter(cs => cs.clientId === id));
  const [client, setClient] = useState(initialClients.find(c => c.id === id));
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  
  const [selectedServiceId, setSelectedServiceId] = useState(allServices[0]?.id || "");
  const [numSessions, setNumSessions] = useState("10");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const clientSessions = initialSessions
    .filter(s => s.clientId === id)
    .sort((a,b) => b.completedAt.getTime() - a.completedAt.getTime());

  const totalVisits = clientSessions.length;

  if (!client) {
    return <div className="p-8 text-center font-bold">Cliente no encontrado</div>;
  }

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const service = allServices.find(s => s.id === selectedServiceId);
    if (!service) return;

    const newSub = {
      clientId: id,
      serviceId: selectedServiceId,
      clinicId: client.clinicId,
      totalSessions: parseInt(numSessions),
      remainingSessions: parseInt(numSessions)
    };

    setSubscriptions(prev => {
      const existingIndex = prev.findIndex(s => s.serviceId === selectedServiceId);
      if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].totalSessions += newSub.totalSessions;
          updated[existingIndex].remainingSessions += newSub.remainingSessions;
          return updated;
      }
      return [...prev, newSub];
    });

    setIsAddServiceOpen(false);
    toast({
      title: "Bono añadido",
      description: `Se han asignado ${numSessions} sesiones a ${client.name}.`
    });
  };

  const handleValidateSession = (serviceId: string) => {
    setSubscriptions(prev => prev.map(s => {
        if (s.serviceId === serviceId && s.remainingSessions > 0) {
            return { ...s, remainingSessions: s.remainingSessions - 1 };
        }
        return s;
    }));
    toast({ title: "Sesión validada", description: "Se ha descontado una sesión correctamente." });
  };

  const clientInitials = client.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      <Link href="/admin/clients" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Volver a Clientes
      </Link>
      
      <div className="flex flex-col md:flex-row items-start gap-6 bg-card p-6 rounded-2xl border-2 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Activity className="h-32 w-32 text-primary" />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
            <Avatar className="h-24 w-24 border-4 border-primary/10 shadow-md">
                <AvatarImage src={client.avatarUrl} alt={client.name}/>
                <AvatarFallback className="text-3xl font-bold">{clientInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 text-center sm:text-left">
                <h1 className="font-headline text-3xl font-bold tracking-tight">{client.name}</h1>
                <p className="text-muted-foreground mb-4">{client.email}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <CalendarCheck2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-primary leading-none">{totalVisits}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Visitas Totales</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-center gap-2">
                          <Cake className="h-4 w-4 text-primary" />
                          <Label className="text-xs font-bold uppercase whitespace-nowrap">Nacimiento</Label>
                        </div>
                        <Input 
                            type="date" 
                            defaultValue={client.birthday} 
                            readOnly
                            className="h-9 w-40 text-xs bg-background cursor-not-allowed" 
                        />
                    </div>
                </div>
            </div>
            <div className="sm:ml-auto w-full sm:w-auto">
                <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto font-bold border-2">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Añadir Bono
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAddService}>
                            <DialogHeader>
                                <DialogTitle>Asignar Nuevo Bono</DialogTitle>
                                <DialogDescription>Selecciona el servicio para {client.name}.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Servicio</Label>
                                    <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona servicio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allServices.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.name} ({s.price}€)</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Sesiones</Label>
                                    <Input 
                                        type="number" 
                                        value={numSessions} 
                                        onChange={(e) => setNumSessions(e.target.value)}
                                        min="1"
                                        required 
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full font-bold">Asignar</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Servicios Activos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              {subscriptions.map(sub => {
                  const service = allServices.find(s => s.id === sub.serviceId);
                  if (!service) return null;
                  return (
                      <div key={service.id} className="p-5 border-2 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-muted/5">
                          <div className="flex-1">
                              <h3 className="font-bold text-lg">{service.name}</h3>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          <div className="flex items-center gap-6">
                              <div className="text-center">
                                  <p className="text-2xl font-black text-primary">{sub.remainingSessions}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold">restantes</p>
                              </div>
                              <Button 
                                disabled={sub.remainingSessions === 0} 
                                onClick={() => handleValidateSession(service.id)}
                              >
                                Validar
                              </Button>
                          </div>
                      </div>
                  )
              })}
              {subscriptions.length === 0 && <p className="text-muted-foreground text-center py-8 italic">Sin servicios activos.</p>}
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Historial</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead className="pl-6">Servicio</TableHead>
                      <TableHead className="text-right pr-6">Ingreso</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {clientSessions.map(session => (
                      <TableRow key={session.id}>
                          <TableCell className="pl-6 font-medium">
                              {allServices.find(s => s.id === session.serviceId)?.name}
                              <p className="text-[10px] text-muted-foreground">{session.completedAt.toLocaleDateString()}</p>
                          </TableCell>
                          <TableCell className="text-right pr-6 font-bold text-primary">{session.revenue}€</TableCell>
                      </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
