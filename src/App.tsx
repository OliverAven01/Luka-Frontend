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
import { authApi, User } from "./lib/api";

// Admin Pages
import AdminEmpresas from "./pages/admin/Empresas";
import AdminUsuarios from "./pages/admin/Usuarios";
import AdminMetricas from "./pages/admin/Metricas";
import AdminPerfil from "./pages/admin/Perfil";
import AdminConfiguracion from "./pages/admin/Configuracion";
import AdminProveedores from "./pages/admin/Proveedores";
import AdminProductos from "./pages/admin/ProductosAdmin";
import AdminCupones from "./pages/admin/CuponesAdmin";
import AdminReportes from "./pages/admin/Reportes";

// Empresa Pages
import EmpresaCampanas from "./pages/empresa/Campanas";
import EmpresaCrear from "./pages/empresa/Crear";
import EmpresaRendimiento from "./pages/empresa/Rendimiento";
import EmpresaPerfil from "./pages/empresa/Perfil";
import EmpresaTransacciones from "./pages/empresa/Transacciones";
import EmpresaCupones from "./pages/empresa/Cupones";

// Estudiante Pages
import EstudianteCampanas from "./pages/estudiante/Campanas";
import EstudianteHistorial from "./pages/estudiante/Historial";
import EstudianteRanking from "./pages/estudiante/Ranking";
import EstudiantePerfil from "./pages/estudiante/Perfil";
import TransactionHistory from "./pages/estudiante/TransactionHistory";
import EstudianteProductos from "./pages/estudiante/Productos";
import EstudianteMisiones from "./pages/estudiante/Misiones";
import EstudianteCupones from "./pages/estudiante/Cupones";
import EstudianteMisCampanas from "./pages/estudiante/MisCampanas";

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
    const currentUser = authApi.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  
  // Map roles for compatibility
  const userRole = user.role === 'student' ? 'estudiante' : 
                   user.role === 'coordinator' ? 'empresa' : user.role;
  
  if (!allowedRoles.includes(userRole)) return <Navigate to="/dashboard" replace />;

  return <>{children(user)}</>;
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
            <Route path="/dashboard/admin/configuracion" element={
              <ProtectedRoute allowedRoles={['admin']}>
                {(user) => <AdminConfiguracion user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/proveedores" element={
              <ProtectedRoute allowedRoles={['admin']}>
                {(user) => <AdminProveedores user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/productos" element={
              <ProtectedRoute allowedRoles={['admin']}>
                {(user) => <AdminProductos user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/cupones" element={
              <ProtectedRoute allowedRoles={['admin']}>
                {(user) => <AdminCupones user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/reportes" element={
              <ProtectedRoute allowedRoles={['admin']}>
                {(user) => <AdminReportes user={user} />}
              </ProtectedRoute>
            } />

            {/* Empresa Routes */}
            <Route path="/dashboard/empresa/campanas" element={
              <ProtectedRoute allowedRoles={['empresa', 'coordinator']}>
                {(user) => <EmpresaCampanas user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/empresa/crear" element={
              <ProtectedRoute allowedRoles={['empresa', 'coordinator']}>
                {(user) => <EmpresaCrear user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/empresa/rendimiento" element={
              <ProtectedRoute allowedRoles={['empresa', 'coordinator']}>
                {(user) => <EmpresaRendimiento user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/empresa/perfil" element={
              <ProtectedRoute allowedRoles={['empresa', 'coordinator']}>
                {(user) => <EmpresaPerfil user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/empresa/transacciones" element={
              <ProtectedRoute allowedRoles={['empresa', 'coordinator']}>
                {(user) => <EmpresaTransacciones user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/empresa/cupones" element={
              <ProtectedRoute allowedRoles={['empresa', 'coordinator']}>
                {(user) => <EmpresaCupones user={user} />}
              </ProtectedRoute>
            } />

            {/* Estudiante Routes */}
            <Route path="/dashboard/estudiante/campanas" element={
              <ProtectedRoute allowedRoles={['estudiante', 'student']}>
                {(user) => <EstudianteCampanas user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/historial" element={
              <ProtectedRoute allowedRoles={['estudiante', 'student']}>
                {(user) => <EstudianteHistorial user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/transacciones" element={
              <ProtectedRoute allowedRoles={['estudiante', 'student']}>
                {(user) => <TransactionHistory user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/ranking" element={
              <ProtectedRoute allowedRoles={['estudiante', 'student']}>
                {(user) => <EstudianteRanking user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/perfil" element={
              <ProtectedRoute allowedRoles={['estudiante', 'student']}>
                {(user) => <EstudiantePerfil user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/productos" element={
              <ProtectedRoute allowedRoles={['estudiante', 'student']}>
                {(user) => <EstudianteProductos user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/misiones" element={
              <ProtectedRoute allowedRoles={['estudiante', 'student']}>
                {(user) => <EstudianteMisiones user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/cupones" element={
              <ProtectedRoute allowedRoles={['estudiante', 'student']}>
                {(user) => <EstudianteCupones user={user} />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard/estudiante/mis-campanas" element={
              <ProtectedRoute allowedRoles={['estudiante', 'student']}>
                {(user) => <EstudianteMisCampanas user={user} />}
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
