import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authApi, User } from '@/lib/api';
import DashboardEstudiante from './DashboardEstudiante';
import DashboardEmpresa from './DashboardEmpresa';
import DashboardAdmin from './DashboardAdmin';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    if (!currentUser) {
      navigate('/auth');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  // Render dashboard según el rol
  if (user.role === 'admin') {
    return <DashboardAdmin user={user} />;
  }
  
  if (user.role === 'empresa' || user.role === 'coordinator') {
    return <DashboardEmpresa user={user} />;
  }
  
  return <DashboardEstudiante user={user} />;
};

export default Dashboard;
