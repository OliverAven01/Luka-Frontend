import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Settings, Database, Activity } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
}

interface DashboardAdminProps {
  user: User;
}

const DashboardAdmin = ({ user }: DashboardAdminProps) => {
  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Usuarios</p>
                <p className="text-3xl font-bold text-foreground">3,456</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Empresas</p>
                <p className="text-3xl font-bold text-foreground">89</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sistema</p>
                <p className="text-xl font-bold text-green-500">Activo</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">BD</p>
                <p className="text-xl font-bold text-foreground">OK</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Usuarios
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                Ver Todos los Usuarios
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Usuarios Nuevos
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Moderar Cuentas
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Gestión de Empresas
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                Ver Todas las Empresas
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Aprobar Solicitudes
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Gestionar Permisos
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Sistema
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                Configuración General
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Logs del Sistema
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Backup y Seguridad
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardAdmin;
