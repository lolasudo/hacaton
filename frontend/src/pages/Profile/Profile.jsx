import React, { useState } from 'react';
import ProfileSidebar from './ProfileSidebar';
import styles from './styles/profile.module.scss';

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: 'Александра',
    lastName: 'Роулес',
    middleName: '',
    phone: '+7 (999) 123-45-67',
    role: 'Инженер',
    organization: 'СтройГрупп'
  });

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={styles.profilePage}>
      <ProfileSidebar />
      
      <div className={styles.mainContent}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeText}>
            <h1>Добро пожаловать, Александра</h1>
            <p>Вт, 7 июня 2022</p>
          </div>
          
          <div className={styles.actions}>
            <div className={styles.searchBox}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#ADA7A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#ADA7A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input type="text" placeholder="Поиск" className={styles.searchInput} />
            </div>
            
            <button className={styles.notificationButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#ADA7A7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                <div className={styles.avatarPlaceholder}>АР</div>
              </div>
              <div className={styles.userInfo}>
                <h2>Александра Роулес</h2>
                <p>alexarawles@gmail.com</p>
              </div>
            </div>
            <button className={styles.editButton}>
              Редактировать
            </button>
          </div>

          {/* Profile Form */}
          <div className={styles.profileForm}>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Имя</label>
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={styles.formInput}
                  placeholder="Ваше имя"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Фамилия</label>
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={styles.formInput}
                  placeholder="Ваша фамилия"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Отчество</label>
                <input
                  type="text"
                  value={userData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className={styles.formInput}
                  placeholder="Ваше отчество"
                />
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Телефон</label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={styles.formInput}
                  placeholder="Ваш телефон"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Роль</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={userData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="Инженер">Инженер</option>
                    <option value="Прораб">Прораб</option>
                    <option value="Архитектор">Архитектор</option>
                  </select>
                  <div className={styles.selectArrow}>▼</div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Организация</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={userData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="СтройГрупп">СтройГрупп</option>
                    <option value="СтройМонтаж">СтройМонтаж</option>
                  </select>
                  <div className={styles.selectArrow}>▼</div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className={styles.emailSection}>
            <h3 className={styles.emailTitle}>Мои email адреса</h3>
            <div className={styles.emailItem}>
              <div className={styles.emailIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#486284"/>
                </svg>
              </div>
              <div className={styles.emailInfo}>
                <p>alexarawles@gmail.com</p>
                <span>1 месяц назад</span>
              </div>
            </div>
            <button className={styles.addEmailButton}>
              + Добавить Email адрес
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;