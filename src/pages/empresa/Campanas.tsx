import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, Users, Calendar, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
}

interface CampanasProps {
  user: User;
}

const Campanas = ({ user }: CampanasProps) => {
  const campanas = [
    { id: 1, name: 'Campaña de Verano', participants: 234, points: 5000, status: 'Activa', endDate: '2025-12-31' },
    { id: 2, name: 'Promoción Aniversario', participants: 156, points: 3000, status: 'Activa', endDate: '2025-11-15' },
    { id: 3, name: 'Black Friday 2025', participants: 89, points: 8000, status: 'Próximamente', endDate: '2025-11-29' },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Mis Campañas</h1>
          <Button>Nueva Campaña</Button>
        </div>

        <div className="grid gap-6">
          {campanas.map((campana) => (
            <Card key={campana.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ListChecks className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">{campana.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      campana.status === 'Activa' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {campana.status}
                    </span>
                  </div>
                </div>
                <Button variant="outline">Editar</Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participantes</p>
                    <p className="text-lg font-bold text-foreground">{campana.participants}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Puntos Totales</p>
                    <p className="text-lg font-bold text-foreground">{campana.points}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Finaliza</p>
                    <p className="text-sm font-medium text-foreground">{campana.endDate}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Campanas;
