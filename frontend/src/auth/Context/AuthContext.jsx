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

  // При загрузке приложения проверяем, есть ли сохраненная сессия
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  // Функция входа
  const login = async (email, password) => {
    try {
      // TODO: Заменить на реальный API вызов
      console.log('Login attempt:', { email, password });
      
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Здесь будет реальный запрос:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // Временные данные пользователя
      const userData = {
        id: 1,
        email: email,
        firstName: 'Александра',
        lastName: 'Роулес',
        role: 'Инженер',
        organization: 'СтройГрупп'
      };
      
      const token = 'fake-jwt-token'; // В реальности придет с бэкенда
      
      // Сохраняем в localStorage (в реальности только token)
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

  // Функция регистрации
  const register = async (email, password) => {
    try {
      // TODO: Заменить на реальный API вызов
      console.log('Register attempt:', { email, password });
      
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Здесь будет реальный запрос:
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // В реальности здесь будет ответ от сервера
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

  // Функция выхода
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Обновление данных пользователя
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