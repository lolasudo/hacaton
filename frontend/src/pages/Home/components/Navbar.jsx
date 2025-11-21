import React, { useState } from 'react';
import styles from '../styles/navbar.module.scss';
import HomeIcon from '../../../assets/icons/gridicons_house.svg';
import RegisterModal from '../../../auth/AuthModals/RegisterModal';
import LoginModal from '../../../auth/AuthModals/LoginModal';// или правильный путь

const Navbar = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
   
          <div className={styles.logo}>
            <div className={styles.houseIcon}>
              <img src={HomeIcon} alt="Дом" />
            </div>
            <span className={styles.logoText}>СтройКонтроль</span>
          </div>

     
          <div className={styles.navRight}>
            <a href="https://mos.ru" className={styles.mosLink}>Mos.ru</a>
            <div className={styles.divider}></div>

            <a
              href="#"
              className={styles.registerLink}
              onClick={(e) => {
                e.preventDefault();
                setIsRegisterOpen(true);
              }}
            >
              Register
            </a>

            <button
              className={styles.loginBtn}
              onClick={() => setIsLoginOpen(true)}
            >
              Log In
            </button>
          </div>
        </div>
      </nav>

      
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
