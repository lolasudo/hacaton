import React from "react";
import Select from "react-select";
import { FaClipboardList, FaBullseye } from "react-icons/fa";
import styles from "../styles/ContractorComments.module.scss";

const RemarksList = ({ remarksOptions, selectedRemark, onRemarkSelect }) => {
  const handleRemarkChange = (selectedOption) => {
    onRemarkSelect(selectedOption ? selectedOption.remark : null);
  };

  const getSelectedValue = () => {
    return remarksOptions.find(option => option.remark.id === selectedRemark?.id) || null;
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#fff',
      border: '1px solid #CED7E4',
      borderRadius: '6px',
      minHeight: '44px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#CED7E4',
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '6px',
      border: '1px solid #CED7E4',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#fff',
    }),
    option: (base, state) => ({
      ...base,
      padding: '8px 16px',
      color: '#1A202C',
      backgroundColor: state.isFocused ? 'rgba(206, 215, 228, 0.3)' : '#fff',
      '&:active': {
        backgroundColor: 'rgba(206, 215, 228, 0.5)',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: '#1A202C',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#666666',
    }),
  };

  const getPriorityClass = (priority) => {
    return styles[priority] || '';
  };

  return (
    <div className={styles.remarksList}>
      <div className={styles.inputGroup}>
        <label>Выберите замечание для исправления *</label>
        <Select
          options={remarksOptions}
          value={getSelectedValue()}
          onChange={handleRemarkChange}
          placeholder="Выберите замечание из списка..."
          styles={customStyles}
          isClearable
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {selectedRemark && (
        <div className={styles.selectedRemarkInfo}>
          <div className={styles.remarkDetails}>
            <h4>
              <FaClipboardList />
              Детали замечания
            </h4>
            
            <div className={styles.remarkMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Автор:</span>
                <span>{selectedRemark.author}</span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Дата:</span>
                <span>{selectedRemark.date}</span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Срок устранения:</span>
                <span className={styles.deadline}>{selectedRemark.deadline}</span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Приоритет:</span>
                <span className={`${styles.priority} ${getPriorityClass(selectedRemark.priority)}`}>
                  {selectedRemark.priority === 'high' && 'Высокий'}
                  {selectedRemark.priority === 'medium' && 'Средний'}
                  {selectedRemark.priority === 'low' && 'Низкий'}
                </span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Категория:</span>
                <span>{selectedRemark.category}</span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Местоположение:</span>
                <span>{selectedRemark.location}</span>
              </div>
            </div>

            <div className={styles.remarkDescription}>
              <strong>Описание:</strong>
              <p>{selectedRemark.description}</p>
            </div>

            {selectedRemark.requiredActions && (
              <div className={styles.requiredActions}>
                <div className={styles.actionsLabel}>
                  <FaBullseye />
                  Требуемые действия
                </div>
                <div className={styles.actionsList}>
                  {selectedRemark.requiredActions.map((action, index) => (
                    <div key={index} className={styles.actionItem}>
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RemarksList;