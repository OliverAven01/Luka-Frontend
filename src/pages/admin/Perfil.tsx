import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { User } from '@/lib/api';
import { toast } from 'sonner';

interface PerfilProps {
  user: User;
}

const Perfil = ({ user }: PerfilProps) => {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user.name || '');

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Perfil actualizado correctamente');
    setSaving(false);
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Perfil de Administrador</h1>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground">Administrador del Sistema</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Input id="role" defaultValue="Administrador" disabled />
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
