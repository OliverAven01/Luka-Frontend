import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { getTransactionHistory, Transaction } from '@/lib/supabase-db';
import { ArrowDownLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
}

interface TransactionHistoryProps {
  user: User;
}

const TransactionHistory = ({ user }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactionHistory(user.email);
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user.email]);

  const getTransactionType = (transaction: Transaction) => {
    return transaction.from_email === user.email ? 'sent' : 'received';
  };

  const getOtherPartyEmail = (transaction: Transaction) => {
    return transaction.from_email === user.email
      ? transaction.to_email
      : transaction.from_email;
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Historial de Transacciones</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No hay transacciones registradas</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const type = getTransactionType(transaction);
              const isSent = type === 'sent';
              const otherParty = getOtherPartyEmail(transaction);

              return (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          isSent
                            ? 'bg-destructive/10'
                            : 'bg-green-500/10'
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
                            {isSent ? 'Enviado a' : 'Recibido de'}
                          </p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {otherParty}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(transaction.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          isSent ? 'text-destructive' : 'text-green-500'
                        }`}
                      >
                        {isSent ? '-' : '+'}
                        {transaction.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">Luka Points</p>
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

export default TransactionHistory;
