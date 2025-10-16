import React, { useState } from 'react';
import styles from "../styles/navbar.module.scss";
import RegisterModal from "../../../components/Profile/RegisterModal";
import LoginModal from "../../../components/Profile/LoginModal";

const Navbar = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          {/* === ЛОГО === */}
          <div className={styles.logo}>
            <div className={styles.houseIcon}>
              <span>🏠</span>
            </div>
            <span className={styles.logoText}>СтройКонтроль</span>
          </div>

          {/* === ПРАВАЯ ЧАСТЬ === */}
          <div className={styles.navRight}>
            <a href="https://mos.ru" className={styles.mosLink}>Mos.ru</a>
            
            {/* Ссылка на личный кабинет */}
            <a href="/profile" className={styles.profileLink}>
              Личный кабинет
            </a>
            
            <div className={styles.divider}></div>

            <button
              className={styles.registerLink}
              onClick={() => setIsRegisterOpen(true)}
            >
              Register
            </button>

            <button
              className={styles.loginBtn}
              onClick={() => setIsLoginOpen(true)}
            >
              Log In
            </button>
          </div>
        </div>
      </nav>

      {/* === МОДАЛКИ === */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
    </>
  );
};

export default Navbar;