import React from "react";
import styles from "../styles/ContractorComments.module.scss";

const CorrectionForm = ({ formData, updateFormData, selectedRemark }) => {
  return (
    <div className={styles.correctionData}>
      {selectedRemark && (
        <div className={styles.selectedRemarkInfo}>
          <h4>Выбранное замечание:</h4>
          <p>{selectedRemark.title}</p>
        </div>
      )}
      
      <div className={styles.inputGroup}>
        <label>Описание выполненных работ *</label>
        <textarea 
          placeholder="Подробно опишите, какие работы были выполнены для устранения замечания, какие материалы использовались, сроки выполнения..."
          value={formData.correctionDescription}
          onChange={(e) => updateFormData("correctionDescription", e.target.value)}
          rows={6}
          required 
        />
        <div className={styles.helperText}>
          Опишите конкретные действия, выполненные для устранения замечания
        </div>
      </div>
    </div>
  );
};

export default CorrectionForm;