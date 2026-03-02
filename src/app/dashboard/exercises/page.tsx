"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceContent, services as allServices, clientServices, personalizedContent } from "@/lib/data";
import { PlayCircle, Star, Apple, Dumbbell, FileText } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function ExercisesPage() {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Mocking user as Juan Perez (ID 1)
    const currentUserId = '1';
    const userSubscriptions = clientServices.filter(cs => cs.clientId === currentUserId);
    const subscribedServiceIds = userSubscriptions.map(sub => sub.serviceId);
    const availableServices = allServices.filter(s => subscribedServiceIds.includes(s.id));

    // Contenido personalizado asignado a Juan
    const myPersonalizedPlans = personalizedContent.filter(p => p.assignedClientIds.includes(currentUserId));

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Contenido Exclusivo</h1>
                <p className="text-muted-foreground">Tu biblioteca de ejercicios, dietas y planes personalizados de FISIKO.</p>
            </div>

            {/* SECCIÓN DE PLANES PERSONALIZADOS */}
            {myPersonalizedPlans.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-accent fill-accent" />
                        <h2 className="font-headline text-2xl font-bold">Mis Planes Personalizados</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        {myPersonalizedPlans.map(plan => (
                            <Card key={plan.id} className="overflow-hidden border-2 border-accent/20 bg-accent/5 hover:border-accent/40 transition-all">
                                <div className="flex flex-col md:flex-row">
                                    {plan.imageUrl && (
                                        <div className="md:w-1/3 aspect-square md:aspect-auto relative overflow-hidden">
                                            <Image 
                                                src={plan.imageUrl} 
                                                alt={plan.title} 
                                                fill 
                                                className="object-cover"
                                                data-ai-hint={plan.imageHint} 
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-accent text-accent-foreground border-none">Personalizado</Badge>
                                            <div className="text-primary">
                                                {plan.type === 'diet' ? <Apple className="h-4 w-4" /> : plan.type === 'exercise' ? <Dumbbell className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                            </div>
                                        </div>
                                        <CardTitle className="font-headline text-xl mb-2">{plan.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground mb-4">{plan.content}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Creado el {plan.createdAt.toLocaleDateString('es-ES')}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* SECCIÓN DE CONTENIDO POR SERVICIO */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <h2 className="font-headline text-2xl font-bold">Por Servicio Contratado</h2>
                </div>
                
                {availableServices.length > 0 ? (
                    <Tabs defaultValue={availableServices[0]?.id} className="w-full">
                        <TabsList className="mb-6 flex flex-wrap h-auto bg-transparent p-0 gap-2">
                            {availableServices.map(service => (
                                <TabsTrigger 
                                    key={service.id} 
                                    value={service.id}
                                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-2 border-muted h-10 px-6 rounded-full"
                                >
                                    {service.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {availableServices.map(service => (
                            <TabsContent key={service.id} value={service.id}>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {serviceContent.filter(c => c.serviceId === service.id).map(content => (
                                        <Card key={content.id} className="overflow-hidden group border-2 hover:border-primary/30 transition-all">
                                            {content.imageUrl && (
                                                <div className="aspect-video relative overflow-hidden">
                                                    <Image 
                                                      src={content.imageUrl} 
                                                      alt={content.title} 
                                                      fill 
                                                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                                                      data-ai-hint={content.imageHint} 
                                                    />
                                                    {content.type === 'video' && (
                                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                                                      </div>
                                                    )}
                                                </div>
                                            )}
                                            <CardHeader>
                                                <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">{content.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{content.content}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {serviceContent.filter(c => c.serviceId === service.id).length === 0 && (
                                        <div className="md:col-span-3 text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed">
                                            <p className="text-muted-foreground font-medium italic">Aún no hay contenido específico para {service.name}.</p>
                                            <p className="text-xs text-muted-foreground mt-1">¡Vuelve pronto para ver las novedades!</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                ) : (
                    <Card className="text-center py-20 bg-muted/10 border-2 border-dashed">
                        <CardContent className="space-y-4">
                            <Dumbbell className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                            <div>
                                <h3 className="font-bold text-xl mb-1">No tienes servicios activos</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">Contrata un servicio en FISIKO para acceder a vídeos, guías y rutinas exclusivas de nuestros profesionales.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    )
}
