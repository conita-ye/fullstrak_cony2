import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface User {
  id: number;
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  region: string;
  comuna: string;
  direccion: string;
  codigoReferido?: string;
  rol: string;
  fechaNacimiento: string;
  puntosLevelUp: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rol?: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          try {
            const updatedUser = await apiService.getUsuario(userData.id);
            setUser(updatedUser);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
          } catch (error) {
            console.error('Error al actualizar usuario:', error);
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, rol?: string): Promise<boolean> => {
    try {
      const response = await apiService.login(email, password, rol);
      
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      
      const userData = await apiService.getUsuario(response.usuarioId);
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al iniciar sesión';
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await apiService.register(userData);
      
      const loginResponse = await apiService.login(userData.correo, userData.contrasena);
      
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, loginResponse.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, loginResponse.refreshToken);
      
      const newUser = await apiService.getUsuario(loginResponse.usuarioId);
      setUser(newUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                          (error.response?.data && typeof error.response.data === 'object' 
                            ? JSON.stringify(error.response.data) 
                            : error.message) || 
                          'Error al registrar usuario';
      toast.error(errorMessage);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
