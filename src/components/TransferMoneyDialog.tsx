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
import { transferPoints, getProfileByEmail } from '@/lib/supabase-db';

interface TransferMoneyDialogProps {
  currentUserEmail: string;
  currentUserPoints: number;
  onTransferComplete: () => void;
}

const TransferMoneyDialog = ({ currentUserEmail, currentUserPoints, onTransferComplete }: TransferMoneyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransferById = async () => {
    if (!recipientEmail || !amount) {
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

    if (recipientEmail === currentUserEmail) {
      toast.error('No puedes transferir a ti mismo');
      return;
    }

    setLoading(true);
    try {
      const recipient = await getProfileByEmail(recipientEmail);
      if (!recipient) {
        toast.error('Usuario no encontrado');
        setLoading(false);
        return;
      }

      const result = await transferPoints(currentUserEmail, recipientEmail, transferAmount);
      
      if (result.success) {
        toast.success(`¡${transferAmount} Luka Points enviados exitosamente!`);
        setRecipientEmail('');
        setAmount('');
        setOpen(false);
        onTransferComplete();
      } else {
        toast.error(result.error || 'Error al realizar la transferencia');
      }
    } catch (error) {
      toast.error('Error al realizar la transferencia');
    } finally {
      setLoading(false);
    }
  };

  const handleScanComplete = async (scannedEmail: string, scannedAmount: number) => {
    if (scannedAmount > currentUserPoints) {
      toast.error('No tienes suficientes Luka Points');
      return;
    }

    if (scannedEmail === currentUserEmail) {
      toast.error('No puedes transferir a ti mismo');
      return;
    }

    setLoading(true);
    try {
      const result = await transferPoints(currentUserEmail, scannedEmail, scannedAmount);
      
      if (result.success) {
        toast.success(`¡${scannedAmount} Luka Points enviados exitosamente!`);
        setOpen(false);
        onTransferComplete();
      } else {
        toast.error(result.error || 'Error al realizar la transferencia');
      }
    } catch (error) {
      toast.error('Error al realizar la transferencia');
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
            Envía puntos a otros estudiantes usando QR o su email
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="by-id" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="by-id" className="text-xs sm:text-sm">
              <Send className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Por Email</span>
              <span className="sm:hidden">Email</span>
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
              <Label htmlFor="recipient">Email del destinatario</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="estudiante@luka.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Cantidad de Luka Points</Label>
              <Input
                id="amount"
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-input border-border"
              />
              <p className="text-xs text-muted-foreground">
                Tienes {currentUserPoints} Luka Points disponibles
              </p>
            </div>
            <Button
              onClick={handleTransferById}
              disabled={loading}
              className="w-full bg-gradient-primary text-primary-foreground"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </TabsContent>

          <TabsContent value="generate-qr" className="mt-4">
            <QRCodeGenerator userEmail={currentUserEmail} />
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
