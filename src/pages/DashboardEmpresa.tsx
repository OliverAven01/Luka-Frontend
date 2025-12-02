import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, DollarSign, BarChart3, Settings, Loader2, Ticket } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { campaignsApi, Campaign, User } from '@/lib/api';
import { toast } from 'sonner';

interface DashboardEmpresaProps {
  user: User;
}

const DashboardEmpresa = ({ user }: DashboardEmpresaProps) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      const response = await campaignsApi.getByCompany(user.id);
      if (response.success) {
        setCampaigns(response.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeCampaigns = campaigns.filter(c => new Date(c.endDate) > new Date());
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalParticipants = campaigns.reduce((sum, c) => sum + (c.participants || 0), 0);

  return (
    <DashboardLayout user={user}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Participantes</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalParticipants}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Campañas Activas</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : activeCampaigns.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Presupuesto Total</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalBudget.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Gestión de Campañas</h3>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/empresa/campanas')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver Campañas Activas
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/empresa/crear')}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Crear Nueva Campaña
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/empresa/cupones')}
              >
                <Ticket className="mr-2 h-4 w-4" />
                Gestionar Cupones
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Reportes y Análisis</h3>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/empresa/rendimiento')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Estadísticas Generales
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/empresa/transacciones')}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Historial de Transacciones
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/empresa/perfil')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardEmpresa;
