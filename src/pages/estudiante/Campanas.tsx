import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Megaphone, Coins } from 'lucide-react';
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
    { id: 1, empresa: 'Tech Corp', titulo: 'Prueba nuestra nueva app', puntos: 50, participantes: 234 },
    { id: 2, empresa: 'Food Plus', titulo: 'Comparte tu experiencia', puntos: 30, participantes: 567 },
    { id: 3, empresa: 'Eco Brand', titulo: 'Encuesta de sostenibilidad', puntos: 40, participantes: 189 },
    { id: 4, empresa: 'Fashion Store', titulo: 'Reseña nuestros productos', puntos: 60, participantes: 423 },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Search className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Campañas Disponibles</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar campañas..."
            className="w-full pl-10 pr-4 h-12 rounded-lg bg-input border border-border text-foreground"
          />
        </div>

        <div className="grid gap-4">
          {campanas.map((campana) => (
            <Card key={campana.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-14 w-14 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Megaphone className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-muted-foreground">{campana.empresa}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{campana.titulo}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-primary" />
                        {campana.puntos} Lukitas
                      </span>
                      <span>{campana.participantes} participantes</span>
                    </div>
                  </div>
                </div>
                <Button>Participar</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Campanas;
