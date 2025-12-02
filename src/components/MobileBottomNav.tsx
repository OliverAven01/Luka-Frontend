import { Home, Search, Plus, TrendingUp, Building2, Users, Settings, ShieldCheck, ListChecks, BarChart3, Briefcase, Coins, Trophy, UserCircle } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
  lukaPoints?: number;
}

interface MobileBottomNavProps {
  user: User;
}

const MobileBottomNav = ({ user }: MobileBottomNavProps) => {
  const location = useLocation();

  // Configuración de navegación por rol
  const getNavItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { title: "Inicio", url: "/dashboard", icon: TrendingUp },
          { title: "Empresas", url: "/dashboard/admin/empresas", icon: Building2 },
          { title: "Usuarios", url: "/dashboard/admin/usuarios", icon: Users },
          { title: "Métricas", url: "/dashboard/admin/metricas", icon: Settings },
          { title: "Perfil", url: "/dashboard/admin/perfil", icon: ShieldCheck },
        ];
      case 'empresa':
        return [
          { title: "Dashboard", url: "/dashboard", icon: Home },
          { title: "Campañas", url: "/dashboard/empresa/campanas", icon: ListChecks },
          { title: "Crear", url: "/dashboard/empresa/crear", icon: Plus },
          { title: "Rendimiento", url: "/dashboard/empresa/rendimiento", icon: BarChart3 },
          { title: "Perfil", url: "/dashboard/empresa/perfil", icon: Briefcase },
        ];
      case 'estudiante':
        return [
          { title: "Inicio", url: "/dashboard", icon: Home },
          { title: "Buscar", url: "/dashboard/estudiante/campanas", icon: Search },
          { title: "Lukitas", url: "/dashboard/estudiante/historial", icon: Coins },
          { title: "Ranking", url: "/dashboard/estudiante/ranking", icon: Trophy },
          { title: "Perfil", url: "/dashboard/estudiante/perfil", icon: UserCircle },
        ];
      default:
        return [];
    }
  };

  const items = getNavItems();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.url);

          // El botón central (Crear) es especial
          if (index === 2) {
            return (
              <NavLink
                key={item.title}
                to={item.url}
                className="flex flex-col items-center justify-center"
              >
                <div className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 flex items-center justify-center shadow-lg transition-all">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.title}
              to={item.url}
              className="flex flex-col items-center justify-center gap-1 flex-1"
            >
              <Icon
                className={`h-6 w-6 transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              />
              {active && <div className="h-0.5 w-6 bg-foreground rounded-full" />}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
