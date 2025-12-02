import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Search, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
}

interface UsuariosProps {
  user: User;
}

const Usuarios = ({ user }: UsuariosProps) => {
  const usuarios = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', points: 1200, campaigns: 5 },
    { id: 2, name: 'María García', email: 'maria@email.com', points: 850, campaigns: 3 },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com', points: 2100, campaigns: 8 },
    { id: 4, name: 'Ana Martínez', email: 'ana@email.com', points: 650, campaigns: 2 },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="w-full pl-10 pr-4 h-10 rounded-md bg-input border border-border text-foreground"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {usuarios.map((usuario) => (
            <Card key={usuario.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{usuario.name}</h3>
                    <p className="text-sm text-muted-foreground">{usuario.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Lukitas</p>
                    <p className="text-lg font-bold text-foreground">{usuario.points}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Campañas</p>
                    <p className="text-lg font-bold text-foreground">{usuario.campaigns}</p>
                  </div>
                  <Button variant="outline" size="sm">Ver perfil</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Usuarios;
