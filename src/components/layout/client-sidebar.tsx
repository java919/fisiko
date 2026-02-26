"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  CalendarPlus,
  Dumbbell,
  History,
  LogOut,
} from "lucide-react";

export function ClientSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
    { href: "/dashboard/booking", label: "Nueva Reserva", icon: CalendarPlus },
    { href: "/dashboard/exercises", label: "Mis Ejercicios", icon: Dumbbell },
    { href: "/dashboard/history", label: "Historial", icon: History },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-headline text-xl font-bold text-sidebar-foreground">
            FISIKO
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Cerrar Sesión">
              <Link href="/login">
                <LogOut />
                <span>Cerrar Sesión</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
