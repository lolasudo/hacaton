import React, { useState } from "react";
import Navbar from "../../Profile/NavBarProfile";
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
    materialQuantity: ""
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      materialQuantity: ""
    });
  };

  const saveDraft = () => {
    console.log("Draft saved:", formData);
    alert("Черновик сохранён!");
  };

  const stepsData = [
    {
      number: 1,
      title: "Выбор работы",
      description: "Выберите тип работы для фиксации поставки материалов.",
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
      description: "Загрузите фото, ТТН и паспорт качества.",
      content: (
        <FileUploader 
          formData={formData}
          updateFormData={updateFormData}
        />
      ),
    },
    {
      number: 3,
      title: "Данные материала",
      description: "Укажите данные по поступившему материалу.",
      content: (
        <div className={styles.materialData}>
          <div className={styles.inputGroup}>
            <label>Наименование *</label>
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
        </div>
      ),
    },
    {
      number: 4,
      title: "Подтверждение",
      description: "Проверьте данные и оставьте комментарий (по необходимости).",
      content: (
        <StepActions 
          formData={formData}
          updateFormData={updateFormData}
          clearForm={clearForm}
          saveDraft={saveDraft}
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
          Выберите работу, прикрепите документы и заполните данные.
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