import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { emailTemplates, services } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EmailsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Plantillas de Email</h1>
                <p className="text-muted-foreground">Personaliza los emails automáticos que se envían a los clientes al completar una sesión.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {services.filter(s => s.id === 'pilates').map(service => ( // Example for one service with templates
                    <AccordionItem key={service.id} value={service.id}>
                        <AccordionTrigger className="text-xl font-headline">Emails de Bono de {service.name}</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-6 p-2">
                            {emailTemplates.filter(t => t.serviceId === service.id).map(template => (
                                <Card key={template.id}>
                                    <CardHeader>
                                        <CardTitle>Email para {template.bonoStep} sesiones restantes</CardTitle>
                                        <CardDescription>Este email se envía cuando a un cliente le quedan {template.bonoStep} sesiones en su bono de {service.name}.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`subject-${template.id}`}>Asunto</Label>
                                            <Input id={`subject-${template.id}`} defaultValue={template.subject} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`body-${template.id}`}>Cuerpo</Label>
                                            <Textarea id={`body-${template.id}`} defaultValue={template.body} rows={5} />
                                            <p className="text-xs text-muted-foreground">Puedes usar {'{clientName}'} como marcador de posición.</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button>Guardar Plantilla</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
