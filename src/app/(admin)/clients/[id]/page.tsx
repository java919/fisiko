import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { clients, clientServices, services as allServices, sessions } from "@/lib/data";
import { ArrowLeft, CheckCircle, PlusCircle } from "lucide-react";
import Link from "next/link";

type Props = {
  params: { id: string };
};

export default function ClientDetailPage({ params }: Props) {
  const client = clients.find(c => c.id === params.id);
  const subscriptions = clientServices.filter(cs => cs.clientId === params.id);
  const clientSessions = sessions.filter(s => s.clientId === params.id).sort((a,b) => b.completedAt.getTime() - a.completedAt.getTime());

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/clients" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Link>
      
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
            <AvatarImage src={client.avatarUrl} alt={client.name}/>
            <AvatarFallback className="text-2xl">{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
            <h1 className="font-headline text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">{client.email}</p>
            </div>
        </div>
        <div className="md:ml-auto">
            <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Service
            </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Active Services</CardTitle>
          <CardDescription>Manage sessions for {client.name}'s services.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {subscriptions.map(sub => {
                const service = allServices.find(s => s.id === sub.serviceId);
                if (!service) return null;
                return (
                    <div key={service.id} className="p-4 border rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{sub.remainingSessions}</p>
                                <p className="text-xs text-muted-foreground">sessions left</p>
                            </div>
                            <Separator orientation="vertical" className="h-10" />
                            <div className="text-center">
                                <p className="text-2xl font-bold">{sub.totalSessions}</p>
                                <p className="text-xs text-muted-foreground">total sessions</p>
                            </div>
                            <Button disabled={sub.remainingSessions === 0}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Completed
                            </Button>
                        </div>
                    </div>
                )
            })}
             {subscriptions.length === 0 && <p className="text-muted-foreground text-center py-8">No active services.</p>}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Date Completed</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clientSessions.length > 0 ? clientSessions.map(session => {
                    const service = allServices.find(s => s.id === session.serviceId);
                    return (
                        <TableRow key={session.id}>
                            <TableCell>{service?.name}</TableCell>
                            <TableCell>{session.completedAt.toLocaleDateString()}</TableCell>
                        </TableRow>
                    )
                }) : (
                    <TableRow>
                        <TableCell colSpan={2} className="text-center h-24">No sessions completed yet.</TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
