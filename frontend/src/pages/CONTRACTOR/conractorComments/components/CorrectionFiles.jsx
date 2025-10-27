import React from "react";
import styles from "../styles/ContractorComments.module.scss";

const CorrectionFiles = ({ formData, updateFormData }) => {
  const handleFileUpload = (files) => {
    const newFiles = Array.from(files);
    updateFormData("correctionFiles", [...formData.correctionFiles, ...newFiles]);
  };

  const handleFileDelete = (index) => {
    const updatedFiles = formData.correctionFiles.filter((_, i) => i !== index);
    updateFormData("correctionFiles", updatedFiles);
  };

  return (
    <div className={styles.fileUploader}>
      <div className={styles.uploadSection}>
        <div 
          className={styles.dragDrop}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileUpload(e.dataTransfer.files);
          }}
          onClick={() => document.getElementById('correction-file-input').click()}
        >
          <p>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
            </svg>
            Перетащите файлы или нажмите для загрузки
          </p>
        </div>
        
        <input
          id="correction-file-input"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          onChange={(e) => handleFileUpload(e.target.files)}
          style={{ display: 'none' }}
        />

        <div className={styles.supportedFormats}>
          Поддерживаемые форматы: JPG, PNG, PDF, DOCX (макс. 10MB)
        </div>
      </div>

      {formData.correctionFiles.length > 0 && (
        <div className={styles.fileList}>
          {formData.correctionFiles.map((file, index) => (
            <div key={index} className={styles.filePreview}>
              {file.type.startsWith('image/') ? (
                <div className={styles.imagePreview}>
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={file.name} 
                  />
                  <div className={styles.imageOverlay}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span 
                      className={styles.deleteIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete(index);
                      }}
                    >
                      ×
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.documentPreview}>
                  <div className={styles.fileIcon}>
                    {file.type === 'application/pdf' ? '📄' : '📎'}
                  </div>
                  <span className={styles.fileName}>{file.name}</span>
                  <span 
                    className={styles.deleteIcon}
                    onClick={() => handleFileDelete(index)}
                  >
                    ×
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CorrectionFiles;