import React from "react";
import { FaSave, FaTrash, FaCheck } from "react-icons/fa";
import styles from "../styles/ProrabControl.module.scss";

const StepActions = ({ formData, updateFormData, clearForm, saveDraft, onSubmit }) => {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  const hasComment = formData.comment && formData.comment.trim().length > 0;
  const commentLength = formData.comment?.length || 0;

  return (
    <div className={styles.stepActions}>
      <div className={styles.commentSection}>
        <label className={styles.commentLabel}>
          Комментарий к работе
          {hasComment && <span className={styles.filledIndicator}>✓</span>}
        </label>
        <textarea
          placeholder="Опишите особенности выполнения работы, замечания или дополнительные инструкции..."
          value={formData.comment || ""}
          onChange={(e) => updateFormData("comment", e.target.value)}
          className={styles.textarea}
          rows={4}
          maxLength={500}
        />
        <div className={styles.commentCounter}>
          {commentLength}/500 символов
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          className={`${styles.button} ${styles.buttonDanger}`}
          onClick={clearForm}
          type="button"
        >
          <FaTrash className={styles.buttonIcon} />
          Очистить форму
        </button>
        
        <button 
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={saveDraft}
          type="button"
          disabled={!hasComment}
        >
          <FaSave className={styles.buttonIcon} />
          Сохранить черновик
        </button>
        
        <button 
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleSubmit}
          type="button"
        >
          <FaCheck className={styles.buttonIcon} />
          Завершить работу
        </button>
      </div>

      <div className={styles.actionHints}>
        <div className={styles.hint}>
          • Черновик сохранит все введенные данные
        </div>
        <div className={styles.hint}>
          • После завершения работа будет отправлена на проверку
        </div>
      </div>
    </div>
  );
};

export default StepActions;