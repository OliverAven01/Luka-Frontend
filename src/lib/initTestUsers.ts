import { registerUser, checkUserExists } from './db';
import { getProfileByEmail, createProfile } from './supabase-db';

export const TEST_USERS = {
  admin: {
    email: 'admin@luka.com',
    password: 'admin123',
    name: 'Administrador Luka',
    role: 'admin' as const,
  },
  empresa: {
    email: 'empresa@luka.com',
    password: 'empresa123',
    name: 'Empresa Demo',
    role: 'empresa' as const,
  },
  estudiante1: {
    email: 'estudiante1@luka.com',
    password: 'estudiante123',
    name: 'Estudiante 1',
    role: 'estudiante' as const,
  },
  estudiante2: {
    email: 'estudiante2@luka.com',
    password: 'estudiante123',
    name: 'Estudiante 2',
    role: 'estudiante' as const,
  },
};

export const initializeTestUsers = async () => {
  try {
    const usersData = [
      { ...TEST_USERS.admin, lukaPoints: 1500 },
      { ...TEST_USERS.empresa, lukaPoints: 1200 },
      { ...TEST_USERS.estudiante1, lukaPoints: 897 },
      { ...TEST_USERS.estudiante2, lukaPoints: 1250 },
    ];

    // Initialize in IndexedDB
    for (const userData of usersData) {
      const exists = await checkUserExists(userData.email);
      if (!exists) {
        await registerUser(userData);
        console.log(`✅ Usuario ${userData.name} creado en IndexedDB`);
      }
    }

    // Initialize in Supabase
    for (const userData of usersData) {
      const profile = await getProfileByEmail(userData.email);
      if (!profile) {
        await createProfile({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          luka_points: userData.lukaPoints,
        });
        console.log(`✅ Usuario ${userData.name} creado en Supabase`);
      }
    }
  } catch (error) {
    console.error('Error inicializando usuarios de prueba:', error);
  }
};
