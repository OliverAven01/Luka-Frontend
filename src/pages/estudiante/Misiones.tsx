import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Loader2, CheckCircle, Clock, Trophy } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { missionsApi, UserMission, User, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface MisionesProps {
  user: User;
}

const Misiones = ({ user }: MisionesProps) => {
  const [allMissions, setAllMissions] = useState<UserMission[]>([]);
  const [pendingMissions, setPendingMissions] = useState<UserMission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMissions();
  }, [user.id]);

  const loadMissions = async () => {
    try {
      const [allRes, pendingRes, completedRes] = await Promise.all([
        missionsApi.getByUser(user.id),
        missionsApi.getPending(user.id),
        missionsApi.getCompleted(user.id)
      ]);
      
      if (allRes.success) setAllMissions(allRes.data);
      if (pendingRes.success) setPendingMissions(pendingRes.data);
      if (completedRes.success) setCompletedMissions(completedRes.data);
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (userMissionId: string) => {
    try {
      await missionsApi.complete({ userMissionId });
      toast.success('¡Misión completada!');
      loadMissions();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  };


  const MissionCard = ({ mission, showComplete = false }: { mission: UserMission; showComplete?: boolean }) => (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
            mission.status === 'completed' ? 'bg-green-500/10' : 'bg-primary/10'
          }`}>
            {mission.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Target className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{mission.mission?.name || `Misión #${mission.missionId}`}</h3>
            <p className="text-sm text-muted-foreground">{mission.mission?.description || 'Sin descripción'}</p>
            {mission.mission?.reward && (
              <p className="text-sm font-medium text-primary mt-1">
                Recompensa: {mission.mission.reward} Lukas
              </p>
            )}
          </div>
        </div>
        {showComplete && mission.status === 'pending' && (
          <Button size="sm" onClick={() => handleComplete(mission.id)}>
            Completar
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <DashboardLayout user={user}>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Mis Misiones</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Pendientes ({pendingMissions.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Completadas ({completedMissions.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2">
                <Trophy className="h-4 w-4" />
                Todas ({allMissions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-3 mt-4">
              {pendingMissions.length === 0 ? (
                <Card className="p-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tienes misiones pendientes</p>
                </Card>
              ) : (
                pendingMissions.map(m => <MissionCard key={m.id} mission={m} showComplete />)
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3 mt-4">
              {completedMissions.length === 0 ? (
                <Card className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aún no has completado misiones</p>
                </Card>
              ) : (
                completedMissions.map(m => <MissionCard key={m.id} mission={m} />)
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-3 mt-4">
              {allMissions.length === 0 ? (
                <Card className="p-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tienes misiones asignadas</p>
                </Card>
              ) : (
                allMissions.map(m => <MissionCard key={m.id} mission={m} showComplete={m.status === 'pending'} />)
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Misiones;
