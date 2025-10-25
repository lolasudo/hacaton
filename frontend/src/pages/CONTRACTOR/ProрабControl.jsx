import React, { useState } from "react";
import Navbar from "../Profile/NavBarProfile";
import styles from "./styles/ProrabControl.module.scss";
import Select from "react-select";
import { IMaskInput } from "react-imask";
import { FaFileAlt, FaTrashAlt, FaSave, FaCamera } from "react-icons/fa";

// Настройки
const workOptions = [
  { value: "foundation", label: "Фундамент" },
  { value: "walls", label: "Кладка стен" },
  { value: "roof", label: "Кровля" },
  { value: "finishing", label: "Отделка" },
];

const volumeOptions = [
  { value: "m3", label: "м³" },
  { value: "ton", label: "тонн" },
  { value: "liters", label: "литров" },
];

// Компонент ТТН с автозаполнением
const TTNInput = ({ ttnList, value, setValue }) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase();
    setValue(val);

    if (val.length > 0) {
      const filtered = ttnList.filter(ttn => ttn.startsWith(val));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (sugg) => {
    setValue(sugg);
    setSuggestions([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <IMaskInput
        mask="TTN-00.00.0000-000"
        placeholder="Введите номер накладной"
        value={value}
        onAccept={setValue}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px" }}
      />
      {suggestions.length > 0 && (
        <ul style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#fff",
          border: "1px solid #ccc",
          maxHeight: "150px",
          overflowY: "auto",
          zIndex: 10,
          listStyle: "none",
          margin: 0,
          padding: 0
        }}>
          {suggestions.map((s, i) => (
            <li key={i} 
                onClick={() => selectSuggestion(s)}
                style={{ padding: "5px 10px", cursor: "pointer" }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ProRabControl = () => {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [comment, setComment] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [ttnFiles, setTtnFiles] = useState([]);
  const [passportFiles, setPassportFiles] = useState([]);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [ttnNumber, setTtnNumber] = useState("");

  // Загрузка файлов
  const handleFilesDrop = (setter) => (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setter(prev => [...prev, ...dropped]);
  };

  const handleFilesSelect = (setter) => (e) => {
    const selected = Array.from(e.target.files);
    setter(prev => [...prev, ...selected]);
  };

  const removeFile = (setter, index) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  // Очистка формы полностью
  const clearForm = () => {
    setDeliveryDate("");
    setComment("");
    setPhotoFiles([]);
    setTtnFiles([]);
    setPassportFiles([]);
    setSelectedWork(null);
    setSelectedVolume(null);
    setTtnNumber("");

    document.querySelectorAll('input[type="text"], input[type="number"], input[type="file"]').forEach(input => input.value = "");
    document.querySelectorAll('textarea').forEach(text => text.value = "");
  };

  const saveDraft = () => alert("Черновик сохранён!");

  const stepsData = [
    {
      number: 1,
      title: "Выбор работы",
      description: "Выберите тип работы для фиксации поставки материалов.",
      content: (
        <Select
          options={workOptions}
          placeholder="Выберите тип работы..."
          value={selectedWork}
          onChange={setSelectedWork}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      ),
    },
    {
      number: 2,
      title: "Загрузка документов",
      description: "Загрузите фото, ТТН и паспорт качества.",
      content: (
        <div className={styles.uploadSection}>
          {/* Фото */}
          <div
            className={styles.dragDrop}
            onDrop={handleFilesDrop(setPhotoFiles)}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("photoInput").click()}
          >
            <p><FaCamera /> Загрузить фото или <span>сфотографировать</span></p>
            <input
              type="file"
              id="photoInput"
              multiple
              accept="image/*"
              capture="environment"
              onChange={handleFilesSelect(setPhotoFiles)}
              style={{ display: "none" }}
            />
          </div>
          <div className={styles.fileList}>
            {photoFiles.map((file, i) => (
              <div key={i} className={styles.fileItem}>
                <FaFileAlt className={styles.fileIcon} />
                <span>{file.name}</span>
                <FaTrashAlt className={styles.deleteIcon} onClick={() => removeFile(setPhotoFiles, i)} />
              </div>
            ))}
          </div>

          {/* ТТН */}
          <div
            className={styles.dragDrop}
            onDrop={handleFilesDrop(setTtnFiles)}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("ttnInput").click()}
          >
            <p><FaFileAlt /> Загрузить ТТН</p>
            <input
              type="file"
              id="ttnInput"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFilesSelect(setTtnFiles)}
              style={{ display: "none" }}
            />
          </div>
          <div className={styles.fileList}>
            {ttnFiles.map((file, i) => (
              <div key={i} className={styles.fileItem}>
                <FaFileAlt className={styles.fileIcon} />
                <span>{file.name}</span>
                <FaTrashAlt className={styles.deleteIcon} onClick={() => removeFile(setTtnFiles, i)} />
              </div>
            ))}
          </div>

          {/* Паспорт качества */}
          <div
            className={styles.dragDrop}
            onDrop={handleFilesDrop(setPassportFiles)}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("passportInput").click()}
          >
            <p><FaFileAlt /> Загрузить паспорт качества (необязательно)</p>
            <input
              type="file"
              id="passportInput"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFilesSelect(setPassportFiles)}
              style={{ display: "none" }}
            />
          </div>
          <div className={styles.fileList}>
            {passportFiles.map((file, i) => (
              <div key={i} className={styles.fileItem}>
                <FaFileAlt className={styles.fileIcon} />
                <span>{file.name}</span>
                <FaTrashAlt className={styles.deleteIcon} onClick={() => removeFile(setPassportFiles, i)} />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      number: 3,
      title: "Данные материала",
      description: "Укажите данные по поступившему материалу.",
      content: (
        <>
          <div className={styles.inputGroup}>
            <label>Наименование *</label>
            <input type="text" placeholder="Например: Цемент М500" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Номер ТТН *</label>
            <TTNInput 
              ttnList={["TTN-25.10.2025-001","TTN-25.10.2025-002","TTN-25.10.2025-003"]}
              value={ttnNumber}
              setValue={setTtnNumber}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Объем / Вес *</label>
              <div className={styles.row}>
                <input type="number" placeholder="0" required />
                <Select
                  options={volumeOptions}
                  placeholder="Единица"
                  value={selectedVolume}
                  onChange={setSelectedVolume}
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
                value={deliveryDate}
                onAccept={setDeliveryDate}
                className={styles.datePicker}
                required
              />
            </div>
          </div>
        </>
      ),
    },
    {
      number: 4,
      title: "Подтверждение",
      description: "Проверьте данные и оставьте комментарий (по необходимости).",
      content: (
        <div className={styles.content}>
          <textarea
            placeholder="Введите комментарий..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textarea}
          />
          <div className={styles.actions}>
            <button className={styles.button} onClick={clearForm}>Очистить форму</button>
            <button className={styles.button} onClick={saveDraft}><FaSave /> Сохранить черновик</button>
            <button className={styles.button}>Готово</button>
          </div>
        </div>
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

export default ProRabControl;
