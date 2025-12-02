import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { registerUser, loginUser, checkUserExists } from '@/lib/db';
import CoinRain from '@/components/CoinRain';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email({ message: "Email inválido" }).trim(),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).trim(),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }).trim().optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'empresa' | 'estudiante'>('estudiante');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = isLogin 
        ? { email, password }
        : { email, password, name };

      const validated = authSchema.parse(data);

      if (isLogin) {
        const user = await loginUser(validated.email, validated.password);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          toast.success('¡Bienvenido de vuelta!');
          navigate('/dashboard');
        } else {
          toast.error('Email o contraseña incorrectos');
        }
      } else {
        const exists = await checkUserExists(validated.email);
        if (exists) {
          toast.error('Este email ya está registrado');
        } else {
          await registerUser({
            email: validated.email,
            password: validated.password,
            name: validated.name || '',
            role: role,
            lukaPoints: 897,
          });
          toast.success('¡Cuenta creada exitosamente!');
          setIsLogin(true);
          setPassword('');
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Ocurrió un error. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = (userType: 'admin' | 'empresa' | 'estudiante1' | 'estudiante2') => {
    const credentials = {
      admin: { email: 'admin@luka.com', password: 'admin123' },
      empresa: { email: 'empresa@luka.com', password: 'empresa123' },
      estudiante1: { email: 'estudiante1@luka.com', password: 'estudiante123' },
      estudiante2: { email: 'estudiante2@luka.com', password: 'estudiante123' },
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
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </CardTitle>
          <CardDescription className="text-center text-foreground/70">
            {isLogin
              ? 'Ingresa tus credenciales para continuar'
              : 'Completa el formulario para registrarte'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-foreground">
                    Tipo de Usuario
                  </Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'empresa' | 'estudiante')}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="empresa">Empresa</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </>
            )}

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
              {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>

            {isLogin && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3 text-center">Usuarios de prueba:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => fillTestCredentials('estudiante1')}
                  >
                    👨‍🎓 Estudiante 1
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => fillTestCredentials('estudiante2')}
                  >
                    👩‍🎓 Estudiante 2
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => fillTestCredentials('empresa')}
                  >
                    🏢 Empresa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => fillTestCredentials('admin')}
                  >
                    👑 Admin
                  </Button>
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPassword('');
                }}
                className="text-sm text-primary hover:text-primary-glow transition-colors"
              >
                {isLogin
                  ? '¿No tienes cuenta? Regístrate'
                  : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
