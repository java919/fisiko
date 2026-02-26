import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-2 shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="font-headline text-3xl uppercase tracking-wider text-primary">FISIKO</CardTitle>
          <CardDescription>Accede a tu panel de bienestar integral.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button asChild className="w-full text-lg h-12">
            <Link href="/dashboard">Acceso Clientes</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/admin">Acceso Administración</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
