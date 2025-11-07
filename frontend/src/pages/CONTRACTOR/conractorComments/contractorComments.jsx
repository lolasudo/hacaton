import React, { useState } from "react";
import Navbar from "../../Profile/components/NavBarProfile";
import styles from "./styles/ContractorComments.module.scss";
import Select from "react-select";
import RemarksList from "./components/RemarksList";
import CorrectionForm from "./components/CorrectionForm";
import CorrectionFiles from "./components/CorrectionFiles";
import CommentsActions from "./components/CommentsActions";

const ContractorComments = () => {
  const [formData, setFormData] = useState({
    correctionDescription: "",
    correctionFiles: [],
    additionalComment: "",
    selectedRemark: null
  });


  const remarksOptions = [
    {
      value: 1,
      label: "Нарушение технологии укладки асфальта",
      remark: {
        id: 1,
        type: "violation",
        title: "Нарушение технологии укладки асфальта",
        description: "Толщина асфальтового покрытия не соответствует проектной документации. Требуется переукладка участка 15 кв.м.",
        author: "Инспектор контрольного органа",
        authorType: "inspector",
        date: "28.10.2024",
        deadline: "02.11.2024",
        status: "new",
        priority: "high",
        category: "Качество работ",
        location: "Участок №3",
        requiredActions: ["Демонтаж покрытия", "Переукладка асфальта", "Контроль толщины"]
      }
    },
    {
      value: 2,
      label: "Несоответствие материалов",
      remark: {
        id: 2,
        type: "remark",
        title: "Несоответствие материалов",
        description: "Используемый цемент не имеет сертификата соответствия. Предоставить паспорт качества в течение 2 дней.",
        author: "Служба строительного контроля",
        authorType: "control_service",
        date: "27.10.2024",
        deadline: "29.10.2024",
        status: "in_progress",
        priority: "high",
        category: "Документация",
        location: "Склад материалов",
        requiredActions: ["Предоставить документы", "Заменить материал при необходимости"]
      }
    },
    {
      value: 3,
      label: "Недостаточное количество рабочих",
      remark: {
        id: 3,
        type: "violation",
        title: "Недостаточное количество рабочих",
        description: "На объекте присутствует 3 рабочих вместо 5 по графику. Это приводит к срыву сроков.",
        author: "Инспектор контрольного органа", 
        authorType: "inspector",
        date: "26.10.2024",
        deadline: "28.10.2024",
        status: "fixed",
        priority: "medium",
        category: "Организация работ",
        location: "Весь объект",
        requiredActions: ["Увеличить состав рабочих", "Скорректировать график"]
      }
    }
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearForm = () => {
    setFormData({
      correctionDescription: "",
      correctionFiles: [],
      additionalComment: "",
      selectedRemark: null
    });
  };

  const saveDraft = () => {
    console.log("Черновик исправления сохранен:", formData);
    alert("Черновик сохранен!");
  };

  const submitCorrection = () => {
    if (!formData.selectedRemark) {
      alert("Выберите замечание для исправления");
      return;
    }

    if (!formData.correctionDescription.trim()) {
      alert("Опишите выполненные работы по исправлению");
      return;
    }

    alert("Исправление отправлено на проверку службе строительного контроля!");
    clearForm();
  };

  const stepsData = [
    {
      number: 1,
      title: "Выбор замечания",
      description: "Выберите замечание или нарушение для исправления",
      content: (
        <RemarksList 
          remarksOptions={remarksOptions}
          selectedRemark={formData.selectedRemark}
          onRemarkSelect={(remark) => updateFormData("selectedRemark", remark)}
        />
      ),
    },
    {
      number: 2,
      title: "Описание исправления", 
      description: "Подробно опишите выполненные работы по устранению",
      content: (
        <CorrectionForm 
          formData={formData}
          updateFormData={updateFormData}
          selectedRemark={formData.selectedRemark}
        />
      ),
    },
    {
      number: 3,
      title: "Подтверждающие документы",
      description: "Загрузите фото и документы, подтверждающие исправление",
      content: (
        <CorrectionFiles 
          formData={formData}
          updateFormData={updateFormData}
        />
      ),
    },
    {
      number: 4,
      title: "Отправка на проверку",
      description: "Проверьте данные и отправьте исправление на проверку",
      content: (
        <CommentsActions 
          formData={formData}
          updateFormData={updateFormData}
          clearForm={clearForm}
          saveDraft={saveDraft}
          submitCorrection={submitCorrection}
          selectedRemark={formData.selectedRemark}
        />
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Исправление замечаний и нарушений</h1>
        <p className={styles.subtitle}>
          Выберите замечание от службы контроля или инспектора, опишите выполненные работы по исправлению и прикрепите подтверждающие документы
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

export default ContractorComments;