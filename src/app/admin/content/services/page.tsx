"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceContent as initialContent, services } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Library, Sparkles, Loader2, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateHealthContent } from "@/ai/flows/generate-content-flow";

export default function ServiceContentPage() {
    const { toast } = useToast();
    const [contentList, setContentList] = useState(initialContent);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingContent, setEditingContent] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formType, setFormType] = useState<'text' | 'image' | 'video'>('text');
    const [aiPrompt, setAiPrompt] = useState("");
    const [selectedServiceId, setSelectedServiceId] = useState(services[0].id);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editingContent) {
            setContentList(contentList.map(c => 
                c.id === editingContent.id 
                ? { ...c, title: formTitle, content: formContent, type: formType, serviceId: selectedServiceId } 
                : c
            ));
            toast({ title: "Contenido Actualizado", description: "Cambios guardados en la biblioteca." });
        } else {
            const newContent = {
                id: `c-${Date.now()}`,
                serviceId: selectedServiceId,
                title: formTitle,
                type: formType,
                content: formContent,
            };
            setContentList([newContent, ...contentList]);
            toast({ title: "Contenido Publicado", description: "Añadido a la biblioteca general." });
        }
        
        setIsDialogOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormTitle("");
        setFormContent("");
        setFormType("text");
        setAiPrompt("");
        setEditingContent(null);
    };

    const handleEdit = (content: any) => {
        setEditingContent(content);
        setFormTitle(content.title);
        setFormContent(content.content);
        setFormType(content.type as any);
        setSelectedServiceId(content.serviceId);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setContentList(contentList.filter(c => c.id !== id));
        toast({ variant: "destructive", title: "Contenido Eliminado", description: "Retirado de la biblioteca." });
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt) {
            toast({ variant: "destructive", title: "Instrucciones vacías", description: "Por favor, escribe qué contenido quieres generar." });
            return;
        }

        setIsGenerating(true);
        try {
            const serviceName = services.find(s => s.id === selectedServiceId)?.name;
            const result = await generateHealthContent({
                instructions: `Genera una guía educativa técnica para ${serviceName}: ${aiPrompt}`,
                type: 'exercise',
            });

            if (result) {
                setFormTitle(result.title);
                setFormContent(result.content);
                toast({ title: "Contenido generado por IA", description: "Se ha creado una propuesta técnica basada en tus instrucciones." });
            }
        } catch (error: any) {
            console.error("AI Generation Error:", error);
            toast({ 
                variant: "destructive", 
                title: "Error de IA", 
                description: error.message || "No se pudo conectar con el asistente. Inténtalo de nuevo." 
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-primary">Biblioteca por Servicio</h1>
                <p className="text-sm text-muted-foreground">Recursos compartidos para todos los clientes suscritos.</p>
            </div>

            <Tabs defaultValue={services[0].id} onValueChange={setSelectedServiceId} className="w-full">
                <TabsList className="flex flex-wrap h-auto bg-transparent p-0 gap-2 overflow-x-auto">
                    {services.map(service => (
                        <TabsTrigger 
                            key={service.id} 
                            value={service.id}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border px-4 py-2 rounded-full transition-all"
                        >
                            {service.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {services.map(service => (
                    <TabsContent key={service.id} value={service.id} className="mt-6">
                        <Card className="border-2 shadow-sm overflow-hidden">
                            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/5 gap-4 border-b p-4">
                                <div>
                                    <CardTitle className="text-lg font-headline">Recursos de {service.name}</CardTitle>
                                    <CardDescription>Visible para clientes con bono de {service.name}.</CardDescription>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                    setIsDialogOpen(open);
                                    if (!open) resetForm();
                                }}>
                                    <DialogTrigger asChild>
                                        <Button onClick={resetForm} size="sm" className="font-bold"><PlusCircle className="mr-2 h-4 w-4" /> Nuevo Recurso</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl w-[95vw] rounded-xl max-h-[90vh] overflow-y-auto">
                                        <form onSubmit={handleSave}>
                                            <DialogHeader>
                                                <DialogTitle>{editingContent ? 'Editar Recurso' : `Nuevo para ${service.name}`}</DialogTitle>
                                                <DialogDescription>Crea guías educativas apoyándote en la IA FISIKO.</DialogDescription>
                                            </DialogHeader>
                                            
                                            <div className="grid gap-4 py-4">
                                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                                        <Sparkles className="h-4 w-4" /> Asistente IA FISIKO
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <Input 
                                                            placeholder="Ej: Consejos posturales para pilates..." 
                                                            value={aiPrompt}
                                                            onChange={(e) => setAiPrompt(e.target.value)}
                                                            className="bg-background"
                                                        />
                                                        <Button type="button" variant="secondary" onClick={handleGenerateAI} disabled={isGenerating || !aiPrompt} className="shrink-0 font-bold">
                                                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                                                            Generar
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="title">Título del Recurso</Label>
                                                    <Input id="title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="content">Descripción / Guía Detallada</Label>
                                                    <Textarea id="content" value={formContent} onChange={(e) => setFormContent(e.target.value)} className="min-h-[150px]" required />
                                                </div>
                                            </div>

                                            <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
                                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                                <Button type="submit" className="font-bold">
                                                    {editingContent ? 'Guardar Cambios' : 'Publicar Recurso'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                {contentList.filter(c => c.serviceId === service.id).map(content => (
                                    <div key={content.id} className="p-3 border-2 rounded-xl flex items-center justify-between hover:bg-muted/5 transition-all shadow-sm bg-card group">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                <Library className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold truncate text-sm">{content.title}</h3>
                                                <p className="text-[10px] text-muted-foreground line-clamp-1">{content.content}</p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem onSelect={() => handleEdit(content)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(content.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                                {contentList.filter(c => c.serviceId === service.id).length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                        <Library className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                                        <p className="text-sm text-muted-foreground italic">No hay recursos en esta categoría.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
