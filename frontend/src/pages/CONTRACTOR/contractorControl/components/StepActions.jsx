import React from "react";
import { FaSave } from "react-icons/fa";
import styles from "../styles/ProrabControl.module.scss";

const StepActions = ({ formData, updateFormData, clearForm, saveDraft }) => {
  return (
    <div className={styles.stepActions}>
      <textarea
        placeholder="Введите комментарий..."
        value={formData.comment}
        onChange={(e) => updateFormData("comment", e.target.value)}
        className={styles.textarea}
      />
      <div className={styles.actions}>
        <button className={styles.button} onClick={clearForm}>
          Очистить форму
        </button>
        <button className={styles.button} onClick={saveDraft}>
          <FaSave /> Сохранить черновик
        </button>
        <button className={styles.button}>
          Готово
        </button>
      </div>
    </div>
  );
};

export default StepActions;