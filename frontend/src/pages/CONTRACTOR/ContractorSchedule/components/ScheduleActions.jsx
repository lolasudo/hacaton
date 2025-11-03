import React from "react";
import { FaSave, FaUndo, FaClock } from "react-icons/fa";
import styles from "../styles/ContractorSchedule.module.scss";

const ScheduleActions = ({ hasUnsavedChanges, onSave, onReset }) => {
  return (
    <div className={styles.scheduleActions}>
      {hasUnsavedChanges && (
        <div className={styles.unsavedChanges}>
          <FaClock />
          <span>Есть несохраненные изменения</span>
        </div>
      )}
      
      <div className={styles.actionButtons}>
        <button 
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={onSave}
          disabled={!hasUnsavedChanges}
        >
          <FaSave />
          Отправить на согласование
        </button>
        
        <button 
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={onReset}
          disabled={!hasUnsavedChanges}
        >
          <FaUndo />
          Отменить изменения
        </button>
      </div>
    </div>
  );
};

export default ScheduleActions;