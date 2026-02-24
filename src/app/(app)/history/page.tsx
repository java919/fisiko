import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sessions, services } from "@/lib/data";

export default function HistoryPage() {
  // Mocking user as Juan Perez (ID 1)
  const userSessions = sessions.filter(s => s.clientId === '1').sort((a,b) => b.completedAt.getTime() - a.completedAt.getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Session History</h1>
        <p className="text-muted-foreground">A record of all your completed sessions.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Date Completed</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userSessions.length > 0 ? userSessions.map(session => {
                const service = services.find(s => s.id === session.serviceId);
                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{service?.name}</TableCell>
                    <TableCell>{session.completedAt.toLocaleDateString()}</TableCell>
                    <TableCell>{session.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  </TableRow>
                )
              }) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">You haven't completed any sessions yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
