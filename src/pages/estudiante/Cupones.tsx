import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ticket, Search, Loader2, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { couponsApi, Coupon, User, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface CuponesProps {
  user: User;
}

const Cupones = ({ user }: CuponesProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);

  const handleSearch = async () => {
    if (!code.trim()) {
      toast.error('Ingresa un código de cupón');
      return;
    }

    setLoading(true);
    setCoupon(null);
    setValidationResult(null);

    try {
      const response = await couponsApi.getByCode(code.trim());
      if (response.success && response.data) {
        setCoupon(response.data);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error('Cupón no encontrado');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const response = await couponsApi.validate(code.trim());
      if (response.success) {
        setValidationResult('valid');
        toast.success('¡Cupón válido!');
      }
    } catch {
      setValidationResult('invalid');
      toast.error('Cupón inválido o expirado');
    } finally {
      setLoading(false);
    }
  };


  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Ticket className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Cupones</h1>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Buscar Cupón</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código del cupón</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  placeholder="Ej: DESCUENTO10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {coupon && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{coupon.code}</h4>
                    <p className="text-sm text-muted-foreground">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% de descuento`
                        : `${coupon.discountValue} Lukas de descuento`
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Expira: {new Date(coupon.expirationDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={handleValidate} disabled={loading}>
                      Validar
                    </Button>
                    {validationResult && (
                      <div className={`flex items-center gap-1 text-sm ${
                        validationResult === 'valid' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {validationResult === 'valid' ? (
                          <><CheckCircle className="h-4 w-4" /> Válido</>
                        ) : (
                          <><XCircle className="h-4 w-4" /> Inválido</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">¿Cómo usar cupones?</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Obtén un código de cupón de una campaña o promoción</li>
            <li>Ingresa el código en el campo de arriba</li>
            <li>Valida que el cupón esté activo</li>
            <li>Usa el cupón al momento de realizar una compra</li>
          </ol>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Cupones;
