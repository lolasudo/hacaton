// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  
  const login = async (email, password) => {
    try {
      // TODO: Заменить на реальный API вызов
      console.log('Login attempt:', { email, password });
      
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
     
      const userData = {
        id: 1,
        email: email,
        firstName: 'Александра',
        lastName: 'Роулес',
        role: 'Инженер',
        organization: 'СтройГрупп'
      };
      
      const token = 'fake-jwt-token'; 
      
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Ошибка при входе' 
      };
    }
  };

  
  const register = async (email, password) => {
    try {
      // TODO: Заменить на реальный API вызов
      console.log('Register attempt:', { email, password });
      
     
      await new Promise(resolve => setTimeout(resolve, 1000));
      
     
      return { 
        success: true, 
        message: 'Регистрация успешна! Теперь вы можете войти.' 
      };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.message || 'Ошибка при регистрации' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};