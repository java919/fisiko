"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { personalizedContent as initialPersonalized, clients } from "@/lib/data";
import { MoreHorizontal, PlusCircle, User, Apple, Dumbbell, FileText, Sparkles, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateHealthContent } from "@/ai/flows/generate-content-flow";

export default function PersonalizedContentPage() {
    const { toast } = useToast();
    const [persContent, setPersContent] = useState(initialPersonalized);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingContent, setEditingContent] = useState<any>(null);
    const [selectedClients, setSelectedClients] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formType, setFormType] = useState<'diet' | 'exercise' | 'other'>('exercise');
    const [aiPrompt, setAiPrompt] = useState("");

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (editingContent) {
            setPersContent(persContent.map(c => 
                c.id === editingContent.id 
                ? { ...c, title: formTitle, content: formContent, type: formType, assignedClientIds: selectedClients } 
                : c
            ));
            toast({ title: "Plan Actualizado", description: "Los cambios se han guardado correctamente." });
        } else {
            const newContent = {
                id: `p-${Date.now()}`,
                title: formTitle,
                type: formType,
                content: formContent,
                assignedClientIds: selectedClients,
                createdAt: new Date(),
            };
            setPersContent([newContent, ...persContent]);
            toast({ title: "Plan Personalizado Creado", description: `Asignado a ${selectedClients.length} clientes.` });
        }
        
        setIsDialogOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormTitle("");
        setFormContent("");
        setFormType("exercise");
        setAiPrompt("");
        setSelectedClients([]);
        setEditingContent(null);
    };

    const handleEdit = (content: any) => {
        setEditingContent(content);
        setFormTitle(content.title);
        setFormContent(content.content);
        setFormType(content.type);
        setSelectedClients(content.assignedClientIds || []);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setPersContent(persContent.filter(c => c.id !== id));
        toast({ variant: "destructive", title: "Plan Eliminado", description: "El contenido ha sido borrado." });
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt) {
            toast({ variant: "destructive", title: "Instrucciones vacías", description: "Dinos qué necesita el cliente." });
            return;
        }

        setIsGenerating(true);
        try {
            const firstClientName = selectedClients.length > 0 
                ? clients.find(c => c.id === selectedClients[0])?.name 
                : undefined;
            
            const result = await generateHealthContent({
                instructions: aiPrompt,
                type: formType,
                clientName: firstClientName
            });
            
            if (result) {
                setFormTitle(result.title);
                setFormContent(result.content);
                toast({ title: "Plan generado por IA", description: "Se ha creado una propuesta técnica basada en tu instrucción." });
            }
        } catch (error: any) {
            console.error("Error generating content:", error);
            toast({ 
                variant: "destructive", 
                title: "Error de Asistente IA", 
                description: error.message || "No se pudo generar el contenido. Prueba a ser más específico." 
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleClient = (clientId: string) => {
        setSelectedClients(prev => prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-primary">Planes Personalizados</h1>
                    <p className="text-sm text-muted-foreground">Crea y asigna dietas o rutinas exclusivas para clientes específicos.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm} className="font-bold w-full sm:w-auto shadow-md">
                            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Plan Exclusivo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto w-[95vw] rounded-xl p-4 sm:p-6">
                        <form onSubmit={handleSave}>
                            <DialogHeader>
                                <DialogTitle>{editingContent ? 'Editar Plan Personalizado' : 'Crear Contenido Personalizado'}</DialogTitle>
                                <DialogDescription>Usa el Asistente IA FISIKO para redactar planes técnicos rápidamente.</DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-6 py-4">
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Sparkles className="h-4 w-4" />
                                        <span className="text-sm font-bold uppercase tracking-wider">Asistente IA FISIKO (Profesional)</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="ai-prompt" className="text-xs text-muted-foreground">Instrucciones técnicas (ej: Dieta hipocalórica para paciente con hipotiroidismo)</Label>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Input 
                                                id="ai-prompt"
                                                placeholder="Describe el plan médico o nutricional..." 
                                                value={aiPrompt}
                                                onChange={(e) => setAiPrompt(e.target.value)}
                                                className="bg-background"
                                            />
                                            <Button type="button" variant="secondary" onClick={handleGenerateAI} disabled={isGenerating || !aiPrompt} className="shrink-0">
                                                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                                                Generar
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Título del Plan</Label>
                                        <Input id="title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Ej: Protocolo Readaptación LCA" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipo de Contenido</Label>
                                        <select value={formType} onChange={(e) => setFormType(e.target.value as any)} className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                                            <option value="exercise">Ejercicio / Rutina</option>
                                            <option value="diet">Dieta / Nutrición</option>
                                            <option value="other">Otros consejos</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Contenido Técnico</Label>
                                    <Textarea id="content" value={formContent} onChange={(e) => setFormContent(e.target.value)} className="min-h-[200px]" placeholder="Detalla los ejercicios o la dieta aquí..." required />
                                </div>

                                <div className="space-y-3">
                                    <Label>Asignar a Clientes</Label>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 max-h-[150px] overflow-y-auto p-3 border rounded-md bg-muted/5">
                                        {clients.map(client => (
                                            <div key={client.id} className="flex items-center space-x-2 p-1.5 hover:bg-muted/50 rounded transition-colors">
                                                <Checkbox id={`c-${client.id}`} checked={selectedClients.includes(client.id)} onCheckedChange={() => toggleClient(client.id)} />
                                                <Label htmlFor={`c-${client.id}`} className="text-xs cursor-pointer truncate">{client.name}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={selectedClients.length === 0}>
                                    {editingContent ? 'Guardar Cambios' : 'Publicar Plan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {persContent.map(content => (
                    <Card key={content.id} className="border-2 hover:border-primary/20 transition-all shadow-sm group bg-card">
                        <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {content.type === 'diet' ? <Apple className="h-5 w-5" /> : content.type === 'exercise' ? <Dumbbell className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="text-lg truncate font-headline">{content.title}</CardTitle>
                                    <CardDescription className="text-xs">{new Date(content.createdAt).toLocaleDateString('es-ES')}</CardDescription>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleEdit(content); }}>
                                        Editar Plan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(content.id)}>
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{content.content}</p>
                            <div className="flex flex-wrap gap-1">
                                {content.assignedClientIds.map(cid => {
                                    const client = clients.find(c => c.id === cid);
                                    return (
                                        <Badge key={cid} variant="secondary" className="text-[9px] px-2 py-0 h-5 bg-muted/50 border-none">
                                            <User className="h-2.5 w-2.5 mr-1" />
                                            {client?.name}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {persContent.length === 0 && (
                    <div className="col-span-full text-center py-24 border-2 border-dashed rounded-2xl bg-muted/5">
                        <Sparkles className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-muted-foreground font-medium">No has creado planes exclusivos todavía.</p>
                        <p className="text-xs text-muted-foreground mt-1">Utiliza la IA para generar tu primer plan profesional.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
