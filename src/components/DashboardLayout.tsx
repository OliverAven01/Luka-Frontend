import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import MobileBottomNav from "./MobileBottomNav";
import { Button } from "./ui/button";
import { Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import CoinRain from "./CoinRain";

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
  lukaPoints?: number;
}

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
}

const DashboardLayout = ({ user, children }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background relative">
      <CoinRain />
      
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full relative z-10">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <AppSidebar user={user} />
          </div>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-card border-b border-border">
              <div className="flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <SidebarTrigger className="hidden md:flex flex-shrink-0" />
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-foreground truncate">{user.name}</h2>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="relative flex-shrink-0">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="flex-shrink-0"
                    title="Cerrar sesión"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <div className="flex-1 overflow-auto pb-20 md:pb-6">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav user={user} />
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
