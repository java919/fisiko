import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, MessageSquare } from "lucide-react";
import { clients, services, sessions, calendarSlots } from "@/lib/data";

export default function AdminDashboard() {
  const totalClients = clients.length;
  const activeServices = services.length;
  const sessionsThisMonth = sessions.filter(s => s.completedAt.getMonth() === new Date().getMonth()).length;

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices}</div>
            <p className="text-xs text-muted-foreground">All services are active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions this Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsThisMonth}</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">From Juan and Ana</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sessions.slice(0, 3).map(session => {
                        const client = clients.find(c => c.id === session.clientId);
                        const service = services.find(s => s.id === session.serviceId);
                        return (
                            <div key={session.id} className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{client?.name} completed a {service?.name} session.</p>
                                    <p className="text-sm text-muted-foreground">{session.completedAt.toLocaleDateString()}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {calendarSlots.filter(s => s.isBooked && s.startTime > new Date()).slice(0, 3).map(slot => {
                        const client = clients.find(c => c.id === slot.bookedBy);
                        const service = services.find(s => s.id === slot.serviceId);
                        return (
                            <div key={slot.id} className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{client?.name} - {service?.name}</p>
                                    <p className="text-sm text-muted-foreground">{slot.startTime.toLocaleString([], {dateStyle: 'full', timeStyle: 'short'})}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
