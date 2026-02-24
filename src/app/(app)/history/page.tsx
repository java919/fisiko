import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sessions, services } from "@/lib/data";

export default function HistoryPage() {
  // Mocking user as Juan Perez (ID 1)
  const userSessions = sessions.filter(s => s.clientId === '1').sort((a,b) => b.completedAt.getTime() - a.completedAt.getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Historial de Sesiones</h1>
        <p className="text-muted-foreground">Un registro de todas tus sesiones completadas.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Fecha de Finalización</TableHead>
                <TableHead>Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userSessions.length > 0 ? userSessions.map(session => {
                const service = services.find(s => s.id === session.serviceId);
                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{service?.name}</TableCell>
                    <TableCell>{session.completedAt.toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>{session.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  </TableRow>
                )
              }) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">Todavía no has completado ninguna sesión.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
