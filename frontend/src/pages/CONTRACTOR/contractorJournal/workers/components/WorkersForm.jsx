import React, { useState, useMemo } from 'react';
import Navbar from '../../../../Profile/components/NavBarProfile';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../../Profile/styles/select-styles.scss'; 
import styles from '../styles/workers.module.scss';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    specialty: '',
    workDate: null,
    startTime: '',
    endTime: '',
    workDescription: '',
    workVolume: '',
    unit: '',
    contractor: '',
    notes: '',
    location: '',
    coordinates: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeView, setActiveView] = useState('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Конфигурация согласно ТЗ
  const positions = {
    carpenter: 'Плотник',
    mason: 'Каменщик', 
    welder: 'Сварщик',
    electrician: 'Электрик',
    plumber: 'Сантехник',
    finisher: 'Отделочник',
    laborer: 'Разнорабочий',
    foreman: 'Прораб',
    engineer: 'Инженер'
  };

  const specialties = {
    general: 'Общие работы',
    concrete: 'Бетонные работы',
    reinforcement: 'Арматурные работы',
    masonry: 'Кирпичная кладка',
    finishing: 'Отделочные работы',
    electrical: 'Электромонтажные работы',
    plumbing: 'Сантехнические работы',
    hvac: 'Вентиляция и кондиционирование'
  };

  const unitOptions = [
    { value: 'm3', label: 'м³' },
    { value: 'm2', label: 'м²' },
    { value: 'm', label: 'м.п.' },
    { value: 'pcs', label: 'шт.' },
    { value: 'hours', label: 'часы' }
  ];

  const positionOptions = [
    { value: '', label: 'Выберите должность' },
    ...Object.entries(positions).map(([value, label]) => ({ value, label }))
  ];

  const specialtyOptions = [
    { value: '', label: 'Выберите специализацию' },
    ...Object.entries(specialties).map(([value, label]) => ({ value, label }))
  ];

  const filterOptions = [
    { value: 'all', label: 'Все рабочие' },
    ...Object.entries(positions).map(([value, label]) => ({ value, label }))
  ];

  // Получение геопозиции согласно ТЗ
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setFormData(prev => ({ 
            ...prev, 
            coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
          }));
        },
        (error) => console.error('Ошибка получения геопозиции:', error)
      );
    }
  };

  // Статистика
  const stats = useMemo(() => ({
    total: workers.length,
    thisMonth: workers.filter(worker => {
      const workDate = new Date(worker.workDate);
      return workDate >= startOfMonth(new Date()) && workDate <= endOfMonth(new Date());
    }).length,
    today: workers.filter(worker => {
      const workDate = new Date(worker.workDate);
      return workDate.toDateString() === new Date().toDateString();
    }).length
  }), [workers]);

  // Обработчики
  const addWorker = async () => {
    if (!formData.fullName || !formData.position || !formData.workDate) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newWorker = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      positionLabel: positions[formData.position],
      specialtyLabel: specialties[formData.specialty],
      workDate: format(formData.workDate, 'yyyy-MM-dd')
    };
    
    setWorkers([newWorker, ...workers]);
    resetForm();
    setIsSubmitting(false);
    setActiveView('list');
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      position: '',
      specialty: '',
      workDate: null,
      startTime: '',
      endTime: '',
      workDescription: '',
      workVolume: '',
      unit: '',
      contractor: '',
      notes: '',
      location: '',
      coordinates: ''
    });
  };

  const deleteWorker = (id) => setWorkers(workers.filter(worker => worker.id !== id));

  // Фильтрация
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.positionLabel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.contractor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || worker.position === filterType;
    return matchesSearch && matchesFilter;
  });

  const isFormValid = formData.fullName && formData.position && formData.workDate;

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        {/* Header Component */}
        <Header 
          activeView={activeView}
          setActiveView={setActiveView}
          workersCount={workers.length}
        />
        
        {/* Statistics Component */}
        {workers.length > 0 && <Statistics stats={stats} positionsCount={Object.keys(positions).length} />}

        {/* Main Content */}
        <div className={styles.mainContent}>
          {activeView === 'form' ? (
            <FormView 
              formData={formData}
              setFormData={setFormData}
              positionOptions={positionOptions}
              specialtyOptions={specialtyOptions}
              unitOptions={unitOptions}
              isFormValid={isFormValid}
              isSubmitting={isSubmitting}
              onAddWorker={addWorker}
              onGetLocation={getCurrentLocation}
            />
          ) : (
            <ListView 
              workers={workers}
              filteredWorkers={filteredWorkers}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              filterOptions={filterOptions}
              onDeleteWorker={deleteWorker}
              onSwitchToForm={() => setActiveView('form')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ activeView, setActiveView, workersCount }) => (
  <div className={styles.header}>
    <div className={styles.titleSection}>
      <h1 className={styles.title}>Учет рабочих</h1>
      <p className={styles.subtitle}>Фиксация рабочего времени и выполненных работ</p>
    </div>
    
    <div className={styles.viewTabs}>
      <button 
        className={`${styles.viewTab} ${activeView === 'form' ? styles.viewTabActive : ''}`}
        onClick={() => setActiveView('form')}
      >
        <span className={styles.tabIcon}>+</span>
        Новый рабочий
      </button>
      <button 
        className={`${styles.viewTab} ${activeView === 'list' ? styles.viewTabActive : ''}`}
        onClick={() => setActiveView('list')}
      >
        <span className={styles.tabIcon}>
          <svg width="27" height="27" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.625 10.7917V7.70834H7.70833V6.16668C7.70833 5.34893 8.03318 4.56467 8.61142 3.98643C9.18966 3.40819 9.97392 3.08334 10.7917 3.08334H20.0417V13.875L23.8958 11.5625L27.75 13.875V3.08334H29.2917C30.9104 3.08334 32.375 4.54793 32.375 6.16668V30.8333C32.375 32.4521 30.9104 33.9167 29.2917 33.9167H10.7917C9.17292 33.9167 7.70833 32.4521 7.70833 30.8333V29.2917H4.625V26.2083H7.70833V20.0417H4.625V16.9583H7.70833V10.7917H4.625ZM10.7917 16.9583H7.70833V20.0417H10.7917V16.9583ZM10.7917 10.7917V7.70834H7.70833V10.7917H10.7917ZM10.7917 29.2917V26.2083H7.70833V29.2917H10.7917Z" fill="#486284"/>
          </svg>
        </span>
        Журнал
        {workersCount > 0 && <span className={styles.tabBadge}>{workersCount}</span>}
      </button>
    </div>
  </div>
);

// Statistics Component
const Statistics = ({ stats, positionsCount }) => (
  <div className={styles.statsGrid}>
    <div className={styles.statCard}>
      <div className={styles.statValue}>{stats.total}</div>
      <div className={styles.statLabel}>Всего записей</div>
    </div>
    <div className={styles.statCard}>
      <div className={styles.statValue}>{stats.thisMonth}</div>
      <div className={styles.statLabel}>За месяц</div>
    </div>
    <div className={styles.statCard}>
      <div className={styles.statValue}>{stats.today}</div>
      <div className={styles.statLabel}>Сегодня</div>
    </div>
    <div className={styles.statCard}>
      <div className={styles.statValue}>{positionsCount}</div>
      <div className={styles.statLabel}>Должностей</div>
    </div>
  </div>
);

// Form View Component
const FormView = ({ 
  formData, 
  setFormData, 
  positionOptions, 
  specialtyOptions, 
  unitOptions, 
  isFormValid, 
  isSubmitting, 
  onAddWorker,
  onGetLocation 
}) => {
  const updateFormData = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const calculateWorkDuration = () => {
    if (formData.startTime && formData.endTime) {
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
      const duration = (endHours + endMinutes/60) - (startHours + startMinutes/60);
      return duration > 0 ? duration.toFixed(1) : 0;
    }
    return 0;
  };

  const workDuration = calculateWorkDuration();

  return (
    <div className={styles.formContainer}>
      <div className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <h3>Учет рабочего времени</h3>
          <div className={`${styles.formIndicator} ${isFormValid ? styles.formIndicatorValid : ''}`}>
            {isFormValid ? <><CheckCircle size={16} /> Готово к сохранению</> : 'Заполните обязательные поля'}
          </div>
        </div>
        
        <div className={styles.form}>
          <div className={styles.formRow}>
            <FormGroup label="ФИО рабочего *" error={!formData.fullName} errorText="Обязательное поле">
              <input 
                type="text" 
                placeholder="Иванов Иван Иванович"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
              />
            </FormGroup>
            
            <FormGroup label="Должность *" error={!formData.position} errorText="Обязательное поле">
              <Select
                options={positionOptions}
                value={positionOptions.find(opt => opt.value === formData.position)}
                onChange={(selected) => updateFormData('position', selected.value)}
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable={false}
              />
            </FormGroup>
          </div>

          <div className={styles.formRow}>
            <FormGroup label="Специализация">
              <Select
                options={specialtyOptions}
                value={specialtyOptions.find(opt => opt.value === formData.specialty)}
                onChange={(selected) => updateFormData('specialty', selected.value)}
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable={false}
              />
            </FormGroup>
            
            <FormGroup label="Дата работы *" error={!formData.workDate} errorText="Обязательное поле">
              <DatePicker
                selected={formData.workDate}
                onChange={(date) => updateFormData('workDate', date)}
                locale={ru}
                dateFormat="dd.MM.yyyy"
                placeholderText="Выберите дату"
                className={`${styles.dateInput} ${!formData.workDate ? styles.error : ''}`}
                calendarClassName={styles.calendar}
                popperClassName={styles.popper}
                showPopperArrow={false}
                isClearable
                todayButton="Сегодня"
              />
            </FormGroup>
          </div>

          <div className={styles.formRow}>
            <FormGroup label="Время начала">
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => updateFormData('startTime', e.target.value)}
              />
            </FormGroup>
            
            <FormGroup label="Время окончания">
              <input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => updateFormData('endTime', e.target.value)}
              />
            </FormGroup>
          </div>

          {workDuration > 0 && (
            <div className={styles.durationInfo}>
              <AlertCircle size={16} /> 
              Продолжительность: <strong>{workDuration} часов</strong>
            </div>
          )}

          <div className={styles.formRow}>
            <FormGroup label="Объем работ">
              <div className={styles.volumeInput}>
                <input 
                  type="number" 
                  placeholder="0" 
                  step="0.1"
                  value={formData.workVolume}
                  onChange={(e) => updateFormData('workVolume', e.target.value)}
                />
                <Select
                  options={unitOptions}
                  value={unitOptions.find(opt => opt.value === formData.unit)}
                  onChange={(selected) => updateFormData('unit', selected.value)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isSearchable={false}
                />
              </div>
            </FormGroup>
            
            <FormGroup label="Подрядная организация">
              <input 
                type="text" 
                placeholder="ООО СтройГрупп"
                value={formData.contractor}
                onChange={(e) => updateFormData('contractor', e.target.value)}
              />
            </FormGroup>
          </div>

          <FormGroup label="Описание выполненных работ">
            <textarea 
              rows="3" 
              placeholder="Подробное описание выполненных работ, использованных материалов..."
              value={formData.workDescription}
              onChange={(e) => updateFormData('workDescription', e.target.value)}
            />
          </FormGroup>

          <div className={styles.formRow}>
            <FormGroup label="Местоположение">
              <input 
                type="text" 
                placeholder="Участок работы"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
              />
            </FormGroup>
            
            <FormGroup label="Координаты GPS">
              <div className={styles.coordinatesInput}>
                <input 
                  type="text" 
                  placeholder="Широта, долгота"
                  value={formData.coordinates}
                  onChange={(e) => updateFormData('coordinates', e.target.value)}
                  readOnly 
                />
                <button 
                  type="button" 
                  className={styles.locationButton}
                  onClick={onGetLocation}
                >
                  <MapPin size={16} />
                </button>
              </div>
            </FormGroup>
          </div>

          <FormGroup label="Примечания">
            <textarea 
              rows="2" 
              placeholder="Дополнительные заметки, замечания..."
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
            />
          </FormGroup>

          <button 
            type="button" 
            className={`${styles.addButton} ${isSubmitting ? styles.addButtonLoading : ''}`}
            onClick={onAddWorker}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner}></div>
                Сохранение...
              </>
            ) : (
              'Добавить в журнал'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// List View Component
const ListView = ({ 
  workers, 
  filteredWorkers, 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType, 
  filterOptions, 
  onDeleteWorker, 
  onSwitchToForm 
}) => (
  <div className={styles.listContainer}>
    <div className={styles.listSection}>
      <div className={styles.listHeader}>
        <div className={styles.listTitle}>
          <h3>Зафиксированные рабочие</h3>
          <span className={styles.workersCount}>{filteredWorkers.length} из {workers.length}</span>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Поиск по ФИО, должности..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterSelect}>
            <Select
              options={filterOptions}
              value={filterOptions.find(opt => opt.value === filterType)}
              onChange={(selected) => setFilterType(selected.value)}
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable={false}
            />
          </div>
        </div>
      </div>

      {filteredWorkers.length === 0 ? (
        <EmptyState onSwitchToForm={onSwitchToForm} />
      ) : (
        <div className={styles.workersList}>
          {filteredWorkers.map(worker => (
            <WorkerItem key={worker.id} worker={worker} onDelete={onDeleteWorker} />
          ))}
        </div>
      )}
    </div>
  </div>
);

