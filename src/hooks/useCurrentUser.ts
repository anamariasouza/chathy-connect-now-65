
import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
}

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const authStatus = localStorage.getItem('isAuthenticated');
    
    if (savedUser && authStatus === 'true') {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        logout();
      }
    }
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loginTime', new Date().getTime().toString());
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
  };

  return {
    currentUser,
    isAuthenticated,
    login,
    logout
  };
};
