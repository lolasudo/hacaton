import React from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import MainContent from './components/MainContent';
import styles from './styles/home.module.scss';


const Home = () => {
  return (
    <div className={styles.home}>
      <Navbar />
      <Banner />
      <MainContent />
    </div>
  );
};

export default Home;