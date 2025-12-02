import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Coins, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { User, studentsApi, transfersApi, Transfer } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HistorialProps {
  user: User;
}

const Historial = ({ user }: HistorialProps) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      const [balanceRes, transfersRes] = await Promise.all([
        studentsApi.getBalance(user.id),
        transfersApi.getByAccount(user.id)
      ]);
      
      if (balanceRes.success) setBalance(balanceRes.data.balance || 0);
      if (transfersRes.success) setTransactions(transfersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d 'de' MMMM, HH:mm", { locale: es });
    } catch {
      return 'Sin fecha';
    }
  };

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
              <span className="text-5xl font-bold text-foreground">
                {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : balance}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Lukitas disponibles</p>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Transacciones Recientes</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
            <Card className="p-8 text-center">
              <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay transacciones registradas</p>
            </Card>
          ) : (
            transactions.map((tx) => {
              const accountId = parseInt(user.id);
              const isIncoming = tx.destinationAccountId === accountId;
              const dateStr = tx.transferDate || tx.createdAt || '';
              
              return (
                <Card key={tx.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        isIncoming ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        {isIncoming ? (
                          <TrendingUp className="h-6 w-6 text-green-500" />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {isIncoming ? 'Recibido' : 'Enviado'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {dateStr ? formatDate(dateStr) : 'Sin fecha'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xl font-bold ${
                      isIncoming ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {isIncoming ? '+' : '-'}{tx.amount}
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Historial;
