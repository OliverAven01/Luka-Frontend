import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface QRCodeGeneratorProps {
  userEmail: string;
}

const QRCodeGenerator = ({ userEmail }: QRCodeGeneratorProps) => {
  const [amount, setAmount] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (amount && parseInt(amount) > 0) {
      const data = JSON.stringify({
        email: userEmail,
        amount: parseInt(amount),
      });

      QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#00D9FF',
          light: '#000000',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error(err));
    } else {
      setQrCodeUrl('');
    }
  }, [amount, userEmail]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="qr-amount">Cantidad a recibir</Label>
        <Input
          id="qr-amount"
          type="number"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-input border-border"
        />
        <p className="text-xs text-muted-foreground">
          Genera un QR para que otros te envíen esta cantidad
        </p>
      </div>

      {qrCodeUrl && (
        <Card className="p-4 bg-card border-primary/30">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Muestra este código QR para recibir {amount} Luka Points
            </p>
            <div className="bg-white p-4 rounded-lg">
              <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-[250px] h-auto" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Tu email: {userEmail}
            </p>
          </div>
        </Card>
      )}

      {!amount && (
        <div className="text-center text-muted-foreground text-sm py-8">
          Ingresa una cantidad para generar el código QR
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
