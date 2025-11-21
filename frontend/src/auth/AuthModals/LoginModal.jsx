// components/LoginModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import styles from './styles/register-modal.module.scss';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/profile'); // Перенаправляем в профиль
        onClose(); // Закрываем модальное окно
      } else {
        setError(result.error || 'Ошибка авторизации');
      }
    } catch (error) {
      setError('Произошла ошибка при авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Вход</h2>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'ВХОД...' : 'ВОЙТИ'}
          </button>

          <button
            type="button"
            className={styles.switchBtn}
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            Нет аккаунта? Зарегистрироваться
          </button>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isLoading}
          >
            ЗАКРЫТЬ
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;