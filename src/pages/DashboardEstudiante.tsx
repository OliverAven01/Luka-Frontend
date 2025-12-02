import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, Send, Target, Ticket, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import TransferMoneyDialog from '@/components/TransferMoneyDialog';
import { useState, useEffect } from 'react';
import { getProfileByEmail } from '@/lib/supabase-db';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
  lukaPoints?: number;
}

interface DashboardEstudianteProps {
  user: User;
}

const DashboardEstudiante = ({ user }: DashboardEstudianteProps) => {
  const [points, setPoints] = useState(user.lukaPoints || 897);

  const refreshPoints = async () => {
    const profile = await getProfileByEmail(user.email);
    if (profile) {
      setPoints(profile.luka_points || 0);
    }
  };

  useEffect(() => {
    refreshPoints();
  }, []);

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Megaphone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground text-center">Campañas</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Send className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground text-center">Emitir</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground text-center">Misiones</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground text-center">Cupones</span>
            </button>
          </div>

          {/* Luka Points & Transfer */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Card className="flex-1 p-4 sm:p-6">
              <p className="text-xs text-muted-foreground uppercase mb-2">Luka Points</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">{points}</span>
                <span className="text-2xl sm:text-3xl">💰</span>
              </div>
            </Card>
            <div className="flex items-center justify-center sm:justify-start">
              <TransferMoneyDialog
                currentUserEmail={user.email}
                currentUserPoints={points}
                onTransferComplete={refreshPoints}
              />
            </div>
          </div>

          {/* Mis Cuentas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Mis Cuentas</h3>
              <Button variant="link" className="text-primary h-auto p-0 text-sm">Ver todo</Button>
            </div>
            <Card className="p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-semibold text-primary">TC</span>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-foreground">Cuenta: CTA001</p>
                  <p className="text-xs text-muted-foreground">Saldo actual</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-lg font-bold text-foreground">{points}</span>
                <span className="text-base sm:text-lg">💰</span>
              </div>
            </Card>
          </div>

          {/* Estado de la campaña */}
          <Card className="p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              </div>
              <p className="text-sm sm:text-base font-medium text-foreground">Estado de la campaña</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-bold text-foreground">3</span>
              <span className="text-base sm:text-lg">💰</span>
            </div>
          </Card>

          {/* Últimas Transacciones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Últimas Transacciones</h3>
              <Button variant="link" className="text-primary h-auto p-0 text-sm">Ver todo</Button>
            </div>
            <div className="space-y-3">
              <Card className="p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-foreground">Ingreso</p>
                    <p className="text-xs text-muted-foreground">Hoy - 01:40pm</p>
                  </div>
                </div>
                <span className="text-base sm:text-lg font-bold text-green-500">+2</span>
              </Card>
              <Card className="p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-foreground">Ingreso</p>
                    <p className="text-xs text-muted-foreground">Hoy - 12:04pm</p>
                  </div>
                </div>
                <span className="text-base sm:text-lg font-bold text-green-500">+102</span>
          </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
  );
};

export default DashboardEstudiante;
