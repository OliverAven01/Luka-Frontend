import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Loader2, DollarSign, Send } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { adminApi, User, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface ConfiguracionProps {
  user: User;
}

const Configuracion = ({ user }: ConfiguracionProps) => {
  const [lukasValue, setLukasValue] = useState<number>(0);
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Emit Lukas
  const [emitCompanyId, setEmitCompanyId] = useState('');
  const [emitAmount, setEmitAmount] = useState('');
  const [emitReason, setEmitReason] = useState('');
  const [emitting, setEmitting] = useState(false);

  useEffect(() => {
    loadLukasValue();
  }, []);

  const loadLukasValue = async () => {
    try {
      const response = await adminApi.getLukasValue();
      if (response.success) {
        setLukasValue(response.data.lukasToUsdRate);
        setNewValue(String(response.data.lukasToUsdRate));
      }
    } catch (error) {
      console.error('Error loading lukas value:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateValue = async () => {
    const value = parseFloat(newValue);
    if (isNaN(value) || value <= 0) {
      toast.error('Ingresa un valor válido');
      return;
    }

    setSaving(true);
    try {
      await adminApi.updateLukasValue(value);
      setLukasValue(value);
      toast.success('Valor del Luka actualizado');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    } finally {
      setSaving(false);
    }
  };


  const handleEmitLukas = async () => {
    if (!emitCompanyId || !emitAmount || !emitReason) {
      toast.error('Completa todos los campos');
      return;
    }

    setEmitting(true);
    try {
      await adminApi.emitLukas({
        companyId: emitCompanyId,
        amount: parseInt(emitAmount),
        reason: emitReason
      });
      toast.success('Lukas emitidos exitosamente');
      setEmitCompanyId('');
      setEmitAmount('');
      setEmitReason('');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    } finally {
      setEmitting(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Valor del Luka */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Valor del Luka</h3>
            </div>
            
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Valor actual</p>
                  <p className="text-3xl font-bold text-primary">1 Luka = ${lukasValue} USD</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Nuevo valor (USD)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="0.50"
                    />
                    <Button onClick={handleUpdateValue} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Actualizar'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Emitir Lukas */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Send className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Emitir Lukas</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ID de Empresa</Label>
                <Input
                  type="number"
                  value={emitCompanyId}
                  onChange={(e) => setEmitCompanyId(e.target.value)}
                  placeholder="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cantidad de Lukas</Label>
                <Input
                  type="number"
                  value={emitAmount}
                  onChange={(e) => setEmitAmount(e.target.value)}
                  placeholder="1000"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Razón</Label>
                <Input
                  value={emitReason}
                  onChange={(e) => setEmitReason(e.target.value)}
                  placeholder="Campaña de marketing"
                />
              </div>
              
              <Button onClick={handleEmitLukas} disabled={emitting} className="w-full">
                {emitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Emitir Lukas
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Configuracion;
