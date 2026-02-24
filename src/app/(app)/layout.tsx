import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/layout/client-sidebar';
import { Header } from '@/components/layout/header';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <ClientSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
