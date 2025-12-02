import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ticket, Plus, Loader2, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { couponsApi, campaignsApi, suppliersApi, Coupon, Campaign, Supplier, User, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface CuponesProps {
  user: User;
}

const Cupones = ({ user }: CuponesProps) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [formData, setFormData] = useState({
    campaignId: '',
    supplierId: '',
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    expirationDate: '',
  });

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    try {
      const [campaignsRes, suppliersRes] = await Promise.all([
        campaignsApi.getByCompany(user.id),
        suppliersApi.getAll({ page: 1, pageSize: 100 })
      ]);
      if (campaignsRes.success) {
        setCampaigns(campaignsRes.data);
        if (campaignsRes.data.length > 0) {
          setSelectedCampaign(campaignsRes.data[0].id);
          loadCoupons(campaignsRes.data[0].id);
        }
      }
      if (suppliersRes.success) setSuppliers(suppliersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCoupons = async (campaignId: string) => {
    try {
      const response = await couponsApi.getByCampaign(campaignId);
      if (response.success) setCoupons(response.data);
    } catch (error) {
      setCoupons([]);
    }
  };

  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaign(campaignId);
    loadCoupons(campaignId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await couponsApi.create({
        campaignId: formData.campaignId || selectedCampaign,
        supplierId: formData.supplierId,
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        expirationDate: formData.expirationDate,
      });
      toast.success('Cupón creado');
      setDialogOpen(false);
      resetForm();
      loadCoupons(selectedCampaign);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este cupón?')) return;
    try {
      await couponsApi.delete(id);
      toast.success('Cupón eliminado');
      loadCoupons(selectedCampaign);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({ campaignId: '', supplierId: '', code: '', discountType: 'percentage', discountValue: '', expirationDate: '' });
  };


  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ticket className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Mis Cupones</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button disabled={campaigns.length === 0}><Plus className="h-4 w-4 mr-2" />Nuevo Cupón</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Cupón</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Campaña</Label>
                  <select
                    value={formData.campaignId || selectedCampaign}
                    onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border"
                    required
                  >
                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Proveedor</Label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Código del cupón</Label>
                  <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="DESCUENTO20" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de descuento</Label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                      className="w-full h-10 px-3 rounded-md bg-input border border-border"
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Fijo (Lukas)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input type="number" step="0.01" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} placeholder="10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Fecha de expiración</Label>
                  <Input type="date" value={formData.expirationDate} onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })} required />
                </div>
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Crear Cupón
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {campaigns.length > 0 && (
          <div className="space-y-2">
            <Label>Filtrar por campaña</Label>
            <select
              value={selectedCampaign}
              onChange={(e) => handleCampaignChange(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-input border border-border"
            >
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : campaigns.length === 0 ? (
          <Card className="p-8 text-center">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Primero debes crear una campaña para poder agregar cupones</p>
          </Card>
        ) : coupons.length === 0 ? (
          <Card className="p-8 text-center">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay cupones para esta campaña</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <Card key={coupon.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">{coupon.code}</h3>
                  </div>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(coupon.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-2xl font-bold text-primary mb-2">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${coupon.discountValue} Lukas`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expira: {new Date(coupon.expirationDate).toLocaleDateString('es-ES')}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Cupones;
