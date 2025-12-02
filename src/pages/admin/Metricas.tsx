import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Building2, Coins, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { adminApi, AdminStatistics, User } from '@/lib/api';
import { toast } from 'sonner';

interface MetricasProps {
  user: User;
}

const Metricas = ({ user }: MetricasProps) => {
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
      console.error('Error loading statistics:', error);
      toast.error('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
            <p className="text-3xl font-bold text-foreground">
              {stats?.totalUsers?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Estudiantes: {stats?.totalStudents || 0}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Empresas</p>
            <p className="text-3xl font-bold text-foreground">
              {stats?.totalCompanies || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Proveedores: {stats?.totalSuppliers || 0}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Lukas en Circulación</p>
            <p className="text-3xl font-bold text-foreground">
              {stats?.totalLukasInCirculation?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Gastados: {stats?.totalLukasSpent?.toLocaleString() || 0}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Campañas Activas</p>
            <p className="text-3xl font-bold text-foreground">
              {stats?.activeCampaigns || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Transacciones: {stats?.totalTransactions || 0}
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Metricas;
