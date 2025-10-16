import React, { useState } from 'react';
import styles from './styles/register-modal.module.scss';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    setShowAnimation(true);

    setTimeout(() => {
      setShowAnimation(false);
      setIsSubmitted(true);
    }, 2000); // Длительность анимации полигонов
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {!isSubmitted && !showAnimation && (
          <>
            <h2 className={styles.title}>Регистрация</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Пароль</label>
                <input
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputWrapper}>
                <label className={styles.label}>Подтвердите пароль</label>
                <input
                  type="password"
                  className={styles.input}
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
              >
                Уже есть аккаунт? <span className={styles.switchHighlight}>Войти</span>
              </button>
              <button type="button" className={styles.closeBtn} onClick={onClose}>
                ЗАКРЫТЬ
              </button>
            </form>
          </>
        )}

        {showAnimation && (
          <div className={styles.animationWrapper}>
            <div className={styles.poly1}><svg width="208" height="218" viewBox="0 0 208 218" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M85.9554 5.4142C97.0236 -0.669655 110.435 -0.669659 121.503 5.4142L187.925 41.9244C199.72 48.4079 207.049 60.7998 207.049 74.2595V144.197C207.049 157.657 199.72 170.049 187.925 176.532L121.503 213.043C110.435 219.126 97.0236 219.126 85.9554 213.043L19.5335 176.532C7.73822 170.049 0.409126 157.657 0.409126 144.197V74.2595C0.409126 60.7998 7.73821 48.4079 19.5335 41.9244L85.9554 5.4142Z" fill="#486284" fill-opacity="0.23"/>
</svg>
</div>
            <div className={styles.poly2}><svg width="309" height="324" viewBox="0 0 309 324" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M127.754 6.98066C144.25 -2.08673 164.238 -2.08674 180.734 6.98065L279.729 61.3955C297.309 71.0585 308.232 89.5274 308.232 109.588V213.823C308.232 233.884 297.309 252.353 279.729 262.016L180.734 316.43C164.238 325.498 144.25 325.498 127.754 316.43L28.7586 262.016C11.1789 252.353 0.255585 233.884 0.255585 213.823V109.588C0.255585 89.5274 11.1789 71.0585 28.7585 61.3955L127.754 6.98066Z" fill="#486284" fill-opacity="0.57"/>
</svg>
</div>
            <div className={styles.poly3}><svg width="397" height="417" viewBox="0 0 397 417" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M164.321 9.49929C185.562 -2.17582 211.298 -2.17584 232.538 9.49927L360.004 79.5634C382.639 92.0055 396.704 115.786 396.704 141.616V275.828C396.704 301.658 382.639 325.438 360.004 337.881L232.538 407.945C211.298 419.62 185.562 419.62 164.321 407.945L36.8557 337.881C14.2202 325.438 0.155487 301.658 0.155487 275.828V141.616C0.155487 115.786 14.2202 92.0055 36.8557 79.5634L164.321 9.49929Z" fill="#486284" fill-opacity="0.6"/>
</svg>
</div>
            <div className={styles.poly4}><svg width="492" height="517" viewBox="0 0 492 517" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M203.736 11.4427C230.076 -3.03564 261.992 -3.03564 288.332 11.4427L446.403 98.3297C474.473 113.759 491.915 143.249 491.915 175.281V341.719C491.915 373.75 474.473 403.241 446.403 418.67L288.332 505.557C261.992 520.036 230.076 520.036 203.736 505.557L45.6651 418.67C17.5947 403.241 0.152954 373.75 0.152954 341.719V175.281C0.152954 143.249 17.5947 113.759 45.6651 98.3297L203.736 11.4427Z" fill="#486284" fill-opacity="0.33"/>
</svg>
</div>
            <div className={styles.circle}><svg width="91" height="92" viewBox="0 0 91 92" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.831848" y="0.79248" width="89.3894" height="90.4336" rx="44.6947" fill="#486284"/>
<path d="M70.5506 30.4404L41.6225 59.3686C41.0364 59.9544 40.2417 60.2835 39.4131 60.2835C38.5845 60.2835 37.7897 59.9544 37.2037 59.3686L22.1131 44.2779" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
          </div>
        )}

        {isSubmitted && (
          <div className={styles.successWrapper}>
            <div className={styles.circle}></div>
            <h3 className={styles.successTitle}>Заявка отправлена</h3>
            <p className={styles.successText}>Мы свяжемся с вами, если возникнут вопросы</p>
            <button className={styles.submitBtn} onClick={onClose}>ОК</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
