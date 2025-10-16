import React from 'react';
import styles from './styles/profile-sidebar.module.scss';

const ProfileSidebar = () => {
  const menuItems = [
    { icon: '📊', label: 'Проекты', active: false },
    { icon: '⚠️', label: 'Замечания', active: false },
    { icon: '📈', label: 'Отчеты', active: false },
    { icon: '⚙️', label: 'Настройки', active: true },
    { icon: '📔', label: 'Журнал', active: false }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`${styles.menuItem} ${item.active ? styles.active : ''}`}
            title={item.label}
          >
            <span className={styles.menuIcon}>{item.icon}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default ProfileSidebar;