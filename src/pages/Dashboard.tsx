import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardEstudiante from './DashboardEstudiante';
import DashboardEmpresa from './DashboardEmpresa';
import DashboardAdmin from './DashboardAdmin';

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

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getUserFromStorage();
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
  
  if (user.role === 'empresa') {
    return <DashboardEmpresa user={user} />;
  }
  
  return <DashboardEstudiante user={user} />;
};

export default Dashboard;
