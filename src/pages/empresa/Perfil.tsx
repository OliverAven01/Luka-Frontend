import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
}

interface PerfilProps {
  user: User;
}

const Perfil = ({ user }: PerfilProps) => {
  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Perfil de Empresa</h1>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground">Cuenta Empresarial</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nombre de la Empresa</Label>
              <Input id="company-name" defaultValue={user.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" type="tel" placeholder="+52 123 456 7890" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industria</Label>
              <select
                id="industry"
                className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
              >
                <option value="">Selecciona una industria</option>
                <option value="tech">Tecnología</option>
                <option value="retail">Retail</option>
                <option value="food">Alimentos y Bebidas</option>
                <option value="education">Educación</option>
              </select>
            </div>

            <Button className="w-full">Guardar Cambios</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Perfil;