// Worker Item Component
const WorkerItem = ({ worker, onDelete }) => (
  <div className={styles.workerItem}>
    <div className={styles.workerHeader}>
      <div className={styles.workerMainInfo}>
        <span className={styles.workerName}>{worker.fullName}</span>
        <span className={styles.workerPosition}>{worker.positionLabel}</span>
        <span className={styles.workDate}>
          {worker.workDate ? format(new Date(worker.workDate), 'dd.MM.yyyy') : 'Нет даты'}
          {worker.startTime && ` ${worker.startTime}`}
          {worker.endTime && ` - ${worker.endTime}`}
        </span>
      </div>
      <button 
        className={styles.deleteButton}
        onClick={() => onDelete(worker.id)}
        title="Удалить запись"
      >
        ×
      </button>
    </div>
    
    <div className={styles.workerDetails}>
      {worker.specialtyLabel && (
        <DetailItem label="Специализация" value={worker.specialtyLabel} />
      )}
      
      {worker.workVolume && (
        <DetailItem label="Объем" value={`${worker.workVolume} ${worker.unit}`} />
      )}
      
      {worker.contractor && (
        <DetailItem label="Подрядчик" value={worker.contractor} />
      )}
      
      {worker.location && (
        <DetailItem label="Местоположение" value={worker.location} />
      )}
      
      {worker.coordinates && (
        <DetailItem label="Координаты" value={worker.coordinates} />
      )}
    </div>
    
    {worker.workDescription && (
      <div className={styles.workDescription}>
        <p>{worker.workDescription}</p>
      </div>
    )}
    
    {worker.notes && (
      <div className={styles.workerNotes}>
        <DetailItem label="Примечания" value={worker.notes} />
      </div>
    )}
    
    <div className={styles.workerFooter}>
      <span className={styles.timestamp}>
        Добавлено: {new Date(worker.timestamp).toLocaleString('ru-RU')}
      </span>
    </div>
  </div>
);

