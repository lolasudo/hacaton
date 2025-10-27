import React from "react";
import { FaFileAlt, FaTrashAlt, FaCamera, FaImage } from "react-icons/fa";
import styles from "../styles/ProrabControl.module.scss";

const FileUploader = ({ formData, updateFormData }) => {
  const handleFilesDrop = (field) => (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    updateFormData(field, [...formData[field], ...dropped]);
  };

  const handleFilesSelect = (field) => (e) => {
    const selected = Array.from(e.target.files);
    updateFormData(field, [...formData[field], ...selected]);
  };

  const removeFile = (field, index) => {
    updateFormData(field, formData[field].filter((_, i) => i !== index));
  };

  // Функция для создания превью
  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const FileSection = ({ title, field, accept, capture, optional = false }) => (
    <div className={styles.uploadSection}>
      <div
        className={styles.dragDrop}
        onDrop={handleFilesDrop(field)}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById(`${field}Input`).click()}
      >
        <p>
          {field === 'photoFiles' ? <FaCamera /> : <FaFileAlt />} 
          {title} {optional && "(необязательно)"}
        </p>
        <input
          type="file"
          id={`${field}Input`}
          multiple
          accept={accept}
          capture={capture}
          onChange={handleFilesSelect(field)}
          style={{ display: "none" }}
        />
      </div>
      
      <div className={styles.fileList}>
        {formData[field].map((file, i) => (
          <FilePreview 
            key={i} 
            file={file} 
            onRemove={() => removeFile(field, i)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.fileUploader}>
      <FileSection
        title="Загрузить фото или сфотографировать"
        field="photoFiles"
        accept="image/*"
        capture="environment"
      />
      
      <FileSection
        title="Загрузить ТТН"
        field="ttnFiles"
        accept=".pdf,.doc,.docx,.jpg,.png"
      />
      
      <FileSection
        title="Загрузить паспорт качества"
        field="passportFiles"
        accept=".pdf,.doc,.docx,.jpg,.png"
        optional={true}
      />
      
      <p className={styles.supportedFormats}>
        Поддерживаемые форматы: JPG, PNG, PDF, допустимый размер до 10 MB
      </p>
    </div>
  );
};

// Отдельный компонент для превью файлов
const FilePreview = ({ file, onRemove }) => {
  const isImage = file.type.startsWith('image/');
  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div className={styles.filePreview}>
      {isImage ? (
        <div className={styles.imagePreview}>
          <img src={previewUrl} alt="Превью" />
          <div className={styles.imageOverlay}>
            <span className={styles.fileName}>{file.name}</span>
            <FaTrashAlt 
              className={styles.deleteIcon} 
              onClick={onRemove} 
            />
          </div>
        </div>
      ) : (
        <div className={styles.documentPreview}>
          <FaFileAlt className={styles.fileIcon} />
          <span className={styles.fileName}>{file.name}</span>
          <FaTrashAlt 
            className={styles.deleteIcon} 
            onClick={onRemove} 
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader;