import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/logo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldCheck, UserCircle2, Building2 } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <Card className="w-full max-w-md border-2 shadow-2xl overflow-hidden">
        <CardHeader className="text-center bg-muted/30 pb-8">
          <div className="mb-4 flex justify-center scale-110">
            <Logo />
          </div>
          <CardTitle className="font-headline text-4xl font-black tracking-tighter text-primary">FISIKO</CardTitle>
          <CardDescription className="text-sm font-medium">Plataforma Integral de Fisioterapia y Bienestar</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="client" className="rounded-lg font-bold flex items-center gap-2">
                <UserCircle2 className="h-4 w-4" /> Cliente
              </TabsTrigger>
              <TabsTrigger value="admin" className="rounded-lg font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Clínica
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-code" className="font-bold">Código de tu Clínica</Label>
                <Input id="clinic-code" placeholder="Ej: FISIKO-2025" className="h-12 text-center text-lg font-black tracking-widest uppercase border-2 focus:border-primary" />
                <p className="text-[10px] text-muted-foreground text-center">Pide el código en la recepción de tu centro para vincular tu cuenta.</p>
              </div>
              <Button asChild className="w-full text-lg h-12 font-black shadow-lg">
                <Link href="/dashboard">Entrar a mi Panel</Link>
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase mb-1">
                  <Building2 className="h-4 w-4" /> Profesional Sanitario
                </div>
                <p className="text-[10px] text-muted-foreground">Acceso restringido para gestores de clínicas y fisioterapeutas colegiados.</p>
              </div>
              <Button asChild variant="secondary" className="w-full h-12 font-bold border-2 hover:bg-muted transition-all">
                <Link href="/admin">Gestionar mi Clínica</Link>
              </Button>
              <div className="text-center">
                <Button variant="link" className="text-xs text-muted-foreground">¿Quieres dar de alta tu clínica? Contacta con nosotros.</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
