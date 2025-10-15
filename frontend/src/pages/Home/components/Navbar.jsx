import React from 'react';
import styles from '../styles/navbar.module.scss';
import HomeIcon from '../../../assets/icons/gridicons_house.svg';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.logo}>
          <div className={styles.houseIcon}>
            <img src={HomeIcon} alt="Иконка дома" />
          </div>
          <span className={styles.logoText}>СтройКонтроль</span>
        </div>

        <div className={styles.navRight}>
          <a href="https://mos.ru" className={styles.mosLink}>Mos.ru</a>
          <div className={styles.divider}></div>
          <a href="#" className={styles.registerLink}>Register</a>
          <button className={styles.loginBtn}>Log In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
