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
  Euro,
  Tag,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "Panel de Control", icon: LayoutDashboard },
    { href: "/admin/clients", label: "Gestión de Clientes", icon: Users },
    { href: "/admin/calendar", label: "Calendario", icon: Calendar },
    { href: "/admin/services", label: "Servicios y Bonos", icon: Tag },
    { href: "/admin/billing", label: "Facturación", icon: Euro },
    { href: "/admin/content", label: "Contenido Exclusivo", icon: FileText },
    { href: "/admin/settings/emails", label: "Plantillas de Email", icon: Mail },
  ];

  return (
    <Sidebar className="border-r-0 shadow-xl">
      <SidebarHeader className="p-6">
        <Link href="/admin" className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-black tracking-tighter text-sidebar-foreground">
              FISIKO
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Administración</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarMenu className="gap-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="h-12 text-base rounded-lg transition-all"
              >
                <Link href={item.href}>
                  <item.icon className="!w-5 !h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Cerrar Sesión" className="h-12 text-sidebar-foreground/70 hover:text-destructive transition-colors">
              <Link href="/login">
                <LogOut className="!w-5 !h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
