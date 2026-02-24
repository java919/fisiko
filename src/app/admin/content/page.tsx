import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceContent, services } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ContentPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="font-headline text-3xl font-bold">Gestión de Contenido</h1>
                <p className="text-muted-foreground">Gestiona el contenido exclusivo para cada servicio.</p>
                </div>
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Contenido
                </Button>
            </div>
            <Tabs defaultValue={services[0].id} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {services.map(service => (
                        <TabsTrigger key={service.id} value={service.id}>{service.name}</TabsTrigger>
                    ))}
                </TabsList>
                {services.map(service => (
                    <TabsContent key={service.id} value={service.id}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Contenido de {service.name}</CardTitle>
                                <CardDescription>Contenido visible para clientes con este servicio.</CardDescription>
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
        </div>
    )
}
