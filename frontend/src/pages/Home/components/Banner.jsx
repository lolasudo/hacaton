import React from 'react';
import styles from '../styles/banner.module.scss';

const Banner = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.bannerContainer}>
        
        {/* Контейнер для текста - все элементы выровнены вертикально */}
        <div className={styles.textContainer}>
          
          <div className={styles.subtitle}>
            Прозрачность процессов – Все этапы работ онлайн
          </div>
          
          <h1 className={styles.title}>
            ЭЛЕКТРОННЫЙ ЖУРНАЛ СТРОИТЕЛЬНОГО КОНТРОЛЯ
          </h1>
          
          <p className={styles.description}>
            Сервис для цифрового сопровождения работ по благоустройству городских территорий
          </p>
          
          {/* Контейнер для кнопок */}
          <div className={styles.buttonsContainer}>
            <button className={styles.primaryButton}>
              Войти в журнал
            </button>
            
            <a href="#" className={styles.secondaryLink}>
              Пользование
            </a>
          </div>
          
        </div>

        {/* Image */}
        <div className={styles.imageSection}>
          <div className={styles.imagePlaceholder}>
            <img src="/src/assets/images/image 5.png" alt="Строительный контроль" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Banner;