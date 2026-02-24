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
    { href: "/admin", label: "Panel", icon: LayoutDashboard },
    { href: "/admin/clients", label: "Clientes", icon: Users },
    { href: "/admin/calendar", label: "Calendario", icon: Calendar },
    { href: "/admin/content", label: "Contenido", icon: FileText },
    { href: "/admin/settings/emails", label: "Emails", icon: Mail },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-2">
          <Logo />
          <span className="font-headline text-lg font-semibold text-sidebar-foreground">
            WellnessFlow
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && (item.href.length > 6 ? true : pathname === item.href)}
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
