import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, Coins, Trophy, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { User, studentsApi } from '@/lib/api';
import { toast } from 'sonner';

interface PerfilProps {
  user: User;
}

const Perfil = ({ user }: PerfilProps) => {
  const [saving, setSaving] = useState(false);
  const [balance, setBalance] = useState(0);
  const [formData, setFormData] = useState({
    name: user.name || '',
    university: user.university || '',
    career: '',
  });

  useEffect(() => {
    loadBalance();
  }, [user.id]);

  const loadBalance = async () => {
    try {
      const response = await studentsApi.getBalance(user.id);
      if (response.success) {
        setBalance(response.data.balance || 0);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Perfil actualizado correctamente');
    setSaving(false);
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
              <UserCircle className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground">Estudiante</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 bg-primary/5">
              <div className="flex items-center gap-3">
                <Coins className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Lukitas</p>
                  <p className="text-2xl font-bold text-foreground">{balance}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-primary/5">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Ranking</p>
                  <p className="text-2xl font-bold text-foreground">#12</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">Universidad</Label>
              <Input 
                id="university" 
                placeholder="Nombre de tu universidad"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="career">Carrera</Label>
              <Input 
                id="career" 
                placeholder="Tu carrera"
                value={formData.career}
                onChange={(e) => setFormData({ ...formData, career: e.target.value })}
              />
            </div>

            <Button className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Guardar Cambios
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Perfil;
