import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { usuarios } from '../data/mockUsuarios';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'puntosLevelUp'>) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const foundUser = usuarios.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (userData: Omit<User, 'id' | 'puntosLevelUp'>): boolean => {

    const emailExists = usuarios.some((u) => u.email === userData.email);
    const runExists = usuarios.some((u) => u.run === userData.run);
    
    if (emailExists || runExists) {
      return false;
    }
    
    const newUser: User = {
      ...userData,
      id: String(usuarios.length + 1),
      puntosLevelUp: 0,
    };
    
    usuarios.push(newUser);
    setUser(newUser);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
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
