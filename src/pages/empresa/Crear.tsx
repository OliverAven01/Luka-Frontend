import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
}

interface CrearProps {
  user: User;
}

const Crear = ({ user }: CrearProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Campaña creada exitosamente');
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Crear Nueva Campaña</h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Campaña</Label>
              <Input 
                id="name" 
                placeholder="Ej: Promoción de Verano 2025"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea 
                id="description"
                placeholder="Describe los objetivos y beneficios de tu campaña..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">Puntos por Participación</Label>
                <Input 
                  id="points"
                  type="number"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duración (días)</Label>
                <Input 
                  id="duration"
                  type="number"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Audiencia Objetivo</Label>
              <select
                id="target"
                className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                required
              >
                <option value="">Selecciona una audiencia</option>
                <option value="all">Todos los estudiantes</option>
                <option value="university">Estudiantes universitarios</option>
                <option value="high-school">Estudiantes de secundaria</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Crear Campaña
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Guardar como Borrador
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Crear;
