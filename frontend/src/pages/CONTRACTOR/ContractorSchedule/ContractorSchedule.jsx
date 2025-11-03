import React, { useState } from 'react';
import Navbar from "../../Profile/NavBarProfile";
import GanttPro from '../ContractorSchedule/components/GanttChart';
import ScheduleActions from '../ContractorSchedule/components/ScheduleActions';
import UsersTable from './components/UsersTable';
import styles from '../ContractorSchedule/styles/ContractorSchedule.module.scss';

const ContractorSchedule = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [tasks, setTasks] = useState([]);

  const handleDataChange = (newTasks) => {
    setTasks(newTasks);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    console.log('Отправка графика на согласование:', tasks);
    setHasUnsavedChanges(false);
    alert('График отправлен на согласование!');
  };

  const handleReset = () => {
    setHasUnsavedChanges(false);
    window.location.reload();
  };

  // Пример данных для таблицы пользователей
  const usersData = [
    {
      id: 1,
      name: "Иванов Иван Иванович",
      role: "Прораб",
      organization: "СтройГрупп",
      phone: "+7 (999) 123-45-67",
      email: "ivanov@stroygroup.ru",
      lastActivity: "2 часа назад"
    },
    {
      id: 2,
      name: "Петров Петр Петрович",
      role: "Инженер",
      organization: "СтройГрупп", 
      phone: "+7 (999) 765-43-21",
      email: "petrov@stroygroup.ru",
      lastActivity: "5 часов назад"
    },
    {
      id: 3,
      name: "Сидорова Анна Сергеевна",
      role: "Архитектор",
      organization: "ПроектБюро",
      phone: "+7 (999) 555-44-33",
      email: "sidorova@projectburo.ru",
      lastActivity: "Вчера"
    }
  ];

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>График строительных работ</h1>
          <p className={styles.subtitle}>Управление расписанием и координация с участниками проекта</p>
        </div>

        <div className={styles.content}>
          <div className={styles.ganttSection}>
            <GanttPro 
              tasks={tasks}
              onDataChange={handleDataChange}
            />
          </div>

          <div className={styles.actionsSection}>
            <ScheduleActions 
              hasUnsavedChanges={hasUnsavedChanges}
              onSave={handleSave}
              onReset={handleReset}
            />
          </div>

          <div className={styles.usersSection}>
            <h2>Участники проекта</h2>
            <UsersTable data={usersData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorSchedule;