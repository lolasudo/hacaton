import React, { useState } from 'react';
import styles from './styles/register-modal.module.scss';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Вход:', { email, password });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Вход</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
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
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            ВОЙТИ
          </button>

          <button
            type="button"
            className={styles.switchBtn}
            onClick={onSwitchToRegister}
          >
            Нет аккаунта? Зарегистрироваться
          </button>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
          >
            ЗАКРЫТЬ
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
