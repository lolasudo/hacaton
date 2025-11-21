import React from 'react';
import { FaCamera, FaTrashAlt } from 'react-icons/fa';
import styles from '../../styles/photoUpload.module.scss';

const PhotoUpload = ({ photos, onPhotosChange, maxPhotos = 10 }) => {
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > maxPhotos) {
      alert(`Максимум можно загрузить ${maxPhotos} фото`);
      return;
    }
    onPhotosChange([...photos, ...files]);
  };

  const handlePhotoDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (photos.length + files.length > maxPhotos) {
      alert(`Максимум можно загрузить ${maxPhotos} фото`);
      return;
    }
    onPhotosChange([...photos, ...files]);
  };

  const removePhoto = (index) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    document.getElementById('photoFilesInput')?.click();
  };

  return (
    <div className={styles.photoUploadContainer}>
      <div 
        className={styles.dragDrop} 
        onClick={triggerFileInput}
        onDrop={handlePhotoDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p>
          <FaCamera /> Загрузить фото или сфотографировать
        </p>
        <input 
          id="photoFilesInput" 
          multiple 
          accept="image/*" 
          capture="environment" 
          type="file" 
          onChange={handlePhotoUpload}
          style={{ display: 'none' }} 
        />
      </div>
      
      {/* Превью загруженных фото */}
      {photos.length > 0 && (
        <div className={styles.photoPreviewGrid}>
          {photos.map((file, index) => (
            <div key={index} className={styles.photoPreview}>
              <img 
                src={URL.createObjectURL(file)} 
                alt={`Превью ${index + 1}`}
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removePhotoButton}
                onClick={() => removePhoto(index)}
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {photos.length > 0 && (
        <div className={styles.photoCounter}>
          Загружено: {photos.length} / {maxPhotos}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;