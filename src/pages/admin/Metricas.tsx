import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Building2, Coins } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
}

interface MetricasProps {
  user: User;
}

const Metricas = ({ user }: MetricasProps) => {
  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Métricas Avanzadas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Usuarios Totales</p>
            <p className="text-3xl font-bold text-foreground">2,543</p>
            <p className="text-xs text-green-500 mt-2">+12% vs mes anterior</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Empresas Activas</p>
            <p className="text-3xl font-bold text-foreground">47</p>
            <p className="text-xs text-green-500 mt-2">+5 nuevas este mes</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Lukitas Distribuidos</p>
            <p className="text-3xl font-bold text-foreground">127.5K</p>
            <p className="text-xs text-green-500 mt-2">+23% vs mes anterior</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Campañas Activas</p>
            <p className="text-3xl font-bold text-foreground">89</p>
            <p className="text-xs text-green-500 mt-2">15 finalizan esta semana</p>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Actividad Reciente</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{i}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Actividad de ejemplo {i}</p>
                    <p className="text-sm text-muted-foreground">Hace {i} horas</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Ver detalles →</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Metricas;
