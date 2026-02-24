import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceContent, services as allServices, clientServices } from "@/lib/data";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

export default function ExercisesPage() {
    // Mocking user as Juan Perez (ID 1), who has pilates and physio
    const userSubscriptions = clientServices.filter(cs => cs.clientId === '1');
    const subscribedServiceIds = userSubscriptions.map(sub => sub.serviceId);
    const availableServices = allServices.filter(s => subscribedServiceIds.includes(s.id));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Mis Ejercicios</h1>
                <p className="text-muted-foreground">Contenido exclusivo para tus servicios suscritos.</p>
            </div>
            {availableServices.length > 0 ? (
                <Tabs defaultValue={availableServices[0]?.id} className="w-full">
                    <TabsList>
                        {availableServices.map(service => (
                            <TabsTrigger key={service.id} value={service.id}>{service.name}</TabsTrigger>
                        ))}
                    </TabsList>
                    {availableServices.map(service => (
                        <TabsContent key={service.id} value={service.id}>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {serviceContent.filter(c => c.serviceId === service.id).map(content => (
                                    <Card key={content.id} className="overflow-hidden group">
                                        {content.imageUrl && (
                                            <div className="aspect-video relative">
                                                <Image src={content.imageUrl} alt={content.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={content.imageHint} />
                                                {content.type === 'video' && <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><PlayCircle className="w-12 h-12 text-white" /></div>}
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="font-headline">{content.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-3">{content.content}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                                {serviceContent.filter(c => c.serviceId === service.id).length === 0 && (
                                    <div className="md:col-span-3 text-center py-16">
                                        <p className="text-muted-foreground">Aún no hay contenido para este servicio. ¡Vuelve pronto!</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <Card className="text-center py-16">
                    <CardContent>
                        <h3 className="font-semibold mb-2">No Hay Contenido Disponible</h3>
                        <p className="text-muted-foreground">Suscríbete a un servicio para ver contenido exclusivo.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
