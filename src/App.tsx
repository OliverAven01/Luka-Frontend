import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { initializeTestUsers } from "./lib/initTestUsers";

// Admin Pages
import AdminEmpresas from "./pages/admin/Empresas";
import AdminUsuarios from "./pages/admin/Usuarios";
import AdminMetricas from "./pages/admin/Metricas";
import AdminPerfil from "./pages/admin/Perfil";

// Empresa Pages
import EmpresaCampanas from "./pages/empresa/Campanas";
import EmpresaCrear from "./pages/empresa/Crear";
import EmpresaRendimiento from "./pages/empresa/Rendimiento";
import EmpresaPerfil from "./pages/empresa/Perfil";

// Estudiante Pages
import EstudianteCampanas from "./pages/estudiante/Campanas";
import EstudianteHistorial from "./pages/estudiante/Historial";
import EstudianteRanking from "./pages/estudiante/Ranking";
import EstudiantePerfil from "./pages/estudiante/Perfil";
import TransactionHistory from "./pages/estudiante/TransactionHistory";

interface User {
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'estudiante';
  lukaPoints?: number;
}

const getUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: (user: User) => React.ReactNode; 
  allowedRoles: string[];
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <>{children(user)}</>;
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeTestUsers();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route path="/dashboard/admin/empresas" element={
              <ProtectedRoute allowedRoles={['admin']}>
                {(user) => <AdminEmpresas user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/usuarios" element={
              <ProtectedRoute allowedRoles={['admin']}>
                {(user) => <AdminUsuarios user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/metricas" element={
              <ProtectedRoute allowedRoles={['admin']}>
                {(user) => <AdminMetricas user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/perfil" element={
              <ProtectedRoute allowedRoles={['admin']}>
                {(user) => <AdminPerfil user={user} />}
              </ProtectedRoute>
            } />

            {/* Empresa Routes */}
            <Route path="/dashboard/empresa/campanas" element={
              <ProtectedRoute allowedRoles={['empresa']}>
                {(user) => <EmpresaCampanas user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/empresa/crear" element={
              <ProtectedRoute allowedRoles={['empresa']}>
                {(user) => <EmpresaCrear user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/empresa/rendimiento" element={
              <ProtectedRoute allowedRoles={['empresa']}>
                {(user) => <EmpresaRendimiento user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/empresa/perfil" element={
              <ProtectedRoute allowedRoles={['empresa']}>
                {(user) => <EmpresaPerfil user={user} />}
              </ProtectedRoute>
            } />

            {/* Estudiante Routes */}
            <Route path="/dashboard/estudiante/campanas" element={
              <ProtectedRoute allowedRoles={['estudiante']}>
                {(user) => <EstudianteCampanas user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/historial" element={
              <ProtectedRoute allowedRoles={['estudiante']}>
                {(user) => <EstudianteHistorial user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/transacciones" element={
              <ProtectedRoute allowedRoles={['estudiante']}>
                {(user) => <TransactionHistory user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/ranking" element={
              <ProtectedRoute allowedRoles={['estudiante']}>
                {(user) => <EstudianteRanking user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/perfil" element={
              <ProtectedRoute allowedRoles={['estudiante']}>
                {(user) => <EstudiantePerfil user={user} />}
              </ProtectedRoute>
            } />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
