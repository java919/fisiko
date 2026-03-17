
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/logo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldCheck, UserCircle2, Building2, ArrowRight, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [isClientRegister, setIsClientRegister] = useState(false)
  const [isAdminRegister, setIsAdminRegister] = useState(false)

  // Client form state
  const [clientCode, setClinicCode] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientBirthday, setClientBirthday] = useState('')

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientCode) {
      toast({ variant: "destructive", title: "Código requerido", description: "Introduce el código de tu clínica para continuar." })
      return
    }
    router.push('/dashboard')
    toast({ title: "Bienvenido", description: "Has accedido correctamente a tu panel de salud." })
  }

  const handleClientRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientCode || !clientEmail || !clientName) {
      toast({ variant: "destructive", title: "Datos incompletos", description: "Por favor, rellena todos los campos obligatorios." })
      return
    }
    // En una app real, aquí se crearía el usuario en Firebase vinculado a la clínica
    toast({ 
      title: "Cuenta creada", 
      description: `¡Bienvenido ${clientName}! Tu cuenta ha sido vinculada a la clínica ${clientCode}.` 
    })
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <Card className="w-full max-w-md border-2 shadow-2xl overflow-hidden">
        <CardHeader className="text-center bg-muted/30 pb-8">
          <div className="mb-4 flex justify-center scale-110">
            <Logo />
          </div>
          <CardTitle className="font-headline text-4xl font-black tracking-tighter text-primary">FISIKO</CardTitle>
          <CardDescription className="text-sm font-medium">Plataforma SaaS de Fisioterapia y Bienestar</CardDescription>
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
              {!isClientRegister ? (
                <form onSubmit={handleClientLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinic-code" className="font-bold">Código de tu Clínica</Label>
                    <Input 
                      id="clinic-code" 
                      placeholder="Ej: FISIKO-2025" 
                      value={clientCode}
                      onChange={(e) => setClinicCode(e.target.value.toUpperCase())}
                      className="h-12 text-center text-lg font-black tracking-widest uppercase border-2 focus:border-primary" 
                    />
                    <p className="text-[10px] text-muted-foreground text-center">Introduce el código que te dio tu profesional.</p>
                  </div>
                  <Button type="submit" className="w-full text-lg h-12 font-black shadow-lg">
                    Entrar a mi Panel
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full text-xs" 
                    onClick={() => setIsClientRegister(true)}
                  >
                    ¿Eres nuevo? Regístrate aquí
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleClientRegister} className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-1">
                    <Label className="font-bold text-xs">Nombre Completo</Label>
                    <Input 
                      placeholder="Ej: Juan Pérez" 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-bold text-xs">Correo Electrónico</Label>
                    <Input 
                      type="email" 
                      placeholder="tu@email.com" 
                      value={clientEmail} 
                      onChange={(e) => setClientEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="font-bold text-xs">Cumpleaños</Label>
                      <Input 
                        type="date" 
                        value={clientBirthday} 
                        onChange={(e) => setClientBirthday(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="font-bold text-xs">Código Clínica</Label>
                      <Input 
                        placeholder="FISIKO-XXX" 
                        value={clientCode} 
                        onChange={(e) => setClinicCode(e.target.value.toUpperCase())}
                        required 
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 font-bold mt-2">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Crear mi Cuenta
                  </Button>
                  <Button variant="ghost" className="w-full text-xs" onClick={() => setIsClientRegister(false)}>
                    Volver al login
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              {!isAdminRegister ? (
                <div className="space-y-3">
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase mb-1">
                      <Building2 className="h-4 w-4" /> Gestión Profesional
                    </div>
                    <p className="text-[10px] text-muted-foreground">Panel para fisioterapeutas y administradores de centros.</p>
                  </div>
                  <Button asChild variant="default" className="w-full h-12 font-bold shadow-md">
                    <Link href="/admin">Entrar como Administrador</Link>
                  </Button>
                  <Button variant="outline" className="w-full h-12 font-bold border-2" onClick={() => setIsAdminRegister(true)}>
                    Registrar mi Clínica
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                   <div className="space-y-2">
                      <Label className="font-bold">Nombre de la Clínica</Label>
                      <Input placeholder="Ej: Fisioterapia Avanzada" />
                   </div>
                   <div className="space-y-2">
                      <Label className="font-bold">Email Profesional</Label>
                      <Input type="email" placeholder="profesional@ejemplo.com" />
                   </div>
                   <Button className="w-full h-12 font-bold" onClick={() => {
                     toast({ title: "Clínica creada", description: "Tu código de acceso es FISIKO-NEW. Ya puedes empezar." })
                     setIsAdminRegister(false)
                   }}>
                     Crear Cuenta y Obtener Código
                   </Button>
                   <Button variant="ghost" className="w-full text-xs" onClick={() => setIsAdminRegister(false)}>Volver al login</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
