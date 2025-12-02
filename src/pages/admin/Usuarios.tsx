import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserCircle, Search, Filter, Eye } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { User } from '@/lib/api';
import { toast } from 'sonner';

interface UsuariosProps {
  user: User;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  points: number;
  campaigns: number;
  role: string;
}

const Usuarios = ({ user }: UsuariosProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');

  const usuarios: UserData[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@test.com', points: 1200, campaigns: 5, role: 'student' },
    { id: 2, name: 'María García', email: 'maria@email.com', points: 850, campaigns: 3, role: 'student' },
    { id: 3, name: 'Carlos López', email: 'empresa@test.com', points: 2100, campaigns: 8, role: 'coordinator' },
    { id: 4, name: 'Ana Martínez', email: 'ana@email.com', points: 650, campaigns: 2, role: 'student' },
    { id: 5, name: 'Admin Sistema', email: 'admin@test.com', points: 0, campaigns: 0, role: 'admin' },
  ];

  const filteredUsers = usuarios.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleName = (role: string) => {
    switch (role) {
      case 'student': return 'Estudiante';
      case 'coordinator': return 'Empresa';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <Button variant="outline" className="gap-2" onClick={() => setFilterOpen(true)}>
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredUsers.map((usuario) => (
            <Card key={usuario.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{usuario.name}</h3>
                    <p className="text-sm text-muted-foreground">{usuario.email}</p>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {getRoleName(usuario.role)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Lukitas</p>
                    <p className="text-lg font-bold text-foreground">{usuario.points}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Campañas</p>
                    <p className="text-lg font-bold text-foreground">{usuario.campaigns}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedUser(usuario)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Ver perfil
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter Dialog */}
        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtrar Usuarios</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rol</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-input border border-border"
                >
                  <option value="all">Todos</option>
                  <option value="student">Estudiantes</option>
                  <option value="coordinator">Empresas</option>
                  <option value="admin">Administradores</option>
                </select>
              </div>
              <Button className="w-full" onClick={() => { setFilterOpen(false); toast.success('Filtros aplicados'); }}>
                Aplicar Filtros
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* User Detail Dialog */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Perfil de Usuario</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Rol</p>
                    <p className="font-bold">{getRoleName(selectedUser.role)}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Lukitas</p>
                    <p className="font-bold">{selectedUser.points}</p>
                  </Card>
                </div>
                <Button className="w-full" onClick={() => { setSelectedUser(null); toast.success('Usuario actualizado'); }}>
                  Cerrar
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Usuarios;
