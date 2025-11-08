import React from 'react';
import styles from '../styles/maincontent.module.scss';

import img1 from '../../../assets/images/Component 38.svg';
import img2 from '../../../assets/images/Component 39.svg';
import img3 from '../../../assets/images/Component 40.svg';

const cardsData = [
  {
    img: img1,
    title: 'Инженер контроля',
    text: [
      'Контроль качества работ',
      'Ведение замечаний с геолокацией',
      'Приемка выполненных работ',
    ],
  },
  {
    img: img2,
    title: 'Прораб',
    text: [
      'Управление работами на объекте',
      'Учет материалов и отчетность',
      'Исправление замечаний',
    ],
  },
  {
    img: img3,
    title: 'Инспектор надзора',
    text: [
      'Надзор за соблюдением нормативов',
      'Фиксация нарушений',
      'Контроль испытаний',
    ],
  },
];

const MainContent = () => {
  return (
    <section className={styles.block}>
      <div className={styles.sectionTitle}>Участники системы</div>

      <div className={styles.description}>
        Сервис обеспечивает взаимодействие между службой строительного контроля,
        подрядчиками и надзорными органами в рамках реализации программ благоустройства Москвы.
      </div>

      <div className={styles.cardsContainer}>
        {cardsData.map((card, index) => (
          <div key={index} className={styles.card}>
            <img src={card.img} alt={card.title} />
            <div className={styles.cardTitle}>{card.title}</div>
            <div className={styles.cardText}>
              {card.text.map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainContent;
