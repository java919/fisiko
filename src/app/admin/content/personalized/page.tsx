"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { personalizedContent as initialPersonalized, clients } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Apple, Dumbbell, FileText, Sparkles, Loader2, Pencil, Trash2 } from "lucide-react";
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
                toast({ title: "Plan generado por IA", description: "Propuesta técnica creada según tu criterio profesional." });
            }
        } catch (error: any) {
            console.error("Error generating content:", error);
            toast({ 
                variant: "destructive", 
                title: "Error de Asistente IA", 
                description: error.message || "No se pudo generar el contenido." 
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
                    <p className="text-sm text-muted-foreground">Gestión de dietas y rutinas exclusivas por cliente.</p>
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
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] rounded-xl p-4 sm:p-6">
                        <form onSubmit={handleSave}>
                            <DialogHeader>
                                <DialogTitle>{editingContent ? 'Editar Plan Personalizado' : 'Crear Contenido Personalizado'}</DialogTitle>
                                <DialogDescription>Utiliza la IA de FISIKO para generar contenido técnico especializado.</DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-6 py-4">
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                        <Sparkles className="h-4 w-4" /> Asistente IA Profesional
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Input 
                                            placeholder="Ej: Dieta para hernia discal o rutina de movilidad..." 
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

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Título</Label>
                                        <Input id="title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipo</Label>
                                        <select value={formType} onChange={(e) => setFormType(e.target.value as any)} className="w-full h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary">
                                            <option value="exercise">Ejercicio / Rutina</option>
                                            <option value="diet">Dieta / Nutrición</option>
                                            <option value="other">Otros consejos</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Contenido Detallado</Label>
                                    <Textarea id="content" value={formContent} onChange={(e) => setFormContent(e.target.value)} className="min-h-[200px]" required />
                                </div>

                                <div className="space-y-3">
                                    <Label>Asignar a Clientes:</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-3 border rounded-md bg-muted/5">
                                        {clients.map(client => (
                                            <div key={client.id} className="flex items-center space-x-2 p-1">
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
                    <Card key={content.id} className="border-2 hover:border-primary/20 transition-all shadow-sm group bg-card overflow-hidden">
                        <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    {content.type === 'diet' ? <Apple className="h-5 w-5" /> : content.type === 'exercise' ? <Dumbbell className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="text-base truncate font-headline">{content.title}</CardTitle>
                                    <CardDescription className="text-[10px]">{new Date(content.createdAt).toLocaleDateString()}</CardDescription>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => handleEdit(content)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(content.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 space-y-3">
                            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{content.content}</p>
                            <div className="flex flex-wrap gap-1">
                                {content.assignedClientIds.map(cid => {
                                    const client = clients.find(c => c.id === cid);
                                    return (
                                        <Badge key={cid} variant="secondary" className="text-[9px] px-2 py-0 h-5">
                                            {client?.name}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
