import React from 'react';
import Navbar from '../../../Profile/components/NavBarProfile';
import HiddenWorksForm from './components/HiddenWorksForm';
import styles from './styles/hiddenWorks.module.scss';

const HiddenWorks = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Скрытые работы</h1>
        <p className={styles.subtitle}>Фиксация актов выполненных скрытых работ</p>
        <HiddenWorksForm />
      </div>
    </div>
  );
};


export default HiddenWorks;