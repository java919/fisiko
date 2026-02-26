import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { emailTemplates, services } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Mail } from "lucide-react";

export default function EmailsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Plantillas de Email</h1>
                <p className="text-muted-foreground">Personaliza los emails automáticos que se envían a los clientes.</p>
            </div>

            <Accordion type="multiple" className="w-full">
                <AccordionItem value="birthdays">
                    <AccordionTrigger className="text-xl font-headline">
                        <div className="flex items-center gap-2">
                            <Gift className="h-5 w-5 text-primary" />
                            Email de Cumpleaños
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-6 p-2">
                            {emailTemplates.filter(t => t.type === 'birthday').map(template => (
                                <Card key={template.id}>
                                    <CardHeader>
                                        <CardTitle>Felicitación de Cumpleaños</CardTitle>
                                        <CardDescription>Este email se enviará automáticamente el día del cumpleaños del cliente.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`subject-${template.id}`}>Asunto</Label>
                                            <Input id={`subject-${template.id}`} defaultValue={template.subject} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`body-${template.id}`}>Cuerpo</Label>
                                            <Textarea id={`body-${template.id}`} defaultValue={template.body} rows={5} />
                                            <p className="text-xs text-muted-foreground">Usa {'{clientName}'} para personalizar con el nombre del cliente.</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button>Guardar Plantilla de Cumpleaños</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="bonos">
                    <AccordionTrigger className="text-xl font-headline">
                         <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            Gestión de Bonos
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                         <div className="space-y-6 p-2">
                            {services.map(service => {
                                const templates = emailTemplates.filter(t => t.serviceId === service.id && t.type === 'bono');
                                if (templates.length === 0) return null;
                                return (
                                    <div key={service.id} className="space-y-4">
                                        <h3 className="font-bold text-lg border-b pb-2">{service.name}</h3>
                                        {templates.map(template => (
                                            <Card key={template.id}>
                                                <CardHeader>
                                                    <CardTitle>Email para {template.bonoStep} sesiones restantes</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Asunto</Label>
                                                        <Input defaultValue={template.subject} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Cuerpo</Label>
                                                        <Textarea defaultValue={template.body} rows={4} />
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Button variant="secondary">Actualizar</Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )
                            })}
                         </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
