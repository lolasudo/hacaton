import React from "react";
import Select from "react-select";
import styles from "../styles/ProrabControl.module.scss";

const StepCard = ({ formData, updateFormData, workOptions }) => {
  return (
    <div className={styles.stepContent}>
      <Select
        options={workOptions}
        placeholder="Выберите тип работы..."
        value={formData.selectedWork}
        onChange={(value) => updateFormData("selectedWork", value)}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      <p className={styles.helperText}>
        Если работы нет в списке - обратитесь к администратору проекта
      </p>
    </div>
  );
};

export default StepCard;