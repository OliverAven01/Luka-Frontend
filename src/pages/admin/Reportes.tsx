import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, Download, Loader2, Users, Receipt, ShoppingCart } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { User } from '@/lib/api';
import { API_BASE_URL, getAuthHeaders } from '@/lib/api/config';
import { toast } from 'sonner';

interface ReportesProps {
  user: User;
}

const Reportes = ({ user }: ReportesProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0].slice(0, 7) + '-01',
    endDate: new Date().toISOString().split('T')[0],
  });

  const downloadReport = async (type: 'transactions' | 'sales' | 'users') => {
    setLoading(type);
    try {
      let url = `${API_BASE_URL}/api/Report/`;
      
      if (type === 'transactions') {
        url += `transactions/excel?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      } else if (type === 'sales') {
        url += `sales/excel?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      } else {
        url += 'users/excel';
      }

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Error al descargar');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `reporte_${type}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Reporte descargado');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Error al descargar el reporte');
    } finally {
      setLoading(null);
    }
  };

  const reports = [
    {
      id: 'transactions',
      title: 'Reporte de Transferencias',
      description: 'Historial completo de transferencias entre cuentas',
      icon: Receipt,
      hasDateRange: true,
    },
    {
      id: 'sales',
      title: 'Reporte de Ventas',
      description: 'Detalle de todas las ventas realizadas',
      icon: ShoppingCart,
      hasDateRange: true,
    },
    {
      id: 'users',
      title: 'Reporte de Usuarios',
      description: 'Lista completa de usuarios registrados',
      icon: Users,
      hasDateRange: false,
    },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
        </div>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Rango de fechas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha inicio</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha fin</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <report.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
              </div>
              <Button
                onClick={() => downloadReport(report.id as 'transactions' | 'sales' | 'users')}
                disabled={loading === report.id}
                className="w-full"
              >
                {loading === report.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Descargar Excel
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reportes;
