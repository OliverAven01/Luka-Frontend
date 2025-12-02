import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { campaignsApi, User, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface CrearProps {
  user: User;
}

const Crear = ({ user }: CrearProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    campaignType: 'marketing',
    budget: '',
    startDate: '',
    endDate: '',
    schedule: '',
    location: '',
    contactNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await campaignsApi.create({
        name: formData.name,
        description: formData.description,
        campaignType: formData.campaignType,
        budget: parseInt(formData.budget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        schedule: formData.schedule || undefined,
        location: formData.location || undefined,
        contactNumber: formData.contactNumber || undefined,
      });

      if (response.success) {
        toast.success('¡Campaña creada exitosamente!');
        navigate('/dashboard/empresa/campanas');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || 'Error al crear la campaña');
      } else {
        toast.error('Error al crear la campaña');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <PlusCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Crear Nueva Campaña</h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la campaña *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Campaña de Verano 2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaignType">Tipo de campaña *</Label>
                <select
                  id="campaignType"
                  name="campaignType"
                  value={formData.campaignType}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md bg-input border border-border"
                >
                  <option value="marketing">Marketing</option>
                  <option value="promocion">Promoción</option>
                  <option value="encuesta">Encuesta</option>
                  <option value="evento">Evento</option>
                </select>
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe los objetivos y detalles de la campaña"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget">Presupuesto (Lukitas) *</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  placeholder="5000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de inicio *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de fin *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schedule">Horario</Label>
                <Input
                  id="schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  placeholder="Ej: 9:00 - 18:00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ej: Lima, Perú"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Teléfono de contacto</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+51 999 999 999"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Campaña'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/empresa/campanas')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Crear;
