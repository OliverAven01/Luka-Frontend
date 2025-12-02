import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { authApi, ApiError } from '@/lib/api';
import CoinRain from '@/components/CoinRain';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }).trim(),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).trim(),
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = loginSchema.parse({ email, password });
      
      const user = await authApi.login({
        email: validated.email,
        password: validated.password,
      });

      toast.success(`¡Bienvenido, ${user.firstName}!`);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof ApiError) {
        toast.error(error.message || 'Email o contraseña incorrectos');
      } else {
        toast.error('Error de conexión. Verifica que el servidor esté activo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = (userType: 'estudiante' | 'empresa' | 'admin') => {
    const credentials = {
      estudiante: { email: 'juan@test.com', password: 'Test123!' },
      empresa: { email: 'empresa@test.com', password: 'Test123!' },
      admin: { email: 'admin@test.com', password: 'Test123!' },
    };
    setEmail(credentials[userType].email);
    setPassword(credentials[userType].password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      <CoinRain />
      
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-primary/30 shadow-glow relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center text-foreground/70">
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300 shadow-glow hover:shadow-strong font-semibold"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3 text-center">Usuarios de prueba:</p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => fillTestCredentials('estudiante')}
                >
                  👨‍🎓 Estudiante (juan@test.com)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => fillTestCredentials('empresa')}
                >
                  🏢 Empresa (empresa@test.com)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => fillTestCredentials('admin')}
                >
                  👑 Admin (admin@test.com)
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
