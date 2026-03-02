"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceContent, services, personalizedContent as initialPersonalized, clients } from "@/lib/data";
import { MoreHorizontal, PlusCircle, User, Apple, Dumbbell, FileText } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function ContentPage() {
    const { toast } = useToast();
    const [persContent, setPersContent] = useState(initialPersonalized);
    const [isPersDialogOpen, setIsPersDialogOpen] = useState(false);
    const [selectedClients, setSelectedClients] = useState<string[]>([]);

    const handleSavePersonalized = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const type = formData.get("type") as 'exercise' | 'diet' | 'other';
        const content = formData.get("content") as string;

        const newContent = {
            id: `p-${Date.now()}`,
            title,
            type,
            content,
            assignedClientIds: selectedClients,
            createdAt: new Date(),
        };

        setPersContent([newContent, ...persContent]);
        toast({ title: "Contenido Personalizado Creado", description: `Se ha asignado a ${selectedClients.length} clientes.` });
        setIsPersDialogOpen(false);
        setSelectedClients([]);
    };

    const toggleClientSelection = (clientId: string) => {
        setSelectedClients(prev => 
            prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Gestión de Contenido</h1>
                    <p className="text-muted-foreground">Administra el contenido general por servicios y planes personalizados para clientes.</p>
                </div>
            </div>

            <Tabs defaultValue="services" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="services">Por Servicio</TabsTrigger>
                    <TabsTrigger value="personalized">Planes Personalizados</TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="space-y-6 mt-6">
                    <Tabs defaultValue={services[0].id} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                            {services.map(service => (
                                <TabsTrigger key={service.id} value={service.id}>{service.name}</TabsTrigger>
                            ))}
                        </TabsList>
                        {services.map(service => (
                            <TabsContent key={service.id} value={service.id}>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Contenido de {service.name}</CardTitle>
                                            <CardDescription>Contenido visible para clientes con este servicio.</CardDescription>
                                        </div>
                                        <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Añadir</Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {serviceContent.filter(c => c.serviceId === service.id).map(content => (
                                            <div key={content.id} className="p-4 border rounded-lg flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {content.imageUrl && (
                                                        <Image src={content.imageUrl} alt={content.title} width={64} height={64} className="rounded-md object-cover aspect-square" data-ai-hint={content.imageHint} />
                                                    )}
                                                    <div>
                                                        <h3 className="font-semibold">{content.title}</h3>
                                                        <p className="text-sm text-muted-foreground truncate max-w-md">{content.content}</p>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem>Editar</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                        {serviceContent.filter(c => c.serviceId === service.id).length === 0 && (
                                            <div className="text-center py-16">
                                                <p className="text-muted-foreground">No hay contenido para este servicio todavía.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </TabsContent>

                <TabsContent value="personalized" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-headline">Planes Exclusivos por Cliente</CardTitle>
                                <CardDescription>Dietas, rutinas y guías asignadas a personas específicas.</CardDescription>
                            </div>
                            <Dialog open={isPersDialogOpen} onOpenChange={setIsPersDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="font-bold"><PlusCircle className="mr-2 h-4 w-4" /> Nuevo Plan Personalizado</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <form onSubmit={handleSavePersonalized}>
                                        <DialogHeader>
                                            <DialogTitle>Crear Contenido Personalizado</DialogTitle>
                                            <DialogDescription>Define el contenido y selecciona a qué clientes se le mostrará.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="title">Título del Plan</Label>
                                                    <Input id="title" name="title" placeholder="Ej: Dieta Keto para Juan" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="type">Tipo de Contenido</Label>
                                                    <select name="type" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                                        <option value="diet">Dieta</option>
                                                        <option value="exercise">Ejercicio</option>
                                                        <option value="other">Otro</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="content">Descripción / Instrucciones</Label>
                                                <Textarea id="content" name="content" placeholder="Escribe aquí los detalles del plan..." className="min-h-[120px]" required />
                                            </div>
                                            <div className="space-y-3">
                                                <Label>Asignar a Clientes</Label>
                                                <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-2 border rounded-md">
                                                    {clients.map(client => (
                                                        <div key={client.id} className="flex items-center space-x-2">
                                                            <Checkbox 
                                                                id={`client-${client.id}`} 
                                                                checked={selectedClients.includes(client.id)}
                                                                onCheckedChange={() => toggleClientSelection(client.id)}
                                                            />
                                                            <Label htmlFor={`client-${client.id}`} className="text-xs cursor-pointer">{client.name}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsPersDialogOpen(false)}>Cancelar</Button>
                                            <Button type="submit" disabled={selectedClients.length === 0}>Publicar Plan</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {persContent.map(content => (
                                <div key={content.id} className="p-4 border rounded-lg bg-accent/5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                {content.type === 'diet' ? <Apple className="h-5 w-5" /> : content.type === 'exercise' ? <Dumbbell className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{content.title}</h3>
                                                <p className="text-xs text-muted-foreground">{new Date(content.createdAt).toLocaleDateString('es-ES')}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                    <p className="text-sm mb-4 line-clamp-2">{content.content}</p>
                                    <div className="flex flex-wrap gap-1">
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground mr-2">Asignado a:</span>
                                        {content.assignedClientIds.map(cid => {
                                            const client = clients.find(c => c.id === cid);
                                            return (
                                                <Badge key={cid} variant="secondary" className="text-[9px] px-1 py-0 h-4">
                                                    <User className="h-2 w-2 mr-1" />
                                                    {client?.name}
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                            {persContent.length === 0 && (
                                <div className="text-center py-20 bg-muted/10 rounded-xl border-2 border-dashed">
                                    <p className="text-muted-foreground italic">No has creado planes personalizados todavía.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
