
"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Calendar, Clock, Trophy, User, Euro } from "lucide-react";
import { sessions, clients } from "@/lib/data";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function BillingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const now = new Date();
  
  const dailyRevenue = sessions
    .filter(s => s.completedAt.toDateString() === now.toDateString())
    .reduce((acc, s) => acc + s.revenue, 0);

  const monthlyRevenue = sessions
    .filter(s => s.completedAt.getMonth() === now.getMonth() && s.completedAt.getFullYear() === now.getFullYear())
    .reduce((acc, s) => acc + s.revenue, 0);

  const annualRevenue = sessions
    .filter(s => s.completedAt.getFullYear() === now.getFullYear())
    .reduce((acc, s) => acc + s.revenue, 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const revenue = sessions
      .filter(s => s.completedAt.toDateString() === d.toDateString())
      .reduce((acc, s) => acc + s.revenue, 0);
    return { name: dayName, revenue };
  });

  // Calculate revenue per client
  const clientRevenue = clients.map(client => {
    const totalSpent = sessions
      .filter(s => s.clientId === client.id)
      .reduce((acc, s) => acc + s.revenue, 0);
    return { ...client, totalSpent };
  }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-primary uppercase">Facturación y Rendimiento</h1>
        <p className="text-sm text-muted-foreground">Análisis económico y clientes destacados de FISIKO.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturación Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyRevenue}€</div>
            <p className="text-xs text-muted-foreground">Sesiones completadas hoy</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRevenue}€</div>
            <p className="text-xs text-muted-foreground">Ingresos de {now.toLocaleDateString('es-ES', { month: 'long' })}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anual {now.getFullYear()}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{annualRevenue}€</div>
            <p className="text-xs text-muted-foreground">Facturación acumulada del año</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-2">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Ingresos Últimos 7 Días
            </CardTitle>
            <CardDescription>Rendimiento diario de la clínica.</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="h-[300px] w-full">
              <ChartContainer config={{ revenue: { label: "Ingresos", color: "hsl(var(--primary))" } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7Days}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}€`} width={35} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-2">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Top Clientes (Ingresos Totales)
            </CardTitle>
            <CardDescription>Los usuarios que más invierten en su bienestar.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/20">
                  <TableHead className="font-bold">Cliente</TableHead>
                  <TableHead className="text-right font-bold pr-6">Inversión Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientRevenue.map((client, index) => (
                  <TableRow key={client.id} className="group">
                    <TableCell>
                      <Link href={`/admin/clients/${client.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="relative">
                          <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                            <AvatarImage src={client.avatarUrl} alt={client.name} />
                            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 bg-accent text-white rounded-full p-0.5 shadow-sm">
                              <Trophy className="h-2 w-2" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{client.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Puesto #{index + 1}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex flex-col items-end">
                        <span className="font-black text-primary text-base">{client.totalSpent}€</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Invertidos</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
