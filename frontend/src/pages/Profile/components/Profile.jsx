import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/Context/AuthContext';
import { useLocation } from 'react-router-dom'; // ДОБАВИТЬ
import ProfileSidebar from '../components/ProfileSidebar';
import ContractorReports from '../../CONTRACTOR/contractorReports/contractorReports';
import { SearchIcon, NotificationIcon } from '../../../assets/icons/index';
import styles from '../styles/profile.module.scss';
import Navbar from '../components/NavBarProfile';
import Select from 'react-select';
import '../styles/select-styles.scss';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation(); // ДОБАВИТЬ
  const [activeSection, setActiveSection] = useState('profile');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    role: '',
    organization: ''
  });

  
  useEffect(() => {
    if (location.pathname === '/profile') {
      setActiveSection('profile');
    } else if (location.pathname === '/profile/reports') {
      setActiveSection('reports');
    }
    
  }, [location.pathname]);

  const roleOptions = [
    { value: 'Инженер', label: 'Инженер' },
    { value: 'Прораб', label: 'Прораб' },
    { value: 'Архитектор', label: 'Архитектор' },
    { value: 'Инспектор', label: 'Инспектор' }
  ];

  const organizationOptions = [
    { value: 'СтройГрупп', label: 'СтройГрупп' },
    { value: 'СтройМонтаж', label: 'СтройМонтаж' },
    { value: 'ГлавСтрой', label: 'ГлавСтрой' }
  ];

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || 'Александра',
        lastName: user.lastName || 'Роулес',
        middleName: user.middleName || '',
        phone: user.phone || '+7 (999) 123-45-67',
        role: user.role || 'Инженер',
        organization: user.organization || 'СтройГрупп'
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    updateUser(userData);
    console.log('Профиль сохранен:', userData);
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const renderProfileContent = () => (
    <div className={styles.profileCard}>
      <div className={styles.profileHeader}></div>
      
      <div className={styles.profileUserSection}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <div className={styles.avatarPlaceholder}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>
          <div className={styles.userInfo}>
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <button className={styles.editButton} onClick={handleSaveProfile}>
          Edit
        </button>
      </div>

      <div className={styles.profileForm}>
        <div className={styles.formColumn}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Имя</label>
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={styles.formInput}
              placeholder="Your First Name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Фамилия</label>
            <input
              type="text"
              value={userData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={styles.formInput}
              placeholder="Your Last Name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Отчество</label>
            <input
              type="text"
              value={userData.middleName}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
              className={styles.formInput}
              placeholder="Your Middle Name"
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
              placeholder="+7 (XXX) XXX-XX-XX"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Роль</label>
            <Select
              options={roleOptions}
              value={roleOptions.find(opt => opt.value === userData.role)}
              onChange={(selected) => handleInputChange('role', selected.value)}
              placeholder="Выберите роль"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Организация</label>
            <Select
              options={organizationOptions}
              value={organizationOptions.find(opt => opt.value === userData.organization)}
              onChange={(selected) => handleInputChange('organization', selected.value)}
              placeholder="Выберите организацию"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      <div className={styles.emailSection}>
        <h3 className={styles.emailTitle}>My email Address</h3>
        <div className={styles.emailItem}>
          <div className={styles.emailIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#486284"/>
            </svg>
          </div>
          <div className={styles.emailInfo}>
            <p>{user.email}</p>
            <span>1 month ago</span>
          </div>
        </div>
        <button className={styles.addEmailButton}>
          + Add Email Address
        </button>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.loading}>Загрузка профиля...</div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <Navbar />
      
      <div className={styles.profileContainer}>
        <ProfileSidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange} 
        />
        
        <div className={styles.mainContent}>
          
          {activeSection === 'profile' && (
            <div className={styles.welcomeSection}>
              <div className={styles.welcomeText}>
                <h1>Добро пожаловать, {user.firstName}</h1>
                <p>{new Date().toLocaleDateString('ru-RU', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              
              <div className={styles.actions}>
                <div className={styles.searchBox}>
                  <img src={SearchIcon} alt="Поиск" />
                  <input type="text" placeholder="Search" className={styles.searchInput} />
                </div>
                
                <div className={styles.notificationButton}>
                  <img src={NotificationIcon} alt="Уведомления" />
                </div>
              </div>
            </div>
          )}

          {/* активная секция для всех блоков */}
          {activeSection === 'profile' ? renderProfileContent() : <ContractorReports />}
        </div>
      </div>
    </div>
  );
};

export default Profile;