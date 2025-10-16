import React, { useState } from 'react';
import styles from './styles/register-modal.module.scss';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    console.log('Регистрация:', { email, password });
    // тут можно вызвать API / открыть success и т.д.
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Регистрация</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Пароль</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.label}>Подтвердите пароль</label>
            <input
              className={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            ЗАРЕГИСТРИРОВАТЬСЯ
          </button>

          <button
            type="button"
            className={styles.switchBtn}
            onClick={onSwitchToLogin}
            aria-label="Перейти к входу"
          >
            Уже есть аккаунт? <span className={styles.switchHighlight}>Войти</span>
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

export default RegisterModal;
