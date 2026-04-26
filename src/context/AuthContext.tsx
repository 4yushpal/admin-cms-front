import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('uhs_admin_token');
    const savedAdmin = localStorage.getItem('uhs_admin_user');

    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newAdmin: Admin) => {
    setToken(newToken);
    setAdmin(newAdmin);
    localStorage.setItem('uhs_admin_token', newToken);
    localStorage.setItem('uhs_admin_user', JSON.stringify(newAdmin));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('uhs_admin_token');
    localStorage.removeItem('uhs_admin_user');
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!token }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
