import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Scan, Send } from 'lucide-react';
import { toast } from 'sonner';
import QRCodeGenerator from './QRCodeGenerator';
import QRCodeScanner from './QRCodeScanner';
import { transfersApi, ApiError } from '@/lib/api';

interface TransferMoneyDialogProps {
  currentUserId: string;
  currentUserPoints: number;
  onTransferComplete: () => void;
}

const TransferMoneyDialog = ({ currentUserId, currentUserPoints, onTransferComplete }: TransferMoneyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransferById = async () => {
    if (!recipientId || !amount) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const transferAmount = parseInt(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }

    if (transferAmount > currentUserPoints) {
      toast.error('No tienes suficientes Luka Points');
      return;
    }

    if (recipientId === currentUserId) {
      toast.error('No puedes transferir a ti mismo');
      return;
    }

    setLoading(true);
    try {
      const response = await transfersApi.create({
        sourceAccountId: parseInt(currentUserId),
        destinationAccountId: parseInt(recipientId),
        amount: transferAmount,
      });

      if (response.success) {
        toast.success(`¡${transferAmount} Lukas enviados exitosamente!`);
        setRecipientId('');
        setAmount('');
        setOpen(false);
        onTransferComplete();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || 'Error al realizar la transferencia');
      } else {
        toast.error('Error al realizar la transferencia');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScanComplete = async (scannedId: string, scannedAmount: number) => {
    if (scannedAmount > currentUserPoints) {
      toast.error('No tienes suficientes Luka Points');
      return;
    }

    if (scannedId === currentUserId) {
      toast.error('No puedes transferir a ti mismo');
      return;
    }

    setLoading(true);
    try {
      const response = await transfersApi.create({
        sourceAccountId: parseInt(currentUserId),
        destinationAccountId: parseInt(scannedId),
        amount: scannedAmount,
      });

      if (response.success) {
        toast.success(`¡${scannedAmount} Lukas enviados exitosamente!`);
        setOpen(false);
        onTransferComplete();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || 'Error al realizar la transferencia');
      } else {
        toast.error('Error al realizar la transferencia');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Send className="mr-2 h-4 w-4" />
          Transferir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transferir Luka Points</DialogTitle>
          <DialogDescription>
            Envía puntos a otros estudiantes usando QR o su ID
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="by-id" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="by-id" className="text-xs sm:text-sm">
              <Send className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Por ID</span>
              <span className="sm:hidden">ID</span>
            </TabsTrigger>
            <TabsTrigger value="generate-qr" className="text-xs sm:text-sm">
              <QrCode className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Generar QR</span>
              <span className="sm:hidden">QR</span>
            </TabsTrigger>
            <TabsTrigger value="scan-qr" className="text-xs sm:text-sm">
              <Scan className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Escanear</span>
              <span className="sm:hidden">Scan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="by-id" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">ID de cuenta destino</Label>
              <Input
                id="recipient"
                type="number"
                placeholder="Ej: 2"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                className="bg-input border-border"
              />
              <div className="text-xs text-muted-foreground space-y-1 p-2 bg-muted/50 rounded">
                <p className="font-medium">Cuentas disponibles:</p>
                <p>• ID 1 = Juan (Estudiante)</p>
                <p>• ID 2 = Carlos (Empresa)</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Cantidad de Lukas</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-input border-border"
              />
              <p className="text-xs text-muted-foreground">
                Tienes {currentUserPoints} Lukas disponibles
              </p>
            </div>
            <Button
              onClick={handleTransferById}
              disabled={loading}
              className="w-full bg-gradient-primary text-primary-foreground"
            >
              {loading ? 'Enviando...' : 'Enviar Lukas'}
            </Button>
          </TabsContent>

          <TabsContent value="generate-qr" className="mt-4">
            <QRCodeGenerator userEmail={currentUserId} />
          </TabsContent>

          <TabsContent value="scan-qr" className="mt-4">
            <QRCodeScanner
              onScanSuccess={handleScanComplete}
              disabled={loading}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TransferMoneyDialog;
