"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clinics } from "@/lib/data";
import { Building2, Copy, CheckCircle2, QrCode, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClinicSettingsPage() {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const clinic = clinics[0];

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(clinic.code);
        setCopied(true);
        toast({ title: "Código copiado", description: "Comparte este código con tus clientes." });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Ajustes de la Clínica</h1>
                <p className="text-muted-foreground">Configura la identidad de tu centro y gestiona el acceso de tus clientes.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 shadow-sm">
                    <CardHeader className="bg-primary/5 border-b">
                        <CardTitle className="font-headline text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            Identidad del Centro
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label>Nombre de la Clínica</Label>
                            <Input defaultValue={clinic.name} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email de Administración</Label>
                            <Input defaultValue={clinic.adminEmail} type="email" />
                        </div>
                        <Button className="w-full font-bold">Guardar Cambios</Button>
                    </CardContent>
                </Card>

                <Card className="border-2 border-accent/20 shadow-md bg-accent/5">
                    <CardHeader className="border-b bg-accent/10">
                        <CardTitle className="font-headline text-lg flex items-center gap-2 text-accent-foreground">
                            <QrCode className="h-5 w-5" />
                            Acceso para Clientes
                        </CardTitle>
                        <CardDescription>Comparte este código exclusivo para que los clientes se vinculen a tu clínica.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 text-center space-y-6">
                        <div className="p-8 border-4 border-dashed border-accent/30 rounded-2xl bg-background">
                            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground mb-4">Código de Vinculación</p>
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-4xl font-black text-primary tracking-tighter uppercase">{clinic.code}</span>
                                <Button variant="outline" size="sm" onClick={copyToClipboard} className="border-accent/50 hover:bg-accent/10">
                                    {copied ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                                    {copied ? "¡Copiado!" : "Copiar Código"}
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg text-xs font-medium text-muted-foreground">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Solo los clientes con este código podrán ver tus servicios y bonos.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
