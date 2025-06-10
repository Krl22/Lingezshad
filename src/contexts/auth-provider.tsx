import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '@/firebase/firebaseconfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setPersistenceMode: (mode: 'local' | 'session') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configurar persistencia por defecto al inicializar
  useEffect(() => {
    const initializePersistence = async () => {
      try {
        // LOCAL: Mantiene la sesión hasta que el usuario cierre sesión manualmente
        // Puede durar días/semanas/meses - PERFECTO PARA TU CASO
        await setPersistence(auth, browserLocalPersistence);
        
        // Otra opción disponible:
        // SESSION: Solo durante la sesión del navegador
        // await setPersistence(auth, browserSessionPersistence);
      } catch (error) {
        console.error('Error setting persistence:', error);
      }
    };

    initializePersistence();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setPersistenceMode = async (mode: 'local' | 'session') => {
    try {
      switch (mode) {
        case 'local':
          await setPersistence(auth, browserLocalPersistence);
          break;
        case 'session':
          await setPersistence(auth, browserSessionPersistence);
          break;
      }
    } catch (error) {
      console.error('Error setting persistence mode:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    setPersistenceMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


