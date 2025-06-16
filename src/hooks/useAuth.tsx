
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const auth = localStorage.getItem('isAuthenticated');
    const loginTime = localStorage.getItem('loginTime');
    
    if (auth === 'true' && loginTime) {
      const currentTime = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24h em millisegundos
      
      if (currentTime - parseInt(loginTime) < twentyFourHours) {
        setIsAuthenticated(true);
      } else {
        // Expirou, fazer logout automático
        logout();
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Escuta mudanças no localStorage
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('loginTime');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, checkAuth }}>
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
