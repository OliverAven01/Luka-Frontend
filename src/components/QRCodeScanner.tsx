import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';

interface QRCodeScannerProps {
  onScanSuccess: (email: string, amount: number) => void;
  disabled?: boolean;
}

const QRCodeScanner = ({ onScanSuccess, disabled }: QRCodeScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanner]);

  const startScanning = () => {
    setScanning(true);
    
    const html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.email && data.amount) {
            onScanSuccess(data.email, data.amount);
            html5QrcodeScanner.clear();
            setScanning(false);
          }
        } catch (error) {
          console.error('Error parsing QR code:', error);
        }
      },
      (errorMessage) => {
        // Ignore errors during scanning
      }
    );

    setScanner(html5QrcodeScanner);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear().then(() => {
        setScanning(false);
        setScanner(null);
      });
    }
  };

  return (
    <div className="space-y-4 py-2">
      {!scanning ? (
        <Card className="p-6 bg-card/50 border-border">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="text-center text-sm text-foreground">
              Escanea un código QR para realizar una transferencia
            </p>
            <Button
              onClick={startScanning}
              disabled={disabled}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Camera className="mr-2 h-4 w-4" />
              Iniciar Escaneo
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div id="qr-reader" className="w-full rounded-lg overflow-hidden min-h-[300px]"></div>
          <Button
            onClick={stopScanning}
            variant="outline"
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center pt-2">
        <p>También puedes cargar una imagen del código QR</p>
      </div>
    </div>
  );
};

export default QRCodeScanner;
