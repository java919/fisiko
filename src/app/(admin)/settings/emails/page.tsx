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
                <h1 className="font-headline text-3xl font-bold">Email Templates</h1>
                <p className="text-muted-foreground">Customize automated emails sent to clients when a session is completed.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {services.filter(s => s.id === 'pilates').map(service => ( // Example for one service with templates
                    <AccordionItem key={service.id} value={service.id}>
                        <AccordionTrigger className="text-xl font-headline">{service.name} Bono Emails</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-6 p-2">
                            {emailTemplates.filter(t => t.serviceId === service.id).map(template => (
                                <Card key={template.id}>
                                    <CardHeader>
                                        <CardTitle>Email for {template.bonoStep} sessions remaining</CardTitle>
                                        <CardDescription>This email is sent when a client has {template.bonoStep} sessions left on their {service.name} bono.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`subject-${template.id}`}>Subject</Label>
                                            <Input id={`subject-${template.id}`} defaultValue={template.subject} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`body-${template.id}`}>Body</Label>
                                            <Textarea id={`body-${template.id}`} defaultValue={template.body} rows={5} />
                                            <p className="text-xs text-muted-foreground">You can use {'{clientName}'} as a placeholder.</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button>Save Template</Button>
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
