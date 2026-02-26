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
  Users,
  Calendar,
  FileText,
  Mail,
  LogOut,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "Panel de Control", icon: LayoutDashboard },
    { href: "/admin/clients", label: "Gestión de Clientes", icon: Users },
    { href: "/admin/calendar", label: "Calendario", icon: Calendar },
    { href: "/admin/content", label: "Contenido Exclusivo", icon: FileText },
    { href: "/admin/settings/emails", label: "Configuración de Emails", icon: Mail },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center gap-2">
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
                isActive={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))}
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
            <SidebarMenuButton asChild tooltip="Cerrar Sesión" className="text-destructive hover:text-destructive">
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
