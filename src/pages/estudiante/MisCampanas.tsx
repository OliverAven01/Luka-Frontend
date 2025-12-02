import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Megaphone, Loader2, Calendar, MapPin, Users } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { studentsApi, Campaign, User } from '@/lib/api';

interface MisCampanasProps {
  user: User;
}

const MisCampanas = ({ user }: MisCampanasProps) => {
  const [campanas, setCampanas] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampanas();
  }, [user.id]);

  const loadCampanas = async () => {
    try {
      const response = await studentsApi.getCampaigns(user.id);
      if (response.success) {
        setCampanas(response.data);
      }
    } catch (error) {
      console.error('Error loading enrolled campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    if (end < now) return 'bg-gray-500/10 text-gray-500';
    return 'bg-green-500/10 text-green-500';
  };

  const getStatusText = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    if (end < now) return 'Finalizada';
    return 'Activa';
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Megaphone className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Mis Campañas</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : campanas.length === 0 ? (
          <Card className="p-8 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No estás inscrito en ninguna campaña</p>
            <p className="text-sm text-muted-foreground">Explora las campañas disponibles y participa para ganar Lukas</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {campanas.map((campana) => (
              <Card key={campana.id} className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Megaphone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{campana.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campana.endDate)}`}>
                        {getStatusText(campana.endDate)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{campana.budget}</p>
                    <p className="text-xs text-muted-foreground">Lukas</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{campana.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(campana.startDate)} - {formatDate(campana.endDate)}</span>
                  </div>
                  {campana.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{campana.location}</span>
                    </div>
                  )}
                  {campana.participants !== undefined && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{campana.participants} participantes</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MisCampanas;
