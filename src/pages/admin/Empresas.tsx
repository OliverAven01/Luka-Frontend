import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Search, Check, X, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { adminApi, PendingCompany, User, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface EmpresasProps {
  user: User;
}

const Empresas = ({ user }: EmpresasProps) => {
  const [empresas, setEmpresas] = useState<PendingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      const response = await adminApi.getPendingCompanies();
      if (response.success) {
        setEmpresas(response.data);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Error al cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (companyId: string, approved: boolean) => {
    setProcessingId(companyId);
    try {
      const response = await adminApi.approveCompany({
        companyId,
        approved,
        reason: approved ? 'Aprobado por administrador' : 'Rechazado por administrador',
      });

      if (response.success) {
        toast.success(approved ? 'Empresa aprobada' : 'Empresa rechazada');
        loadEmpresas();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Error al procesar la solicitud');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const filteredEmpresas = empresas.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Empresas</h1>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 h-10 rounded-md bg-input border border-border text-foreground"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredEmpresas.length === 0 ? (
          <Card className="p-8 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay empresas pendientes de aprobación</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredEmpresas.map((empresa) => (
              <Card key={empresa.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{empresa.name}</h3>
                      <p className="text-sm text-muted-foreground">{empresa.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium">
                      {empresa.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-500 border-green-500"
                      onClick={() => handleApprove(empresa.id, true)}
                      disabled={processingId === empresa.id}
                    >
                      {processingId === empresa.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-500"
                      onClick={() => handleApprove(empresa.id, false)}
                      disabled={processingId === empresa.id}
                    >
                      <X className="h-4 w-4" />
                    </Button>
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

export default Empresas;
