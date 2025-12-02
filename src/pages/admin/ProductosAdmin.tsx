import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Search, Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { productsApi, suppliersApi, Product, Supplier, User, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface ProductosAdminProps {
  user: User;
}

const ProductosAdmin = ({ user }: ProductosAdminProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: '',
    productTypeId: '1',
    code: '',
    name: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, suppliersRes] = await Promise.all([
        productsApi.getAll({ page: 1, pageSize: 100 }),
        suppliersApi.getAll({ page: 1, pageSize: 100 })
      ]);
      if (productsRes.success) setProducts(productsRes.data);
      if (suppliersRes.success) setSuppliers(suppliersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, {
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          status: 'active'
        });
        toast.success('Producto actualizado');
      } else {
        await productsApi.create({
          supplierId: formData.supplierId,
          productTypeId: formData.productTypeId,
          code: formData.code,
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        });
        toast.success('Producto creado');
      }
      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };


  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      supplierId: product.supplierId,
      productTypeId: product.productTypeId,
      code: product.code,
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await productsApi.delete(id);
      toast.success('Producto eliminado');
      loadData();
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ supplierId: '', productTypeId: '1', code: '', name: '', price: '', stock: '' });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Nuevo Producto</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Editar' : 'Nuevo'} Producto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingProduct && (
                  <>
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
                      <Label>Código</Label>
                      <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Precio (Lukas)</Label>
                    <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                  </div>
                </div>
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay productos registrados</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{product.code}</p>
                    <h3 className="font-semibold">{product.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {product.stock} en stock
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary mb-3">{product.price} Lukas</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(product)}>
                    <Pencil className="h-4 w-4 mr-1" />Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductosAdmin;
