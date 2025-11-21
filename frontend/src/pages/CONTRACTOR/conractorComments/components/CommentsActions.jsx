import React from "react";
import styles from "../styles/ContractorComments.module.scss";

const CommentsActions = ({ 
  formData, 
  updateFormData, 
  clearForm, 
  saveDraft, 
  submitCorrection,
  selectedRemark 
}) => {
  return (
    <div className={styles.stepActions}>
      <div className={styles.commentSection}>
        <div className={styles.commentLabel}>
          Дополнительный комментарий
          {formData.additionalComment && <span className={styles.filledIndicator}> • Заполнено</span>}
        </div>
        <textarea
          className={styles.textarea}
          placeholder="Дополнительные комментарии или примечания..."
          value={formData.additionalComment}
          onChange={(e) => updateFormData("additionalComment", e.target.value)}
          rows={3}
        />
        <div className={styles.commentCounter}>
          {formData.additionalComment.length}/500 символов
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={submitCorrection}
          disabled={!selectedRemark || !formData.correctionDescription}
        >
          <span className={styles.buttonIcon}>✓</span>
          Отправить на проверку
        </button>
        
        <button 
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={saveDraft}
        >
          <span className={styles.buttonIcon}>💾</span>
          Сохранить черновик
        </button>
        
        <button 
          className={`${styles.button} ${styles.buttonDanger}`}
          onClick={clearForm}
        >
          <span className={styles.buttonIcon}>×</span>
          Очистить форму
        </button>
      </div>

      <div className={styles.actionHints}>
        <div className={styles.hint}>• Все поля отмеченные * обязательны для заполнения</div>
        <div className={styles.hint}>• После отправки замечание перейдет в статус "На проверке"</div>
        <div className={styles.hint}>• Служба строительного контроля проверит исправление в течение 3 рабочих дней</div>
      </div>
    </div>
  );
};

export default CommentsActions;