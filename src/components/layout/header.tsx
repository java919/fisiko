"use client"
import { useState, useEffect } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChatWidget } from '../chat/chat-widget'

export function Header() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex-1"></div>
      </header>
    );
  }

  const isAdmin = pathname.startsWith('/admin');
  const user = {
    name: isAdmin ? "Admin" : "Juan Pérez",
    email: isAdmin ? "admin@wellnessflow.app" : "juan.perez@example.com",
    avatar: isAdmin ? "https://picsum.photos/seed/admin/100/100" : "https://picsum.photos/seed/juan/100/100"
  }
  const initials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <ChatWidget />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Ajustes</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">Cerrar sesión</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
