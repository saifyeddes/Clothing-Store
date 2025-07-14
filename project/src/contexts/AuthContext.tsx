import React, { createContext, useContext, useState } from 'react';
import { mockUser } from '../lib/mockData';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - accept any email/password
    if (email && password) {
      setUser({ ...mockUser, email });
    } else {
      throw new Error('Email et mot de passe requis');
    }
    setLoading(false);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration
    if (email && password && fullName) {
      setUser({
        ...mockUser,
        email,
        full_name: fullName
      });
    } else {
      throw new Error('Tous les champs sont requis');
    }
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};