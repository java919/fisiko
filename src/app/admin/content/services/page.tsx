"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceContent as initialContent, services } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Library, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
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
            toast({ title: "Contenido Actualizado", description: "Los cambios se han guardado en la biblioteca." });
        } else {
            const newContent = {
                id: `c-${Date.now()}`,
                serviceId: selectedServiceId,
                title: formTitle,
                type: formType,
                content: formContent,
            };
            setContentList([newContent, ...contentList]);
            toast({ title: "Contenido Publicado", description: "Se ha añadido a la biblioteca general." });
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
        setFormType(content.type);
        setSelectedServiceId(content.serviceId);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setContentList(contentList.filter(c => c.id !== id));
        toast({ variant: "destructive", title: "Contenido Eliminado", description: "Se ha retirado de la biblioteca." });
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt) {
            toast({ variant: "destructive", title: "Instrucciones vacías", description: "Dinos sobre qué quieres generar contenido." });
            return;
        }

        setIsGenerating(true);
        try {
            const serviceName = services.find(s => s.id === selectedServiceId)?.name;
            const result = await generateHealthContent({
                instructions: `Genera una guía técnica para el servicio de ${serviceName}: ${aiPrompt}`,
                type: 'exercise',
            });

            if (result) {
                setFormTitle(result.title);
                setFormContent(result.content);
                toast({ title: "IA FISIKO ha respondido", description: "Contenido educativo generado para el servicio." });
            }
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error de IA", description: "No se pudo procesar la solicitud." });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-primary">Biblioteca por Servicio</h1>
                <p className="text-sm text-muted-foreground">Gestiona recursos visibles para todos los suscritos a cada servicio.</p>
            </div>

            <Tabs defaultValue={services[0].id} onValueChange={setSelectedServiceId} className="w-full">
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <TabsList className="inline-flex w-auto min-w-full md:min-w-0 bg-transparent gap-2 p-0 h-auto">
                        {services.map(service => (
                            <TabsTrigger 
                                key={service.id} 
                                value={service.id}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border shadow-sm px-6 py-2 rounded-full transition-all whitespace-nowrap"
                            >
                                {service.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {services.map(service => (
                    <TabsContent key={service.id} value={service.id} className="mt-6">
                        <Card className="border-2 shadow-sm overflow-hidden">
                            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/10 gap-4 border-b p-4 sm:p-6">
                                <div>
                                    <CardTitle className="text-xl font-headline">Recursos de {service.name}</CardTitle>
                                    <CardDescription>Visible para cualquier cliente con bono de {service.name}.</CardDescription>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                    setIsDialogOpen(open);
                                    if (!open) resetForm();
                                }}>
                                    <DialogTrigger asChild>
                                        <Button onClick={resetForm} className="w-full sm:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> Nuevo Contenido</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl w-[95vw] rounded-xl max-h-[95vh] overflow-y-auto">
                                        <form onSubmit={handleSave}>
                                            <DialogHeader>
                                                <DialogTitle>{editingContent ? 'Editar Contenido de Biblioteca' : `Nuevo para ${service.name}`}</DialogTitle>
                                                <DialogDescription>Crea guías educativas apoyándote en la IA de FISIKO (Sin Censura).</DialogDescription>
                                            </DialogHeader>
                                            
                                            <div className="grid gap-6 py-4">
                                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                                                    <div className="flex items-center gap-2 text-primary">
                                                        <Sparkles className="h-4 w-4" />
                                                        <span className="text-sm font-bold uppercase">Asistente IA FISIKO</span>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <Input 
                                                            placeholder="Ej: Recomendaciones post-fisioterapia para hombro..." 
                                                            value={aiPrompt}
                                                            onChange={(e) => setAiPrompt(e.target.value)}
                                                        />
                                                        <Button type="button" variant="secondary" onClick={handleGenerateAI} disabled={isGenerating || !aiPrompt}>
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
                                                    <Label htmlFor="content">Descripción / Guía Paso a Paso</Label>
                                                    <Textarea id="content" value={formContent} onChange={(e) => setFormContent(e.target.value)} className="min-h-[200px]" required />
                                                </div>
                                            </div>

                                            <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
                                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                                <Button type="submit">
                                                    {editingContent ? 'Guardar Cambios' : 'Publicar en Biblioteca'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 space-y-4">
                                {contentList.filter(c => c.serviceId === service.id).map(content => (
                                    <div key={content.id} className="p-4 border rounded-xl flex items-center justify-between hover:bg-muted/5 transition-all shadow-sm bg-card group">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {content.imageUrl ? (
                                                <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0">
                                                    <Image src={content.imageUrl} alt={content.title} fill className="rounded-lg object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                                                    <Library className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/30" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h3 className="font-bold truncate group-hover:text-primary transition-colors text-sm sm:text-base">{content.title}</h3>
                                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{content.content}</p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleEdit(content); }}>
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(content.id)}>
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                                {contentList.filter(c => c.serviceId === service.id).length === 0 && (
                                    <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/5">
                                        <Library className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                                        <p className="text-muted-foreground italic text-sm">No hay contenido todavía para este servicio.</p>
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
