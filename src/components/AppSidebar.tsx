import { Home, Search, Plus, TrendingUp, Building2, Users, Settings, ShieldCheck, ListChecks, BarChart3, Briefcase, Coins, Trophy, UserCircle, Receipt, Package, Target, Ticket, Cog, Store, FileSpreadsheet } from "lucide-react";
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
  id?: string;
  email: string;
  name: string;
  role: string;
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
    const role = user.role;
    
    if (role === 'admin') {
      return [
        { title: "Inicio", url: "/dashboard", icon: TrendingUp },
        { title: "Empresas", url: "/dashboard/admin/empresas", icon: Building2 },
        { title: "Usuarios", url: "/dashboard/admin/usuarios", icon: Users },
        { title: "Proveedores", url: "/dashboard/admin/proveedores", icon: Store },
        { title: "Productos", url: "/dashboard/admin/productos", icon: Package },
        { title: "Cupones", url: "/dashboard/admin/cupones", icon: Ticket },
        { title: "Métricas", url: "/dashboard/admin/metricas", icon: BarChart3 },
        { title: "Reportes", url: "/dashboard/admin/reportes", icon: FileSpreadsheet },
        { title: "Configuración", url: "/dashboard/admin/configuracion", icon: Cog },
        { title: "Perfil", url: "/dashboard/admin/perfil", icon: ShieldCheck },
      ];
    }
    
    if (role === 'empresa' || role === 'coordinator') {
      return [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "Campañas", url: "/dashboard/empresa/campanas", icon: ListChecks },
        { title: "Crear", url: "/dashboard/empresa/crear", icon: Plus },
        { title: "Cupones", url: "/dashboard/empresa/cupones", icon: Ticket },
        { title: "Transacciones", url: "/dashboard/empresa/transacciones", icon: Receipt },
        { title: "Rendimiento", url: "/dashboard/empresa/rendimiento", icon: BarChart3 },
        { title: "Perfil", url: "/dashboard/empresa/perfil", icon: Briefcase },
      ];
    }
    
    // estudiante o student
    return [
      { title: "Inicio", url: "/dashboard", icon: Home },
      { title: "Explorar", url: "/dashboard/estudiante/campanas", icon: Search },
      { title: "Mis Campañas", url: "/dashboard/estudiante/mis-campanas", icon: ListChecks },
      { title: "Tienda", url: "/dashboard/estudiante/productos", icon: Package },
      { title: "Misiones", url: "/dashboard/estudiante/misiones", icon: Target },
      { title: "Cupones", url: "/dashboard/estudiante/cupones", icon: Ticket },
      { title: "Transacciones", url: "/dashboard/estudiante/transacciones", icon: Receipt },
      { title: "Ranking", url: "/dashboard/estudiante/ranking", icon: Trophy },
      { title: "Perfil", url: "/dashboard/estudiante/perfil", icon: UserCircle },
    ];
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
