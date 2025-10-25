import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/Context/AuthContext';
import styles from './styles/NavBarProfile.module.scss';
import HomeIcon from '../../assets/icons/gridicons_house.svg';
import { ProfileIcon } from '../../assets/icons/index';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* === ЛОГО === */}
        <Link to="/" className={styles.logo} style={{ cursor: 'pointer' }}>
          <div className={styles.houseIcon}>
            <img src={HomeIcon} alt="Дом" />
          </div>
          <span className={styles.logoText}>СтройКонтроль</span>
        </Link>

        {/* === ПРАВАЯ ЧАСТЬ === */}
        <div className={styles.navRight}>
          <div className={styles.navItems}>
            <Link to="/reports" className={styles.navLink}>Отчеты</Link>
            <Link to="/remarks" className={styles.navLink}>Замечания</Link>
            <Link to="/journal" className={styles.navLink}>Журнал</Link>
           <Link to="/control" className={styles.navLink}>Контроль</Link>

          </div>

          {user && (
            <Link to="/profile" className={styles.profileIcon} style={{ cursor: 'pointer' }}>
              <img src={ProfileIcon} alt="Профиль" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
