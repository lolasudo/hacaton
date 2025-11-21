import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAuth } from '../../../auth/Context/AuthContext';
import styles from '../styles/NavBarProfile.module.scss';
import HomeIcon from '../../../assets/icons/gridicons_house.svg';
import { ProfileIcon } from '../../../assets/icons/index';
import '../styles/select-styles.scss';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const journalOptions = [
    { value: '/journal/hidden', label: 'Скрытые работы' },
    { value: '/journal/technique', label: 'Техника и механизмы' },
    { value: '/journal/workers', label: 'Рабочие' }
  ];

  const handleJournalChange = (selectedOption) => {
    if (selectedOption) {
      navigate(selectedOption.value);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: 'none',
      background: 'none',
      boxShadow: 'none',
      minHeight: 'auto',
      cursor: 'pointer',
      minWidth: '140px',
      '&:hover': {
        border: 'none'
      }
    }),
    menu: (base) => ({
      ...base,
      marginTop: '8px',
      minWidth: '220px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(72, 98, 132, 0.1)',
    }),
    option: (base, state) => ({
      ...base,
      padding: '12px 16px',
      backgroundColor: state.isFocused ? 'rgba(72, 98, 132, 0.1)' : 'white',
      color: state.isSelected ? '#486284' : '#1A202C',
      fontWeight: state.isSelected ? '500' : 'normal',
      '&:active': {
        backgroundColor: 'rgba(72, 98, 132, 0.2)'
      }
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: '0 4px 0 8px',
      color: 'rgba(72, 98, 132, 0.5)',
      '&:hover': {
        color: '#486284'
      }
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '8px 12px 8px 16px'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#1A202C',
      fontWeight: '500',
      margin: 0
    }),
    placeholder: (base) => ({
      ...base,
      color: '#1A202C',
      fontWeight: '500',
      margin: 0
    })
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
 
        <Link to="/" className={styles.logo} style={{ cursor: 'pointer' }}>
          <div className={styles.houseIcon}>
            <img src={HomeIcon} alt="Дом" />
          </div>
          <span className={styles.logoText}>СтройКонтроль</span>
        </Link>

        <div className={styles.navRight}>
          <div className={styles.navItems}>
            <Link to="/remarks" className={styles.navLink}>Замечания</Link>
            
            {/* Журнал с react-select */}
            <div className={styles.journalSelect}>
              <Select
                options={journalOptions}
                onChange={handleJournalChange}
                placeholder="Журнал"
                styles={customStyles}
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable={false}
                components={{
                  IndicatorSeparator: null
                }}
              />
            </div>

            <Link to="/control" className={styles.navLink}>Контроль</Link>
            <Link to="/schedule" className={styles.navLink}>График работ</Link>
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