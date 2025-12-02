import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Megaphone, Coins, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { campaignsApi, Campaign, User, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface CampanasProps {
  user: User;
}

const Campanas = ({ user }: CampanasProps) => {
  const [campanas, setCampanas] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    loadCampanas();
  }, []);

  const loadCampanas = async () => {
    try {
      const response = await campaignsApi.getActive({ page: 1, pageSize: 50 });
      if (response.success) {
        setCampanas(response.data);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Error al cargar las campañas');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (campaignId: string) => {
    setEnrollingId(campaignId);
    try {
      const response = await campaignsApi.enroll({
        campaignId,
        studentId: user.id,
      });

      if (response.success) {
        toast.success('¡Te has inscrito exitosamente!');
        loadCampanas(); // Refresh list
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message || 'Error al inscribirse');
      } else {
        toast.error('Error al inscribirse en la campaña');
      }
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCampanas = campanas.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Search className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Campañas Disponibles</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar campañas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 h-12 rounded-lg bg-input border border-border text-foreground"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCampanas.length === 0 ? (
          <Card className="p-8 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay campañas disponibles</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredCampanas.map((campana) => (
              <Card key={campana.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-14 w-14 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Megaphone className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          {campana.companyName || campana.campaignType}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{campana.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{campana.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-primary" />
                          {campana.budget} Lukitas
                        </span>
                        {campana.participants !== undefined && (
                          <span>{campana.participants} participantes</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleEnroll(campana.id)}
                    disabled={enrollingId === campana.id}
                  >
                    {enrollingId === campana.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Participar'
                    )}
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

export default Campanas;
