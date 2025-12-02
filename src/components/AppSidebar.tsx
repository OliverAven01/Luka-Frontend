import { Home, Search, Plus, TrendingUp, Building2, Users, Settings, ShieldCheck, ListChecks, BarChart3, Briefcase, Coins, Trophy, UserCircle, Receipt } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
  lukaPoints?: number;
}

interface AppSidebarProps {
  user: User;
}

const AppSidebar = ({ user }: AppSidebarProps) => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Configuración de navegación por rol
  const getMenuItems = () => {
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
          { title: "Transacciones", url: "/dashboard/estudiante/transacciones", icon: Receipt },
          { title: "Ranking", url: "/dashboard/estudiante/ranking", icon: Trophy },
          { title: "Perfil", url: "/dashboard/estudiante/perfil", icon: UserCircle },
        ];
      default:
        return [];
    }
  };

  const items = getMenuItems();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={isActive(item.url) ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                  >
                    <NavLink to={item.url} end>
                      <item.icon className="h-6 w-6" />
                      {!isCollapsed && <span className="text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
