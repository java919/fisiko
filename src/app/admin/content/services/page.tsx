
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
                ? { ...c, title: formTitle, content: formContent, type: formType } 
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
            toast({ title: "Contenido Añadido", description: "Se ha publicado en la biblioteca del servicio." });
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
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setContentList(contentList.filter(c => c.id !== id));
        toast({ variant: "destructive", title: "Contenido Borrado", description: "Se ha eliminado de la biblioteca." });
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt) {
            toast({ variant: "destructive", title: "Instrucciones vacías", description: "Escribe qué quieres generar para este servicio." });
            return;
        }

        setIsGenerating(true);
        try {
            const serviceName = services.find(s => s.id === selectedServiceId)?.name;
            const result = await generateHealthContent({
                instructions: `Genera contenido educativo para el servicio de ${serviceName}: ${aiPrompt}`,
                type: 'exercise',
            });

            setFormTitle(result.title);
            setFormContent(result.content);
            toast({ title: "¡IA ha respondido!", description: "Contenido generado para el servicio." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error de IA", description: "No se pudo generar el contenido." });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Biblioteca de Servicios</h1>
                    <p className="text-muted-foreground">Gestiona el contenido exclusivo que ven todos los clientes suscritos a cada servicio.</p>
                </div>
            </div>

            <Tabs defaultValue={services[0].id} onValueChange={setSelectedServiceId} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto bg-transparent gap-2 p-0">
                    {services.map(service => (
                        <TabsTrigger 
                            key={service.id} 
                            value={service.id}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border shadow-sm"
                        >
                            {service.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {services.map(service => (
                    <TabsContent key={service.id} value={service.id} className="mt-6">
                        <Card className="border-2">
                            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted/20 gap-4">
                                <div>
                                    <CardTitle className="text-xl">Recursos de {service.name}</CardTitle>
                                    <CardDescription>Visible para cualquier cliente con un bono de {service.name} activo.</CardDescription>
                                </div>
                                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                    setIsDialogOpen(open);
                                    if (!open) resetForm();
                                }}>
                                    <DialogTrigger asChild>
                                        <Button onClick={resetForm}><PlusCircle className="mr-2 h-4 w-4" /> Nuevo Contenido</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <form onSubmit={handleSave}>
                                            <DialogHeader>
                                                <DialogTitle>{editingContent ? 'Editar Contenido' : `Añadir a la Biblioteca de ${service.name}`}</DialogTitle>
                                                <DialogDescription>Utiliza la IA para redactar guías de ejercicios o consejos de salud.</DialogDescription>
                                            </DialogHeader>
                                            
                                            <div className="grid gap-6 py-4">
                                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                                                    <div className="flex items-center gap-2 text-primary">
                                                        <Sparkles className="h-4 w-4" />
                                                        <span className="text-sm font-bold uppercase">Asistente IA FISIKO</span>
                                                    </div>
                                                    <div className="flex gap-2">
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
                                                    <Label htmlFor="title">Título</Label>
                                                    <Input id="title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="content">Contenido</Label>
                                                    <Textarea id="content" value={formContent} onChange={(e) => setFormContent(e.target.value)} className="min-h-[150px]" required />
                                                </div>
                                            </div>

                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                                <Button type="submit">
                                                    {editingContent ? 'Guardar Cambios' : 'Publicar en Biblioteca'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {contentList.filter(c => c.serviceId === service.id).map(content => (
                                    <div key={content.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/10 transition-colors shadow-sm bg-card">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {content.imageUrl ? (
                                                <div className="relative w-16 h-16 shrink-0">
                                                    <Image src={content.imageUrl} alt={content.title} fill className="rounded-md object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                                                    <Library className="h-6 w-6 text-muted-foreground/40" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h3 className="font-semibold truncate">{content.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-1">{content.content}</p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(content)}>Editar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(content.id)}>Eliminar</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                                {contentList.filter(c => c.serviceId === service.id).length === 0 && (
                                    <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/5">
                                        <Library className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                                        <p className="text-muted-foreground italic">No hay contenido todavía para este servicio.</p>
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
