import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, Send, Target, Ticket, TrendingUp, TrendingDown } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import TransferMoneyDialog from '@/components/TransferMoneyDialog';
import { useState, useEffect } from 'react';
import { studentsApi, transfersApi, User, Transfer } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface DashboardEstudianteProps {
  user: User;
}

const DashboardEstudiante = ({ user }: DashboardEstudianteProps) => {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshData = async () => {
    try {
      // Get balance
      const balanceResponse = await studentsApi.getBalance(user.id);
      if (balanceResponse.success) {
        setPoints(balanceResponse.data.balance || 0);
      }

      // Get recent transactions
      const transfersResponse = await transfersApi.getByAccount(user.id);
      if (transfersResponse.success) {
        setTransactions(transfersResponse.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user.id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button 
            onClick={() => navigate('/dashboard/estudiante/campanas')}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Megaphone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground text-center">Campañas</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/estudiante/productos')}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Send className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground text-center">Tienda</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/estudiante/misiones')}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground text-center">Misiones</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/estudiante/cupones')}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
          >
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
              <span className="text-3xl sm:text-4xl font-bold text-foreground">
                {loading ? '...' : points}
              </span>
              <span className="text-2xl sm:text-3xl">💰</span>
            </div>
          </Card>
          <div className="flex items-center justify-center sm:justify-start">
            <TransferMoneyDialog
              currentUserId={user.id}
              currentUserPoints={points}
              onTransferComplete={refreshData}
            />
          </div>
        </div>

        {/* Mis Cuentas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Mis Cuentas</h3>
            <Button 
              variant="link" 
              className="text-primary h-auto p-0 text-sm"
              onClick={() => navigate('/dashboard/estudiante/perfil')}
            >
              Ver todo
            </Button>
          </div>
          <Card className="p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xs sm:text-sm font-semibold text-primary">LK</span>
              </div>
              <div>
                <p className="text-sm sm:text-base font-medium text-foreground">Cuenta Principal</p>
                <p className="text-xs text-muted-foreground">Saldo actual</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-bold text-foreground">{points}</span>
              <span className="text-base sm:text-lg">💰</span>
            </div>
          </Card>
        </div>

        {/* Últimas Transacciones */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Últimas Transacciones</h3>
            <Button 
              variant="link" 
              className="text-primary h-auto p-0 text-sm"
              onClick={() => navigate('/dashboard/estudiante/transacciones')}
            >
              Ver todo
            </Button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <Card className="p-4 text-center text-muted-foreground">
                Cargando transacciones...
              </Card>
            ) : transactions.length === 0 ? (
              <Card className="p-4 text-center text-muted-foreground">
                No hay transacciones recientes
              </Card>
            ) : (
              transactions.map((tx) => {
                const accountId = parseInt(user.id);
                const isIncoming = tx.destinationAccountId === accountId;
                const dateStr = tx.transferDate || tx.createdAt || '';
                return (
                  <Card key={tx.id} className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center ${
                        isIncoming ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        {isIncoming ? (
                          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-medium text-foreground">
                          {isIncoming ? 'Ingreso' : 'Egreso'}
                        </p>
                        <p className="text-xs text-muted-foreground">{dateStr ? formatDate(dateStr) : 'Sin fecha'}</p>
                      </div>
                    </div>
                    <span className={`text-base sm:text-lg font-bold ${
                      isIncoming ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {isIncoming ? '+' : '-'}{tx.amount}
                    </span>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardEstudiante;
