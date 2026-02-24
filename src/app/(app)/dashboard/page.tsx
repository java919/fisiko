import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { clients, clientServices, services, calendarSlots } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Bell, CalendarPlus, Video } from "lucide-react";

export default function ClientDashboard() {
  // Mocking the logged in user as Juan Pérez
  const currentUser = clients.find(c => c.id === '1');
  const userServices = clientServices.filter(cs => cs.clientId === currentUser?.id);
  const upcomingAppointment = calendarSlots.find(slot => slot.bookedBy === currentUser?.id && slot.startTime > new Date());
  
  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Welcome, {currentUser.name.split(' ')[0]}!</h1>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Your Services</CardTitle>
              <CardDescription>Here's a summary of your active service packages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {userServices.map(sub => {
                const service = services.find(s => s.id === sub.serviceId);
                if (!service) return null;
                const progress = (sub.remainingSessions / sub.totalSessions) * 100;
                return (
                  <div key={sub.serviceId}>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <span className="text-sm font-medium">{sub.remainingSessions} / {sub.totalSessions} sessions left</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )
              })}
              {userServices.length === 0 && <p className="text-muted-foreground">You don't have any active services.</p>}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="font-headline">Book Your Next Session</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Ready to continue your wellness journey? Book your next appointment now.</p>
              <Button variant="secondary" asChild className="w-full">
                <Link href="/booking">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Find a Slot
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {upcomingAppointment && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Bell className="w-6 h-6 text-primary"/>
                <div>
                    <CardTitle className="font-headline">Upcoming Appointment</CardTitle>
                    <CardDescription>
                        {services.find(s => s.id === upcomingAppointment.serviceId)?.name}
                    </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{upcomingAppointment.startTime.toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</p>
              </CardContent>
            </Card>
          )}

          <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <Video className="w-6 h-6 text-primary" />
                  <div>
                      <CardTitle className="font-headline">New Exercises</CardTitle>
                      <CardDescription>Check out new content for your services.</CardDescription>
                  </div>
              </CardHeader>
              <CardContent>
                 <Button variant="outline" asChild className="w-full">
                    <Link href="/exercises">View Content</Link>
                </Button>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
