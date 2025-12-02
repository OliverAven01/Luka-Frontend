import { Card } from '@/components/ui/card';
import { Coins, TrendingUp, TrendingDown } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
  lukaPoints?: number;
}

interface HistorialProps {
  user: User;
}

const Historial = ({ user }: HistorialProps) => {
  const transacciones = [
    { id: 1, tipo: 'ingreso', descripcion: 'Campaña completada: Tech Survey', puntos: 50, fecha: 'Hoy - 02:30pm' },
    { id: 2, tipo: 'ingreso', descripcion: 'Recompensa diaria', puntos: 10, fecha: 'Hoy - 09:00am' },
    { id: 3, tipo: 'egreso', descripcion: 'Canje: Cupón Starbucks', puntos: -100, fecha: 'Ayer - 05:45pm' },
    { id: 4, tipo: 'ingreso', descripcion: 'Campaña completada: Food Review', puntos: 30, fecha: 'Ayer - 03:20pm' },
    { id: 5, tipo: 'ingreso', descripcion: 'Bonus por referido', puntos: 25, fecha: '2 días - 11:15am' },
  ];

  const totalPuntos = user.lukaPoints || 897;

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Coins className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Historial de Lukitas</h1>
        </div>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Balance Total</p>
            <div className="flex items-center justify-center gap-2">
              <Coins className="h-8 w-8 text-primary" />
              <span className="text-5xl font-bold text-foreground">{totalPuntos}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Lukitas disponibles</p>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Transacciones Recientes</h2>
          
          {transacciones.map((transaccion) => (
            <Card key={transaccion.id} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    transaccion.tipo === 'ingreso' 
                      ? 'bg-green-500/10' 
                      : 'bg-red-500/10'
                  }`}>
                    {transaccion.tipo === 'ingreso' ? (
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaccion.descripcion}</p>
                    <p className="text-sm text-muted-foreground">{transaccion.fecha}</p>
                  </div>
                </div>
                <span className={`text-xl font-bold ${
                  transaccion.tipo === 'ingreso' 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {transaccion.puntos > 0 ? '+' : ''}{transaccion.puntos}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Historial;
