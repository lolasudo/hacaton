import React from 'react';
import { useAuth } from '../../auth/Context/AuthContext';
import styles from './styles/NavBarProfile.module.scss';
import HomeIcon from '../../assets/icons/gridicons_house.svg';
import { ProfileIcon } from '../../assets/icons/index';

const Navbar = () => {
  const { user } = useAuth();

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.location.href = '/'; // Переход на главную страницу
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (user) {
      window.location.href = '/profile'; // Переход на страницу профиля
    }
  };

  const handleNavItemClick = (label, e) => {
    e.preventDefault();
    // Заглушка - показываем сообщение вместо перехода
    alert(`Раздел "${label}" находится в разработке`);
  };

  const navItems = [
    { label: 'Отчеты', path: '#' },
    { label: 'Замечания', path: '#' },
    { label: 'Журнал', path: '#' },
    { label: 'Контроль', path: '#' }
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        {/* === ЛОГО (такое же как на главной) === */}
        <div className={styles.logo} onClick={handleLogoClick} style={{cursor: 'pointer'}}>
          <div className={styles.houseIcon}>
            <img src={HomeIcon} alt="Дом" />
          </div>
          <span className={styles.logoText}>СтройКонтроль</span>
        </div>

        {/* === ПРАВАЯ ЧАСТЬ (текстовые ссылки и иконка профиля) === */}
        <div className={styles.navRight}>
          <div className={styles.navItems}>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.path}
                className={styles.navLink}
                onClick={(e) => handleNavItemClick(item.label, e)}
              >
                {item.label}
              </a>
            ))}
          </div>
          
          <div 
            className={styles.profileIcon} 
            onClick={handleProfileClick}
            style={{cursor: 'pointer'}}
          >
            <img src={ProfileIcon} alt="Профиль" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;