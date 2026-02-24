"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MessageCircle } from "lucide-react";
import { ChatWindow } from "./chat-window";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    // Mock notification count
    const notificationCount = 2;

    return (
        <>
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
                <MessageCircle />
                {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {notificationCount}
                    </span>
                )}
                <span className="sr-only">Open Chat</span>
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className="flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="font-headline">Chat</SheetTitle>
                    </SheetHeader>
                    <ChatWindow />
                </SheetContent>
            </Sheet>
        </>
    )
}
