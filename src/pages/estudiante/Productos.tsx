import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Loader2, Package, Minus, Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { productsApi, studentsApi, Product, User, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface ProductosProps {
  user: User;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const Productos = ({ user }: ProductosProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsApi.getAll({ page: 1, pageSize: 50 });
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} agregado al carrito`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handlePurchase = async () => {
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setPurchasing(true);
    try {
      await studentsApi.purchase({
        studentId: user.id,
        supplierId: cart[0].product.supplierId,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      });
      toast.success('¡Compra realizada exitosamente!');
      setCart([]);
      loadProducts();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || 'Error al realizar la compra');
      } else {
        toast.error('Error al realizar la compra');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Tienda</h1>
          </div>
          {cart.length > 0 && (
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-bold">{cart.length} items - {cartTotal} Lukas</span>
            </div>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>


        {/* Carrito */}
        {cart.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Carrito</h3>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <span>{item.product.name}</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.product.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.product.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="ml-2">{item.product.price * item.quantity} Lukas</span>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handlePurchase} disabled={purchasing} className="w-full mt-4">
              {purchasing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
              Comprar ({cartTotal} Lukas)
            </Button>
          </Card>
        )}

        {/* Productos */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay productos disponibles</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <Card key={product.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {product.stock} disponibles
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary mb-3">{product.price} Lukas</p>
                <Button onClick={() => addToCart(product)} className="w-full" disabled={product.stock === 0}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Productos;
