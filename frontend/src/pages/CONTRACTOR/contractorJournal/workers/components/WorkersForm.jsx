import React, { useState } from 'react';
import styles from '../styles/workers.module.scss';

const WorkersForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    startTime: '',
    endTime: '',
    workDescription: '',
    notes: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Данные рабочего:', formData);
    alert('Данные рабочего сохранены!');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>ФИО рабочего *</label>
          <input 
            type="text" 
            placeholder="Иванов Иван Иванович"
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Должность/Специальность *</label>
          <select 
            value={formData.position}
            onChange={(e) => updateFormData('position', e.target.value)}
            required
          >
            <option value="">Выберите должность</option>
            <option value="carpenter">Плотник</option>
            <option value="mason">Каменщик</option>
            <option value="welder">Сварщик</option>
            <option value="electrician">Электрик</option>
            <option value="laborer">Разнорабочий</option>
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Время начала работы</label>
          <input 
            type="time" 
            value={formData.startTime}
            onChange={(e) => updateFormData('startTime', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Время окончания работы</label>
          <input 
            type="time" 
            value={formData.endTime}
            onChange={(e) => updateFormData('endTime', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Выполненные работы</label>
        <textarea 
          placeholder="Описание выполненных работ..."
          value={formData.workDescription}
          onChange={(e) => updateFormData('workDescription', e.target.value)}
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Примечания</label>
        <textarea 
          placeholder="Дополнительные заметки..."
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          rows={2}
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Сохранить данные
      </button>
    </form>
  );
};


export default WorkersForm;