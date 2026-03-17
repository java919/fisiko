"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { clients as allClients } from "@/lib/data";
import { useState, useEffect } from "react";

const mockMessages = [
  { id: 'm1', senderId: '1', content: 'Hola! Quería saber si hay hueco para pilates mañana.', timestamp: new Date(), isRead: false },
  { id: 'm2', senderId: 'admin', content: 'Hola Juan! Sí, a las 10:00. Te vale?', timestamp: new Date(), isRead: true },
  { id: 'm3', senderId: '2', content: 'Gracias por la sesión de hoy!', timestamp: new Date(), isRead: false },
];

export function ChatWindow() {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');
    
    // Safety check for empty clients
    const defaultContact = isAdmin && allClients.length > 0 
        ? allClients[0] 
        : { id: 'admin', name: 'Soporte FISIKO', avatarUrl: 'https://picsum.photos/seed/admin/150/150' };

    const [selectedContact, setSelectedContact] = useState(defaultContact);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentUserId = isAdmin ? 'admin' : '1'; 

    const relevantMessages = (contactId: string) => {
        if (isAdmin) {
            if (contactId === '1') return mockMessages.filter(m => m.senderId === '1' || (m.senderId === 'admin' && m.id === 'm2'));
            if (contactId === '2') return mockMessages.filter(m => m.senderId === '2');
            return [];
        }
        return mockMessages.filter(m => m.senderId === '1' || (m.senderId === 'admin' && m.id === 'm2'));
    }

    const displayedMessages = relevantMessages(selectedContact.id);

    return (
        <div className="flex h-full flex-col">
            {isAdmin && allClients.length > 0 && (
                <div className="border-b pb-2 mb-2">
                    <h3 className="font-semibold mb-2 px-1">Contactos</h3>
                    <ScrollArea className="h-[150px]">
                        <div className="flex flex-col gap-1 pr-4">
                        {allClients.map(client => (
                            <button 
                                key={client.id}
                                onClick={() => setSelectedContact(client)}
                                className={cn(
                                    "flex items-center gap-2 p-2 rounded-md w-full text-left",
                                    selectedContact.id === client.id ? "bg-accent" : "hover:bg-muted"
                                )}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={client.avatarUrl} />
                                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{client.name}</span>
                            </button>
                        ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
            <h3 className="font-semibold mb-2 font-headline text-lg">{selectedContact.name}</h3>
            <ScrollArea className="flex-1 -mx-6">
                <div className="px-6 py-2 space-y-4">
                    {displayedMessages.map((msg, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-end gap-2",
                                msg.senderId === currentUserId ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.senderId !== currentUserId && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={selectedContact.avatarUrl} />
                                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={cn(
                                    "max-w-xs rounded-lg p-3 text-sm shadow-md",
                                    msg.senderId === currentUserId
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="mt-auto flex gap-2 pt-4 border-t">
                <Input placeholder="Escribe un mensaje..." className="flex-1" />
                <Button>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Enviar</span>
                </Button>
            </div>
        </div>
    );
}
