import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
}

interface EmpresasProps {
  user: User;
}

const Empresas = ({ user }: EmpresasProps) => {
  const empresas = [
    { id: 1, name: 'Tech Corp', users: 150, campaigns: 12, status: 'Activa' },
    { id: 2, name: 'Innovate SA', users: 89, campaigns: 8, status: 'Activa' },
    { id: 3, name: 'Digital Plus', users: 234, campaigns: 15, status: 'Activa' },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Empresas</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Empresa
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar empresas..."
              className="w-full pl-10 pr-4 h-10 rounded-md bg-input border border-border text-foreground"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {empresas.map((empresa) => (
            <Card key={empresa.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{empresa.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {empresa.users} usuarios · {empresa.campaigns} campañas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                    {empresa.status}
                  </span>
                  <Button variant="outline" size="sm">Ver detalles</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Empresas;
