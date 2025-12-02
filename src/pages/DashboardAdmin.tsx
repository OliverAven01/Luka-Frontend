import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Settings, Database, Activity, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { adminApi, AdminStatistics, User } from '@/lib/api';
import { toast } from 'sonner';

interface DashboardAdminProps {
  user: User;
}

const DashboardAdmin = ({ user }: DashboardAdminProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminApi.getStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Usuarios</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalUsers || 0}
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
                <p className="text-sm text-muted-foreground mb-1">Empresas</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalCompanies || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Campañas</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalCampaigns || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Lukitas</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats?.totalLukasDistributed || 0).toLocaleString()}
                </p>
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
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/usuarios')}
              >
                Ver Todos los Usuarios
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => { navigate('/dashboard/admin/usuarios'); toast.info('Filtrando usuarios nuevos...'); }}
              >
                Usuarios Nuevos
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => { navigate('/dashboard/admin/usuarios'); toast.info('Modo moderación activado'); }}
              >
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
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/empresas')}
              >
                Ver Todas las Empresas
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/empresas')}
              >
                Aprobar Solicitudes
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => toast.info('Gestión de permisos próximamente')}
              >
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
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/metricas')}
              >
                Métricas Avanzadas
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/reportes')}
              >
                Reportes Excel
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/dashboard/admin/configuracion')}
              >
                Configuración
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardAdmin;
