import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, Users, Calendar, TrendingUp, Loader2, Pencil } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { campaignsApi, Campaign, User } from '@/lib/api';
import { toast } from 'sonner';

interface CampanasProps {
  user: User;
}

const Campanas = ({ user }: CampanasProps) => {
  const [campanas, setCampanas] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCampanas();
  }, [user.id]);

  const loadCampanas = async () => {
    try {
      const response = await campaignsApi.getByCompany(user.id);
      if (response.success) {
        setCampanas(response.data);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Error al cargar las campañas');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES');
  };

  const getStatusColor = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    if (end < now) return 'bg-gray-500/10 text-gray-500';
    if (end.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return 'bg-yellow-500/10 text-yellow-500';
    }
    return 'bg-green-500/10 text-green-500';
  };

  const getStatusText = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    if (end < now) return 'Finalizada';
    if (end.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return 'Por finalizar';
    }
    return 'Activa';
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Mis Campañas</h1>
          <Button onClick={() => navigate('/dashboard/empresa/crear')}>
            Nueva Campaña
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : campanas.length === 0 ? (
          <Card className="p-8 text-center">
            <ListChecks className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No tienes campañas creadas</p>
            <Button onClick={() => navigate('/dashboard/empresa/crear')}>
              Crear primera campaña
            </Button>
          </Card>
        ) : (
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
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campana.endDate)}`}>
                        {getStatusText(campana.endDate)}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => toast.info(`Editando campaña: ${campana.name}`)}>Editar</Button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{campana.description}</p>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Participantes</p>
                      <p className="text-lg font-bold text-foreground">{campana.participants || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Presupuesto</p>
                      <p className="text-lg font-bold text-foreground">{campana.budget}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Finaliza</p>
                      <p className="text-sm font-medium text-foreground">{formatDate(campana.endDate)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Campanas;
