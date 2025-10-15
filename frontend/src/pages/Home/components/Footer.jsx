import React from 'react';
import styles from '../styles/footer.module.scss';
import HomeIcon from '../../../assets/icons/gridicons_house.svg';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        {/* Логотип */}
        <div className={styles.footerLogo}>
          <div className={styles.logoWrapper}>
            <img src={HomeIcon} alt="Logo" className={styles.logoIcon} />
            <span className={styles.logoText}>СтройКонтроль</span>
          </div>
          <div className={styles.logoDesc}>
            Цифровой контроль <br /> строительных объектов Москвы
          </div>

          {/* Соцсети */}
          <div className={styles.socials}>
            <div className={styles.socialIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.3v1.9h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12" />
              </svg>
            </div>
            <div className={styles.socialIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.25 4.25 0 0 0 1.88-2.34 8.5 8.5 0 0 1-2.7 1.04A4.22 4.22 0 0 0 16.1 4c-2.4 0-4.3 2-4.3 4.3 0 .33.03.66.1.97A12 12 0 0 1 3.1 5.1a4.23 4.23 0 0 0-.6 2.2c0 1.5.8 2.9 2 3.7a4.2 4.2 0 0 1-2-.6v.06c0 2.1 1.5 3.9 3.4 4.3a4.23 4.23 0 0 1-1.9.07c.5 1.6 2 2.8 3.8 2.9A8.5 8.5 0 0 1 2 19.5 12 12 0 0 0 8.3 21c7.6 0 11.8-6.3 11.8-11.8v-.5A8.2 8.2 0 0 0 22.46 6" />
              </svg>
            </div>
            <div className={styles.socialIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.8-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Колонки */}
        <div className={styles.footerColumn}>
          <div className={styles.columnTitle}>О нас</div>
          <a href="#" className={styles.columnLink}>Прозрачность</a>
          <a href="#" className={styles.columnLink}>Геолокация</a>
          <a href="#" className={styles.columnLink}>Контакты</a>
        </div>

        <div className={styles.footerColumn}>
          <div className={styles.columnTitle}>Сервисы</div>
          <a href="#" className={styles.columnLink}>mos.ru</a>
          <a href="#" className={styles.columnLink}>stroi.mos.ru</a>
          <a href="#" className={styles.columnLink}>remont.mos.ru</a>
        </div>

        <div className={styles.footerColumn}>
          <div className={styles.columnTitle}>Поддержка</div>
          <a href="#" className={styles.columnLink}>Обратная связь</a>
          <a href="#" className={styles.columnLink}>Статус системы</a>
          <a href="#" className={styles.columnLink}>Мобильное приложение</a>
        </div>
      </div>

      <div className={styles.footerLine}></div>

      <div className={styles.footerCopyright}>
        © 2025 Электронный журнал строительного контроля. Комплекс градостроительной политики и строительства города Москвы
      </div>
    </footer>
  );
};

export default Footer;
