import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { transfersApi, Transfer, User } from '@/lib/api';
import { ArrowDownLeft, ArrowUpRight, Loader2, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TransaccionesProps {
  user: User;
}

const Transacciones = ({ user }: TransaccionesProps) => {
  const [transactions, setTransactions] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        // Empresa tiene accountId = 2
        const accountId = user.id === '2' ? '2' : user.id;
        const response = await transfersApi.getByAccount(accountId);
        if (response.success) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user.id]);

  const getTransactionType = (transaction: Transfer) => {
    const accountId = parseInt(user.id);
    return transaction.sourceAccountId === accountId ? 'sent' : 'received';
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Receipt className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Transacciones</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <Card className="p-8 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay transacciones registradas</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const type = getTransactionType(transaction);
              const isSent = type === 'sent';
              const dateStr = transaction.transferDate || transaction.createdAt || '';

              return (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          isSent ? 'bg-destructive/10' : 'bg-green-500/10'
                        }`}
                      >
                        {isSent ? (
                          <ArrowUpRight className="h-5 w-5 text-destructive" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {isSent ? 'Enviado' : 'Recibido'}
                          </p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {transaction.status || 'completado'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {dateStr 
                            ? format(new Date(dateStr), "d 'de' MMMM, yyyy", { locale: es })
                            : 'Sin fecha'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${isSent ? 'text-destructive' : 'text-green-500'}`}>
                        {isSent ? '-' : '+'}{transaction.amount} Lukas
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transacciones;