// Helper Components
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
      <div className={styles.emptyIcon}>
        <svg width="67" height="67" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.625 10.7917V7.70834H7.70833V6.16668C7.70833 5.34893 8.03318 4.56467 8.61142 3.98643C9.18966 3.40819 9.97392 3.08334 10.7917 3.08334H20.0417V13.875L23.8958 11.5625L27.75 13.875V3.08334H29.2917C30.9104 3.08334 32.375 4.54793 32.375 6.16668V30.8333C32.375 32.4521 30.9104 33.9167 29.2917 33.9167H10.7917C9.17292 33.9167 7.70833 32.4521 7.70833 30.8333V29.2917H4.625V26.2083H7.70833V20.0417H4.625V16.9583H7.70833V10.7917H4.625ZM10.7917 16.9583H7.70833V20.0417H10.7917V16.9583ZM10.7917 10.7917V7.70834H7.70833V10.7917H10.7917ZM10.7917 29.2917V26.2083H7.70833V29.2917H10.7917Z" fill="#486284"/>
        </svg>
      </div>
    </div>
    <h4>Нет записей</h4>
    <p>Добавьте первого рабочего</p>
    <button 
      className={styles.emptyAction}
      onClick={onSwitchToForm}
    >
      Создать запись
    </button>
  </div>
);

export default Workers;