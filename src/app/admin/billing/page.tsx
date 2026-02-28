"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Euro, TrendingUp, Calendar, Clock } from "lucide-react";
import { sessions } from "@/lib/data";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function BillingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const now = new Date();
  
  // Cálculo de facturación
  const dailyRevenue = sessions
    .filter(s => s.completedAt.toDateString() === now.toDateString())
    .reduce((acc, s) => acc + s.revenue, 0);

  const monthlyRevenue = sessions
    .filter(s => s.completedAt.getMonth() === now.getMonth() && s.completedAt.getFullYear() === now.getFullYear())
    .reduce((acc, s) => acc + s.revenue, 0);

  const annualRevenue = sessions
    .filter(s => s.completedAt.getFullYear() === now.getFullYear())
    .reduce((acc, s) => acc + s.revenue, 0);

  // Datos para el gráfico (últimos 7 días)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const revenue = sessions
      .filter(s => s.completedAt.toDateString() === d.toDateString())
      .reduce((acc, s) => acc + s.revenue, 0);
    return { name: dayName, revenue };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Facturación</h1>
        <p className="text-muted-foreground">Control de ingresos y rendimiento económico de FISIKO.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturación Hoy</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyRevenue}€</div>
            <p className="text-xs text-muted-foreground">Sesiones completadas hoy</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRevenue}€</div>
            <p className="text-xs text-muted-foreground">Ingresos totales de {now.toLocaleDateString('es-ES', { month: 'long' })}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
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

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Rendimiento Últimos 7 Días</CardTitle>
          <CardDescription>Visualización de ingresos por sesiones completadas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={{ revenue: { label: "Ingresos", color: "hsl(var(--primary))" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}€`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
