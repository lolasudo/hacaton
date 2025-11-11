import React, { useState, useEffect } from "react";
import Navbar from "../../Profile/components/NavBarProfile";
import styles from "./styles/ProrabControl.module.scss";
import Select from "react-select";
import { IMaskInput } from "react-imask";
import StepCard from "./components/StepCard";
import FileUploader from "./components/FileUploader";
import TTNInput from "./components/TTNInput";
import StepActions from "./components/StepActions";
import { workOptions, volumeOptions } from "./data/options";

const ContractorControl = () => {
  const [formData, setFormData] = useState({
    deliveryDate: "",
    comment: "",
    photoFiles: [],
    ttnFiles: [],
    passportFiles: [],
    selectedWork: null,
    selectedVolume: null,
    ttnNumber: "",
    materialName: "",
    materialQuantity: "",
    location: null,
    isRecognizing: false
  });

  const [recognizedData, setRecognizedData] = useState(null);

  // Получение геолокации при загрузке компонента
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev, 
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: new Date().toISOString()
            }
          }));
        },
        (error) => console.error('Ошибка геолокации:', error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Функция распознавания ТТН через Computer Vision
  const recognizeTTN = async (file) => {
    if (!file) return;
    
    setFormData(prev => ({ ...prev, isRecognizing: true }));
    
    try {
      const formData = new FormData();
      formData.append('ttn_image', file);
      formData.append('location', JSON.stringify(formData.location));

      const response = await fetch('/api/cv/recognize-ttn', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setRecognizedData(result);
        
        // Автозаполнение полей из распознанного ТТН
        setFormData(prev => ({
          ...prev,
          materialName: result.material_name || "",
          ttnNumber: result.ttn_number || "",
          materialQuantity: result.quantity || "",
          selectedVolume: result.unit ? { value: result.unit, label: result.unit } : null,
          deliveryDate: result.delivery_date || ""
        }));
      } else {
        throw new Error('Ошибка распознавания ТТН');
      }
    } catch (error) {
      console.error('Ошибка при распознавании ТТН:', error);
      alert('Не удалось распознать ТТН. Заполните данные вручную.');
    } finally {
      setFormData(prev => ({ ...prev, isRecognizing: false }));
    }
  };

  // Обработчик загрузки ТТН файлов
  const handleTTNFilesChange = (files) => {
    updateFormData("ttnFiles", files);
    if (files.length > 0) {
      recognizeTTN(files[0]);
    }
  };

  const clearForm = () => {
    setFormData({
      deliveryDate: "",
      comment: "",
      photoFiles: [],
      ttnFiles: [],
      passportFiles: [],
      selectedWork: null,
      selectedVolume: null,
      ttnNumber: "",
      materialName: "",
      materialQuantity: "",
      location: formData.location, // Сохраняем геолокацию
      isRecognizing: false
    });
    setRecognizedData(null);
  };

  const saveDraft = async () => {
    try {
      const draftData = {
        ...formData,
        recognized_data: recognizedData,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/materials/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftData)
      });

      if (response.ok) {
        alert("Черновик сохранён!");
      } else {
        throw new Error('Ошибка сохранения черновика');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении черновика');
    }
  };

  const submitForm = async () => {
    // Валидация обязательных полей
    if (!formData.selectedWork || !formData.materialName || !formData.ttnNumber || !formData.materialQuantity || !formData.deliveryDate) {
      alert("Заполните все обязательные поля (отмечены *)");
      return;
    }

    if (!formData.location) {
      alert("Не удалось определить ваше местоположение. Проверьте разрешения браузера.");
      return;
    }

    try {
      const submitData = {
        work_id: formData.selectedWork.value,
        material_name: formData.materialName,
        ttn_number: formData.ttnNumber,
        quantity: formData.materialQuantity,
        unit: formData.selectedVolume?.value,
        delivery_date: formData.deliveryDate,
        comment: formData.comment,
        location: formData.location,
        photos: formData.photoFiles,
        ttn_document: formData.ttnFiles[0],
        quality_passport: formData.passportFiles[0],
        recognized_data: recognizedData,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/materials/input-control', {
        method: 'POST',
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        alert("Данные входного контроля успешно сохранены!");
        clearForm();
      } else {
        throw new Error('Ошибка сохранения данных');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении данных');
    }
  };

  const stepsData = [
    {
      number: 1,
      title: "Выбор работы",
      description: "Выберите работу из состава работ для привязки материала.",
      content: (
        <StepCard 
          formData={formData}
          updateFormData={updateFormData}
          workOptions={workOptions}
        />
      ),
    },
    {
      number: 2,
      title: "Загрузка документов",
      description: "Загрузите фото, ТТН и паспорт качества для автоматического распознавания.",
      content: (
        <FileUploader 
          formData={formData}
          updateFormData={updateFormData}
          onTTNFilesChange={handleTTNFilesChange}
          isRecognizing={formData.isRecognizing}
        />
      ),
    },
    {
      number: 3,
      title: "Данные материала",
      description: "Проверьте автоматически распознанные данные и при необходимости исправьте вручную.",
      content: (
        <div className={styles.materialData}>
          {/* Блок с распознанными данными */}
          {recognizedData && (
            <div className={styles.recognizedData}>
              <h4>✅ Данные распознаны автоматически</h4>
              <div className={styles.recognizedFields}>
                <span>Наименование: {recognizedData.material_name}</span>
                <span>Номер ТТН: {recognizedData.ttn_number}</span>
                <span>Количество: {recognizedData.quantity} {recognizedData.unit}</span>
                <span>Точность распознавания: {recognizedData.confidence}%</span>
              </div>
              <p className={styles.recognitionNote}>
                Проверьте данные и при необходимости исправьте ниже
              </p>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Наименование материала *</label>
            <input 
              type="text" 
              placeholder="Например: Цемент М500" 
              value={formData.materialName}
              onChange={(e) => updateFormData("materialName", e.target.value)}
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Номер ТТН *</label>
            <TTNInput 
              ttnList={["TTN-25.10.2025-001","TTN-25.10.2025-002","TTN-25.10.2025-003"]}
              value={formData.ttnNumber}
              setValue={(value) => updateFormData("ttnNumber", value)}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Объем / Вес *</label>
              <div className={styles.row}>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={formData.materialQuantity}
                  onChange={(e) => updateFormData("materialQuantity", e.target.value)}
                  required 
                />
                <Select
                  options={volumeOptions}
                  placeholder="Единица"
                  value={formData.selectedVolume}
                  onChange={(value) => updateFormData("selectedVolume", value)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Дата поставки *</label>
              <IMaskInput
                mask="00.00.0000"
                placeholder="ДД.ММ.ГГГГ"
                value={formData.deliveryDate}
                onAccept={(value) => updateFormData("deliveryDate", value)}
                className={styles.datePicker}
                required
              />
            </div>
          </div>

          {/* Отображение геолокации */}
          {formData.location && (
            <div className={styles.locationInfo}>
              <span>📍 Местоположение зафиксировано</span>
              <small>Широта: {formData.location.lat.toFixed(6)}, Долгота: {formData.location.lng.toFixed(6)}</small>
            </div>
          )}
        </div>
      ),
    },
    {
      number: 4,
      title: "Подтверждение",
      description: "Проверьте данные и сохраните информацию о поставке.",
      content: (
        <StepActions 
          formData={formData}
          updateFormData={updateFormData}
          clearForm={clearForm}
          saveDraft={saveDraft}
          submitForm={submitForm}
          recognizedData={recognizedData}
        />
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Входной контроль материалов</h1>
        <p className={styles.subtitle}>
          Загрузите ТТН для автоматического распознавания или заполните данные вручную
        </p>

        <div className={styles.steps}>
          {stepsData.map((step, index) => (
            <div className={styles.stepWrapper} key={step.number}>
              <div className={styles.circle}>{step.number}</div>
              {index < stepsData.length - 1 && <div className={styles.connector}></div>}
              <div className={styles.step}>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
                {step.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractorControl;