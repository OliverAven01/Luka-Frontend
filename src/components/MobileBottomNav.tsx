import { Home, Search, Plus, TrendingUp, Building2, Users, ShieldCheck, ListChecks, BarChart3, Briefcase, Trophy, UserCircle, Receipt, Package, Target } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

interface User {
  id?: string;
  email: string;
  name: string;
  role: string;
  lukaPoints?: number;
}

interface MobileBottomNavProps {
  user: User;
}

const MobileBottomNav = ({ user }: MobileBottomNavProps) => {
  const location = useLocation();

  // Configuración de navegación por rol
  const getNavItems = () => {
    const role = user.role;
    
    if (role === 'admin') {
      return [
        { title: "Inicio", url: "/dashboard", icon: TrendingUp },
        { title: "Empresas", url: "/dashboard/admin/empresas", icon: Building2 },
        { title: "Usuarios", url: "/dashboard/admin/usuarios", icon: Users },
        { title: "Métricas", url: "/dashboard/admin/metricas", icon: Settings },
        { title: "Perfil", url: "/dashboard/admin/perfil", icon: ShieldCheck },
      ];
    }
    
    if (role === 'empresa' || role === 'coordinator') {
      return [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "Campañas", url: "/dashboard/empresa/campanas", icon: ListChecks },
        { title: "Crear", url: "/dashboard/empresa/crear", icon: Plus },
        { title: "Transacciones", url: "/dashboard/empresa/transacciones", icon: Receipt },
        { title: "Perfil", url: "/dashboard/empresa/perfil", icon: Briefcase },
      ];
    }
    
    // estudiante o student
    return [
      { title: "Inicio", url: "/dashboard", icon: Home },
      { title: "Campañas", url: "/dashboard/estudiante/campanas", icon: Search },
      { title: "Tienda", url: "/dashboard/estudiante/productos", icon: Package },
      { title: "Misiones", url: "/dashboard/estudiante/misiones", icon: Target },
      { title: "Perfil", url: "/dashboard/estudiante/perfil", icon: UserCircle },
    ];
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
