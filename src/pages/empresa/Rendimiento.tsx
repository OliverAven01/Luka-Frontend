import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

import { User } from '@/lib/api';

interface RendimientoProps {
  user: User;
}

const Rendimiento = ({ user }: RendimientoProps) => {
  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Rendimiento de Campañas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Participantes Totales</p>
            <p className="text-3xl font-bold text-foreground">1,234</p>
            <p className="text-xs text-green-500 mt-2">+18% este mes</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Tasa de Conversión</p>
            <p className="text-3xl font-bold text-foreground">67%</p>
            <p className="text-xs text-green-500 mt-2">+5% vs mes anterior</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Engagement</p>
            <p className="text-3xl font-bold text-foreground">89%</p>
            <p className="text-xs text-green-500 mt-2">Excelente</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">ROI</p>
            <p className="text-3xl font-bold text-foreground">234%</p>
            <p className="text-xs text-green-500 mt-2">+12% este mes</p>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Campañas Mejor Desempeño</h3>
          <div className="space-y-4">
            {[
              { name: 'Campaña de Verano', participants: 456, conversion: 78 },
              { name: 'Promoción Aniversario', participants: 389, conversion: 72 },
              { name: 'Black Friday', participants: 234, conversion: 65 },
            ].map((campaign, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">{campaign.participants} participantes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{campaign.conversion}%</p>
                  <p className="text-xs text-muted-foreground">Conversión</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Rendimiento;
