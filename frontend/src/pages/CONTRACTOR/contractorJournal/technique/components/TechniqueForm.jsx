import React, { useState, useMemo } from 'react';
import Navbar from '../../../../Profile/components/NavBarProfile';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import PhotoUpload from '../../../../../components/PhotoUpload/PhotoUpload';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../../Profile/styles/select-styles.scss'; 
import styles from '../styles/technique.module.scss';

const Technique = () => {
  const [works, setWorks] = useState([]);
  const [formData, setFormData] = useState({
    techniqueType: '', model: '', licensePlate: '', manufacturer: '', yearOfManufacture: '', serialNumber: '',
    workType: '', workDescription: '', workVolume: '', volumeUnit: 'м³', startDate: null, startTime: '',
    endDate: null, endTime: '', operator: '', operatorLicense: '', assistant: '', location: '', coordinates: '',
    photos: [], documents: [], technicalInspection: false, fuelLevel: '', mileage: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeView, setActiveView] = useState('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Конфигурация
  const techniqueTypes = {
    excavator: 'Экскаватор', crane: 'Кран', concrete_mixer: 'Бетономешалка', bulldozer: 'Бульдозер',
    loader: 'Погрузчик', grader: 'Грейдер', roller: 'Каток', truck: 'Самосвал', tractor: 'Трактор'
  };

  const workTypes = {
    earthworks: 'Земляные работы', excavation: 'Разработка котлована', loading: 'Погрузка материалов',
    unloading: 'Разгрузка материалов', compaction: 'Уплотнение грунта', concrete_works: 'Бетонные работы',
    lifting: 'Подъемные работы', transport: 'Транспортные работы'
  };

  const techniqueTypeOptions = [
    { value: '', label: 'Выберите тип техники' },
    ...Object.entries(techniqueTypes).map(([value, label]) => ({ value, label }))
  ];

  const workTypeOptions = [
    { value: '', label: 'Выберите вид работ' },
    ...Object.entries(workTypes).map(([value, label]) => ({ value, label }))
  ];

  const unitOptions = [
    { value: 'м³', label: 'м³' }, { value: 'т', label: 'т' }, { value: 'шт', label: 'шт' },
    { value: 'м', label: 'м' }, { value: 'м²', label: 'м²' }
  ];

  const fuelLevelOptions = [
    { value: '', label: 'Не указано' }, { value: 'full', label: 'Полный бак' }, { value: '3_4', label: '3/4 бака' },
    { value: '1_2', label: '1/2 бака' }, { value: '1_4', label: '1/4 бака' }, { value: 'empty', label: 'Пустой' }
  ];

  const filterOptions = [
    { value: 'all', label: 'Вся техника' },
    ...Object.entries(techniqueTypes).map(([value, label]) => ({ value, label }))
  ];

  // Получение геопозиции
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setFormData(prev => ({ ...prev, coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
        },
        (error) => console.error('Ошибка получения геопозиции:', error)
      );
    }
  };

  // Статистика
  const stats = useMemo(() => ({
    total: works.length,
    thisMonth: works.filter(work => {
      const workDate = new Date(work.startDate);
      return workDate >= startOfMonth(new Date()) && workDate <= endOfMonth(new Date());
    }).length
  }), [works]);

  // Обработчики
  const addWork = async () => {
    if (!formData.techniqueType || !formData.model || !formData.licensePlate || !formData.startDate) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newWork = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      techniqueTypeLabel: techniqueTypes[formData.techniqueType],
      workTypeLabel: workTypes[formData.workType],
      startDate: format(formData.startDate, 'yyyy-MM-dd'),
      endDate: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : null
    };
    
    setWorks([newWork, ...works]);
    resetForm();
    setIsSubmitting(false);
    setActiveView('list');
  };

  const resetForm = () => {
    setFormData({
      techniqueType: '', model: '', licensePlate: '', manufacturer: '', yearOfManufacture: '', serialNumber: '',
      workType: '', workDescription: '', workVolume: '', volumeUnit: 'м³', startDate: null, startTime: '',
      endDate: null, endTime: '', operator: '', operatorLicense: '', assistant: '', location: '', coordinates: '',
      photos: [], documents: [], technicalInspection: false, fuelLevel: '', mileage: ''
    });
  };

  const deleteWork = (id) => setWorks(works.filter(work => work.id !== id));
  const handlePhotosChange = (newPhotos) => setFormData(prev => ({ ...prev, photos: newPhotos }));
  const handleDocumentsChange = (files) => setFormData(prev => ({ ...prev, documents: [...prev.documents, ...Array.from(files)] }));
  const removeDocument = (index) => setFormData(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }));

  // Фильтрация
  const filteredWorks = works.filter(work => {
    const matchesSearch = work.techniqueTypeLabel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.operator?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || work.techniqueType === filterType;
    return matchesSearch && matchesFilter;
  });

  const isFormValid = formData.techniqueType && formData.model && formData.licensePlate && formData.startDate;

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Журнал строительной техники</h1>
            <p className={styles.subtitle}>Учет работы строительной техники на объекте</p>
          </div>
          
          <div className={styles.viewTabs}>
            <button className={`${styles.viewTab} ${activeView === 'form' ? styles.viewTabActive : ''}`} onClick={() => setActiveView('form')}>
              <span className={styles.tabIcon}>+</span> Новая запись
            </button>
            <button className={`${styles.viewTab} ${activeView === 'list' ? styles.viewTabActive : ''}`} onClick={() => setActiveView('list')}>
              <span className={styles.tabIcon}><svg width="27" height="27" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.625 10.7917V7.70834H7.70833V6.16668C7.70833 5.34893 8.03318 4.56467 8.61142 3.98643C9.18966 3.40819 9.97392 3.08334 10.7917 3.08334H20.0417V13.875L23.8958 11.5625L27.75 13.875V3.08334H29.2917C30.9104 3.08334 32.375 4.54793 32.375 6.16668V30.8333C32.375 32.4521 30.9104 33.9167 29.2917 33.9167H10.7917C9.17292 33.9167 7.70833 32.4521 7.70833 30.8333V29.2917H4.625V26.2083H7.70833V20.0417H4.625V16.9583H7.70833V10.7917H4.625ZM10.7917 16.9583H7.70833V20.0417H10.7917V16.9583ZM10.7917 10.7917V7.70834H7.70833V10.7917H10.7917ZM10.7917 29.2917V26.2083H7.70833V29.2917H10.7917Z"
            fill="#486284"
          />
        </svg></span> Журнал {works.length > 0 && <span className={styles.tabBadge}>{works.length}</span>}
            </button>
          </div>
        </div>

        {works.length > 0 && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}><div className={styles.statValue}>{stats.total}</div><div className={styles.statLabel}>Всего записей</div></div>
            <div className={styles.statCard}><div className={styles.statValue}>{stats.thisMonth}</div><div className={styles.statLabel}>За месяц</div></div>
            <div className={styles.statCard}><div className={styles.statValue}>{Object.keys(techniqueTypes).length}</div><div className={styles.statLabel}>Типов техники</div></div>
          </div>
        )}

        <div className={styles.mainContent}>
          {activeView === 'form' ? (
            <FormView 
              formData={formData} setFormData={setFormData} techniqueTypeOptions={techniqueTypeOptions} workTypeOptions={workTypeOptions}
              unitOptions={unitOptions} fuelLevelOptions={fuelLevelOptions} isFormValid={isFormValid} isSubmitting={isSubmitting}
              onAddWork={addWork} onGetLocation={getCurrentLocation} onPhotosChange={handlePhotosChange}
              onDocumentsChange={handleDocumentsChange} onRemoveDocument={removeDocument}
            />
          ) : (
            <ListView 
              works={works} filteredWorks={filteredWorks} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              filterType={filterType} setFilterType={setFilterType} filterOptions={filterOptions} fuelLevelOptions={fuelLevelOptions}
              onDeleteWork={deleteWork} onSwitchToForm={() => setActiveView('form')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент формы
const FormView = ({ formData, setFormData, techniqueTypeOptions, workTypeOptions, unitOptions, fuelLevelOptions, isFormValid, isSubmitting, onAddWork, onGetLocation, onPhotosChange, onDocumentsChange, onRemoveDocument }) => {
  const updateFormData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const calculateWorkDuration = () => {
    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const start = new Date(`${format(formData.startDate, 'yyyy-MM-dd')}T${formData.startTime}`);
      const end = new Date(`${format(formData.endDate, 'yyyy-MM-dd')}T${formData.endTime}`);
      const duration = (end - start) / (1000 * 60 * 60);
      return duration > 0 ? duration.toFixed(1) : 0;
    }
    return 0;
  };

  const workDuration = calculateWorkDuration();

  return (
    <div className={styles.formContainer}>
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h3>Учет строительной техники</h3>
          <div className={`${styles.formIndicator} ${isFormValid ? styles.formIndicatorValid : ''}`}>
            {isFormValid ? <><CheckCircle size={16} /> Готово к сохранению</> : 'Заполните обязательные поля'}
          </div>
        </div>
        
        <div className={styles.form}>
          <div className={styles.formRow}>
            <FormGroup label="Тип техники *" error={!formData.techniqueType} errorText="Обязательное поле">
              <Select options={techniqueTypeOptions} value={techniqueTypeOptions.find(opt => opt.value === formData.techniqueType)}
                onChange={(selected) => updateFormData('techniqueType', selected.value)} className="react-select-container" classNamePrefix="react-select" isSearchable={false} />
            </FormGroup>
            <FormGroup label="Модель *" error={!formData.model} errorText="Обязательное поле">
              <input type="text" placeholder="CAT 320D" value={formData.model} onChange={(e) => updateFormData('model', e.target.value)} />
            </FormGroup>
          </div>

          <div className={styles.formRow}>
            <FormGroup label="Госномер *" error={!formData.licensePlate} errorText="Обязательное поле">
              <input type="text" placeholder="А123БВ" value={formData.licensePlate} onChange={(e) => updateFormData('licensePlate', e.target.value)} />
            </FormGroup>
            <FormGroup label="Производитель">
              <input type="text" placeholder="Caterpillar" value={formData.manufacturer} onChange={(e) => updateFormData('manufacturer', e.target.value)} />
            </FormGroup>
          </div>

          <div className={styles.formRow}>
            <FormGroup label="Год выпуска">
              <input type="number" placeholder="2020" min="1990" max={new Date().getFullYear()} value={formData.yearOfManufacture} onChange={(e) => updateFormData('yearOfManufacture', e.target.value)} />
            </FormGroup>
            <FormGroup label="Заводской номер">
              <input type="text" placeholder="Серийный номер" value={formData.serialNumber} onChange={(e) => updateFormData('serialNumber', e.target.value)} />
            </FormGroup>
          </div>

          <div className={styles.formRow}>
            <FormGroup label="Вид работ">
              <Select options={workTypeOptions} value={workTypeOptions.find(opt => opt.value === formData.workType)}
                onChange={(selected) => updateFormData('workType', selected.value)} className="react-select-container" classNamePrefix="react-select" isSearchable={false} />
            </FormGroup>
            <FormGroup label="Объем работ">
              <div className={styles.volumeInput}>
                <input type="number" placeholder="0" step="0.1" value={formData.workVolume} onChange={(e) => updateFormData('workVolume', e.target.value)} />
                <Select options={unitOptions} value={unitOptions.find(opt => opt.value === formData.volumeUnit)}
                  onChange={(selected) => updateFormData('volumeUnit', selected.value)} className="react-select-container" classNamePrefix="react-select" isSearchable={false} />
              </div>
            </FormGroup>
          </div>

          <FormGroup label="Описание работ">
            <textarea rows="3" placeholder="Подробное описание выполняемых работ..." value={formData.workDescription} onChange={(e) => updateFormData('workDescription', e.target.value)} />
          </FormGroup>

          <div className={styles.formRow}>
            <FormGroup label="Дата начала *" error={!formData.startDate} errorText="Обязательное поле">
              <DatePicker selected={formData.startDate} onChange={(date) => updateFormData('startDate', date)} locale={ru} dateFormat="dd.MM.yyyy"
                placeholderText="Выберите дату" className={`${styles.dateInput} ${!formData.startDate ? styles.error : ''}`} calendarClassName={styles.calendar}
                popperClassName={styles.popper} showPopperArrow={false} isClearable todayButton="Сегодня" />
            </FormGroup>
            <FormGroup label="Время начала">
              <input type="time" value={formData.startTime} onChange={(e) => updateFormData('startTime', e.target.value)} />
            </FormGroup>
          </div>

          <div className={styles.formRow}>
            <FormGroup label="Дата окончания">
              <DatePicker selected={formData.endDate} onChange={(date) => updateFormData('endDate', date)} locale={ru} dateFormat="dd.MM.yyyy"
                placeholderText="Выберите дату" className={styles.dateInput} calendarClassName={styles.calendar} popperClassName={styles.popper}
                showPopperArrow={false} isClearable todayButton="Сегодня" />
            </FormGroup>
            <FormGroup label="Время окончания">
              <input type="time" value={formData.endTime} onChange={(e) => updateFormData('endTime', e.target.value)} />
            </FormGroup>
          </div>

          {workDuration > 0 && (
            <div className={styles.durationInfo}><AlertCircle size={16} /> Продолжительность: <strong>{workDuration} часов</strong></div>
          )}

          <div className={styles.formRow}>
            <FormGroup label="Оператор/Водитель">
              <input type="text" placeholder="ФИО оператора" value={formData.operator} onChange={(e) => updateFormData('operator', e.target.value)} />
            </FormGroup>
            <FormGroup label="№ удостоверения">
              <input type="text" placeholder="Номер удостоверения" value={formData.operatorLicense} onChange={(e) => updateFormData('operatorLicense', e.target.value)} />
            </FormGroup>
          </div>

          <FormGroup label="Помощник/Слесарь">
            <input type="text" placeholder="ФИО помощника" value={formData.assistant} onChange={(e) => updateFormData('assistant', e.target.value)} />
          </FormGroup>

          <div className={styles.formRow}>
            <FormGroup label="Местоположение">
              <input type="text" placeholder="Участок работы" value={formData.location} onChange={(e) => updateFormData('location', e.target.value)} />
            </FormGroup>
            <FormGroup label="Координаты GPS">
              <div className={styles.coordinatesInput}>
                <input type="text" placeholder="Широта, долгота" value={formData.coordinates} onChange={(e) => updateFormData('coordinates', e.target.value)} readOnly />
                <button type="button" className={styles.locationButton} onClick={onGetLocation}><MapPin size={16} /></button>
              </div>
            </FormGroup>
          </div>

          <div className={styles.formRow}>
            <FormGroup label="Уровень топлива">
              <Select options={fuelLevelOptions} value={fuelLevelOptions.find(opt => opt.value === formData.fuelLevel)}
                onChange={(selected) => updateFormData('fuelLevel', selected.value)} className="react-select-container" classNamePrefix="react-select" isSearchable={false} />
            </FormGroup>
            <FormGroup label="Пробег/Моточасы">
              <input type="number" placeholder="На момент начала работ" value={formData.mileage} onChange={(e) => updateFormData('mileage', e.target.value)} />
            </FormGroup>
          </div>

          <FormGroup>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={formData.technicalInspection} onChange={(e) => updateFormData('technicalInspection', e.target.checked)} />
              Техника прошла предварительный осмотр
            </label>
          </FormGroup>

          <FormGroup label="Фотографии техники и работ">
            <PhotoUpload photos={formData.photos} onPhotosChange={onPhotosChange} maxPhotos={10} />
          </FormGroup>

          <div className={styles.fileUploadSection}>
            <label>Документы</label>
            <div className={styles.uploadButtons}>
              <label className={styles.uploadButton}>
                <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => onDocumentsChange(e.target.files)} style={{ display: 'none' }} />
                Загрузить документы
              </label>
            </div>
            {formData.documents.length > 0 && (
              <div className={styles.fileList}>
                {formData.documents.map((doc, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span>{doc.name}</span>
                    <button type="button" onClick={() => onRemoveDocument(index)} className={styles.removeFile}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="button" className={`${styles.addButton} ${isSubmitting ? styles.addButtonLoading : ''}`} onClick={onAddWork} disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? <><div className={styles.spinner}></div> Сохранение...</> : 'Добавить в журнал'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Компонент списка
const ListView = ({ works, filteredWorks, searchTerm, setSearchTerm, filterType, setFilterType, filterOptions, fuelLevelOptions, onDeleteWork, onSwitchToForm }) => (
  <div className={styles.listContainer}>
    <div className={styles.listSection}>
      <div className={styles.listHeader}>
        <div className={styles.listTitle}>
          <h3>Зафиксированная техника</h3>
          <span className={styles.worksCount}>{filteredWorks.length} из {works.length}</span>
        </div>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input type="text" placeholder="Поиск по модели, госномеру..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className={styles.filterSelect}>
            <Select options={filterOptions} value={filterOptions.find(opt => opt.value === filterType)}
              onChange={(selected) => setFilterType(selected.value)} className="react-select-container" classNamePrefix="react-select" isSearchable={false} />
          </div>
        </div>
      </div>

      {filteredWorks.length === 0 ? (
        <EmptyState onSwitchToForm={onSwitchToForm} />
      ) : (
        <div className={styles.worksList}>
          {filteredWorks.map(work => (
            <WorkItem key={work.id} work={work} fuelLevelOptions={fuelLevelOptions} onDelete={onDeleteWork} />
          ))}
        </div>
      )}
    </div>
  </div>
);

// Компонент элемента работы
const WorkItem = ({ work, fuelLevelOptions, onDelete }) => {
  const getFuelLevelLabel = (value) => fuelLevelOptions.find(opt => opt.value === value)?.label || value;

  return (
    <div className={styles.workItem}>
      <div className={styles.workHeader}>
        <div className={styles.workMainInfo}>
          <span className={styles.workType}>{work.techniqueTypeLabel} - {work.model}</span>
          <span className={styles.workDate}>
            {work.startDate ? format(new Date(work.startDate), 'dd.MM.yyyy') : 'Нет даты'}
            {work.startTime && ` ${work.startTime}`}
            {work.endDate && ` - ${format(new Date(work.endDate), 'dd.MM.yyyy')}`}
            {work.endTime && ` ${work.endTime}`}
          </span>
        </div>
        <button className={styles.deleteButton} onClick={() => onDelete(work.id)} title="Удалить запись">×</button>
      </div>
      
      <div className={styles.workDetails}>
        <DetailItem label="Госномер" value={work.licensePlate} />
        {work.manufacturer && <DetailItem label="Производитель" value={work.manufacturer} />}
        {work.workTypeLabel && <DetailItem label="Вид работ" value={work.workTypeLabel} />}
        {work.operator && <DetailItem label="Оператор" value={work.operator} />}
        {work.workVolume && <DetailItem label="Объем" value={`${work.workVolume} ${work.volumeUnit}`} />}
        {work.location && <DetailItem label="Местоположение" value={work.location} />}
        {work.coordinates && <DetailItem label="Координаты" value={work.coordinates} />}
        {work.fuelLevel && <DetailItem label="Топливо" value={getFuelLevelLabel(work.fuelLevel)} />}
        {work.mileage && <DetailItem label="Пробег/Моточасы" value={work.mileage} />}
        {work.technicalInspection && <DetailItem label="Осмотр" value="Пройден" />}
        {work.assistant && <DetailItem label="Помощник" value={work.assistant} />}
        {work.operatorLicense && <DetailItem label="Удостоверение" value={work.operatorLicense} />}
        {work.yearOfManufacture && <DetailItem label="Год выпуска" value={work.yearOfManufacture} />}
        {work.serialNumber && <DetailItem label="Заводской номер" value={work.serialNumber} />}
      </div>
      
      {work.workDescription && (
        <div className={styles.workDescription}><p>{work.workDescription}</p></div>
      )}

      {work.photos?.length > 0 && (
        <div className={styles.workPhotos}><span className={styles.detailLabel}>Фотографии: {work.photos.length} шт.</span></div>
      )}

      {work.documents?.length > 0 && (
        <div className={styles.workDocuments}><span className={styles.detailLabel}>Документы: {work.documents.length} шт.</span></div>
      )}
      
      <div className={styles.workFooter}>
        <span className={styles.timestamp}>Добавлено: {new Date(work.timestamp).toLocaleString('ru-RU')}</span>
      </div>
    </div>
  );
};

// Вспомогательные компоненты
const FormGroup = ({ label, children, error, errorText }) => (
  <div className={styles.formGroup}>
    {label && <label>{label}</label>}
    {children}
    {error && <span className={styles.errorText}>{errorText}</span>}
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className={styles.detailItem}>
    <span className={styles.detailLabel}>{label}:</span>
    <span className={styles.detailValue}>{value}</span>
  </div>
);

const EmptyState = ({ onSwitchToForm }) => (
  <div className={styles.emptyState}>
    <div className={styles.emptyAnimation}>
      <div className={styles.emptyIcon}><svg width="67" height="67" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.625 10.7917V7.70834H7.70833V6.16668C7.70833 5.34893 8.03318 4.56467 8.61142 3.98643C9.18966 3.40819 9.97392 3.08334 10.7917 3.08334H20.0417V13.875L23.8958 11.5625L27.75 13.875V3.08334H29.2917C30.9104 3.08334 32.375 4.54793 32.375 6.16668V30.8333C32.375 32.4521 30.9104 33.9167 29.2917 33.9167H10.7917C9.17292 33.9167 7.70833 32.4521 7.70833 30.8333V29.2917H4.625V26.2083H7.70833V20.0417H4.625V16.9583H7.70833V10.7917H4.625ZM10.7917 16.9583H7.70833V20.0417H10.7917V16.9583ZM10.7917 10.7917V7.70834H7.70833V10.7917H10.7917ZM10.7917 29.2917V26.2083H7.70833V29.2917H10.7917Z"
            fill="#486284"
          />
        </svg></div>
    </div>
    <h4>Нет записей</h4>
    <p>Добавьте первую запись о технике</p>
    <button className={styles.emptyAction} onClick={onSwitchToForm}>Создать запись</button>
  </div>
);

export default Technique;