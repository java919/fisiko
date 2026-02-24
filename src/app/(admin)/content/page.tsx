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
                <h1 className="font-headline text-3xl font-bold">Content Management</h1>
                <p className="text-muted-foreground">Manage exclusive content for each service.</p>
                </div>
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Content
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
                                <CardTitle>{service.name} Content</CardTitle>
                                <CardDescription>Content visible to clients with this service.</CardDescription>
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
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                         </DropdownMenu>
                                    </div>
                                ))}
                                {serviceContent.filter(c => c.serviceId === service.id).length === 0 && (
                                    <div className="text-center py-16">
                                        <p className="text-muted-foreground">No content for this service yet.</p>
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
