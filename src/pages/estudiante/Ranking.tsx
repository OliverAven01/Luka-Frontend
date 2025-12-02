import { Card } from '@/components/ui/card';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

import { User } from '@/lib/api';

interface RankingProps {
  user: User;
}

const Ranking = ({ user }: RankingProps) => {
  const topUsuarios = [
    { posicion: 1, nombre: 'María García', puntos: 5420, avatar: 'M' },
    { posicion: 2, nombre: 'Carlos López', puntos: 4890, avatar: 'C' },
    { posicion: 3, nombre: 'Ana Martínez', puntos: 4235, avatar: 'A' },
    { posicion: 4, nombre: 'Juan Pérez', puntos: 3890, avatar: 'J' },
    { posicion: 5, nombre: 'Laura Torres', puntos: 3456, avatar: 'L' },
  ];

  const getMedalIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (position === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (position === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Ranking de Estudiantes</h1>
        </div>

        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tu Posición</p>
              <p className="text-4xl font-bold text-foreground">#12</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Tus Lukitas</p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-foreground">{user.lukaPoints || 897}</span>
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Top Estudiantes</h2>
          
          {topUsuarios.map((usuario) => (
            <Card key={usuario.posicion} className={`p-5 transition-all hover:shadow-lg ${
              usuario.posicion <= 3 ? 'border-primary/30' : ''
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center">
                    {getMedalIcon(usuario.posicion)}
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{usuario.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{usuario.nombre}</p>
                    <p className="text-sm text-muted-foreground">Posición #{usuario.posicion}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{usuario.puntos}</p>
                  <p className="text-sm text-muted-foreground">Lukitas</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-muted/30">
          <p className="text-center text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Completa más campañas para subir en el ranking
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Ranking;
