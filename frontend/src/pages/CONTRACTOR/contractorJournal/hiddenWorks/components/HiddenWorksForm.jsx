import React, { useState, useMemo } from 'react';
import Navbar from '../../../../Profile/components/NavBarProfile';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../../Profile/styles/select-styles.scss'; 
import styles from '../styles/hiddenWorks.module.scss';

const HiddenWorks = () => {
  const [works, setWorks] = useState([]);
  const [formData, setFormData] = useState({
    workType: '',
    workCode: '',
    workDate: null,
    volume: '',
    unit: '',
    contractor: '',
    responsiblePerson: '',
    description: '',
    status: 'completed'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeView, setActiveView] = useState('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Конфигурация
  const workTypes = {
    earthworks: 'Земляные работы',
    foundation: 'Устройство фундамента',
    waterproofing: 'Гидроизоляция',
    reinforcement: 'Армирование',
    communications: 'Устройство коммуникаций',
    masonry: 'Кирпичная кладка',
    concrete: 'Бетонные работы'
  };

  const workTypeOptions = [
    { value: '', label: 'Выберите вид работ' },
    ...Object.entries(workTypes).map(([value, label]) => ({ value, label }))
  ];

  const unitOptions = [
    { value: '', label: 'ед.' },
    { value: 'm3', label: 'м³' },
    { value: 'm2', label: 'м²' },
    { value: 'm', label: 'м.п.' },
    { value: 'pcs', label: 'шт.' }
  ];

  const filterOptions = [
    { value: 'all', label: 'Все работы' },
    ...Object.entries(workTypes).map(([value, label]) => ({ value, label }))
  ];

  // Статистика
  const stats = useMemo(() => {
    const total = works.length;
    const thisMonth = works.filter(work => {
      const workDate = new Date(work.workDate);
      return workDate >= startOfMonth(new Date()) && workDate <= endOfMonth(new Date());
    }).length;
    
    return { total, thisMonth };
  }, [works]);

  // Обработчики
  const addWork = async () => {
    if (!formData.workType || !formData.workDate) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newWork = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      workTypeLabel: workTypes[formData.workType],
      workDate: format(formData.workDate, 'yyyy-MM-dd')
    };
    
    setWorks([newWork, ...works]);
    resetForm();
    setIsSubmitting(false);
    setActiveView('list');
  };

  const resetForm = () => {
    setFormData({
      workType: '', 
      workCode: '', 
      workDate: null, 
      volume: '', 
      unit: '', 
      contractor: '',
      responsiblePerson: '', 
      description: '', 
      status: 'completed'
    });
  };

  const deleteWork = (id) => {
    setWorks(works.filter(work => work.id !== id));
  };

  // Фильтрация
  const filteredWorks = works.filter(work => {
    const matchesSearch = work.workTypeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.workCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.contractor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || work.workType === filterType;
    return matchesSearch && matchesFilter;
  });

  const isFormValid = formData.workType && formData.workDate;

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        {/* Заголовок и навигация */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Скрытые работы</h1>
            <p className={styles.subtitle}>Фиксация актов выполненных работ</p>
          </div>
          
          <div className={styles.viewTabs}>
            <button 
              className={`${styles.viewTab} ${activeView === 'form' ? styles.viewTabActive : ''}`}
              onClick={() => setActiveView('form')}
            >
              <span className={styles.tabIcon}>+</span>
              Новая запись
            </button>
            <button 
              className={`${styles.viewTab} ${activeView === 'list' ? styles.viewTabActive : ''}`}
              onClick={() => setActiveView('list')}
            >
              <span className={styles.tabIcon}><svg width="27" height="27" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.625 10.7917V7.70834H7.70833V6.16668C7.70833 5.34893 8.03318 4.56467 8.61142 3.98643C9.18966 3.40819 9.97392 3.08334 10.7917 3.08334H20.0417V13.875L23.8958 11.5625L27.75 13.875V3.08334H29.2917C30.9104 3.08334 32.375 4.54793 32.375 6.16668V30.8333C32.375 32.4521 30.9104 33.9167 29.2917 33.9167H10.7917C9.17292 33.9167 7.70833 32.4521 7.70833 30.8333V29.2917H4.625V26.2083H7.70833V20.0417H4.625V16.9583H7.70833V10.7917H4.625ZM10.7917 16.9583H7.70833V20.0417H10.7917V16.9583ZM10.7917 10.7917V7.70834H7.70833V10.7917H10.7917ZM10.7917 29.2917V26.2083H7.70833V29.2917H10.7917Z"
            fill="#486284"
          />
        </svg></span>
              Журнал
              {works.length > 0 && <span className={styles.tabBadge}>{works.length}</span>}
            </button>
          </div>
        </div>

        {/* Статистика */}
        {works.length > 0 && (
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
              <div className={styles.statValue}>
                {Math.round((stats.thisMonth / stats.total) * 100) || 0}%
              </div>
              <div className={styles.statLabel}>Выполнено в месяце</div>
            </div>
          </div>
        )}

        {/* Основной контент */}
        <div className={styles.mainContent}>
          {activeView === 'form' ? (
            <FormView 
              formData={formData}
              setFormData={setFormData}
              workTypeOptions={workTypeOptions}
              unitOptions={unitOptions}
              isFormValid={isFormValid}
              isSubmitting={isSubmitting}
              onAddWork={addWork}
            />
          ) : (
            <ListView 
              works={works}
              filteredWorks={filteredWorks}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              filterOptions={filterOptions}
              onDeleteWork={deleteWork}
              onSwitchToForm={() => setActiveView('form')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент формы
const FormView = ({ 
  formData, 
  setFormData, 
  workTypeOptions, 
  unitOptions, 
  isFormValid, 
  isSubmitting, 
  onAddWork 
}) => (
  <div className={styles.formContainer}>
    <div className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <h3>Новый акт</h3>
        <div className={`${styles.formIndicator} ${isFormValid ? styles.formIndicatorValid : ''}`}>
          {isFormValid ? ' Готово к сохранению' : 'Заполните обязательные поля'}
        </div>
      </div>
      
      <div className={styles.form}>
        <div className={styles.formRow}>
          <FormGroup 
            label="Вид работ *"
            error={!formData.workType}
            errorText="Обязательное поле"
          >
            <Select
              options={workTypeOptions}
              value={workTypeOptions.find(opt => opt.value === formData.workType)}
              onChange={(selected) => setFormData({...formData, workType: selected.value})}
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable={false}
            />
          </FormGroup>
          
          <FormGroup label="Шифр работы">
            <input 
              type="text" 
              placeholder="Код по проекту" 
              value={formData.workCode} 
              onChange={(e) => setFormData({...formData, workCode: e.target.value})} 
            />
          </FormGroup>
        </div>

        <div className={styles.formRow}>
          <FormGroup 
            label="Дата выполнения *"
            error={!formData.workDate}
            errorText="Обязательное поле"
          >
            <DatePicker
              selected={formData.workDate}
              onChange={(date) => setFormData({...formData, workDate: date})}
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
          
          <FormGroup label="Объем работ">
            <div className={styles.volumeInput}>
              <input 
                type="number" 
                placeholder="0" 
                value={formData.volume} 
                onChange={(e) => setFormData({...formData, volume: e.target.value})} 
              />
              <Select
                options={unitOptions}
                value={unitOptions.find(opt => opt.value === formData.unit)}
                onChange={(selected) => setFormData({...formData, unit: selected.value})}
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable={false}
              />
            </div>
          </FormGroup>
        </div>

        <div className={styles.formRow}>
          <FormGroup label="Подрядная организация">
            <input 
              type="text" 
              placeholder="ООО СтройГрупп" 
              value={formData.contractor} 
              onChange={(e) => setFormData({...formData, contractor: e.target.value})} 
            />
          </FormGroup>
          
          <FormGroup label="Ответственный исполнитель">
            <input 
              type="text" 
              placeholder="ФИО" 
              value={formData.responsiblePerson} 
              onChange={(e) => setFormData({...formData, responsiblePerson: e.target.value})} 
            />
          </FormGroup>
        </div>

        <FormGroup label="Описание работ">
          <textarea 
            rows="3" 
            placeholder="Подробное описание технологии, материалов, условий выполнения..."
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
        </FormGroup>

        <button 
          type="button" 
          className={`${styles.addButton} ${isSubmitting ? styles.addButtonLoading : ''}`}
          onClick={onAddWork}
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

// Компонент списка
const ListView = ({ 
  works, 
  filteredWorks, 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType, 
  filterOptions, 
  onDeleteWork, 
  onSwitchToForm 
}) => (
  <div className={styles.listContainer}>
    <div className={styles.listSection}>
      <div className={styles.listHeader}>
        <div className={styles.listTitle}>
          <h3>Зафиксированные акты</h3>
          <span className={styles.worksCount}>{filteredWorks.length} из {works.length}</span>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Поиск..." 
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

      {filteredWorks.length === 0 ? (
        <EmptyState onSwitchToForm={onSwitchToForm} />
      ) : (
        <div className={styles.worksList}>
          {filteredWorks.map(work => (
            <WorkItem key={work.id} work={work} onDelete={onDeleteWork} />
          ))}
        </div>
      )}
    </div>
  </div>
);

// Компонент элемента работы
const WorkItem = ({ work, onDelete }) => (
  <div className={styles.workItem}>
    <div className={styles.workHeader}>
      <div className={styles.workMainInfo}>
        <span className={styles.workType}>{work.workTypeLabel}</span>
        <span className={styles.workDate}>
          {work.workDate ? format(new Date(work.workDate), 'dd.MM.yyyy') : 'Нет даты'}
        </span>
      </div>
      <button 
        className={styles.deleteButton}
        onClick={() => onDelete(work.id)}
        title="Удалить запись"
      >
        ×
      </button>
    </div>
    
    <div className={styles.workDetails}>
      {work.workCode && (
        <DetailItem label="Шифр" value={work.workCode} />
      )}
      
      {work.volume && (
        <DetailItem label="Объем" value={`${work.volume} ${work.unit}`} />
      )}
      
      {work.contractor && (
        <DetailItem label="Подрядчик" value={work.contractor} />
      )}
      
      {work.responsiblePerson && (
        <DetailItem label="Исполнитель" value={work.responsiblePerson} />
      )}
    </div>
    
    {work.description && (
      <div className={styles.workDescription}>
        <p>{work.description}</p>
      </div>
    )}
    
    <div className={styles.workFooter}>
      <span className={styles.timestamp}>
        Добавлено: {new Date(work.timestamp).toLocaleString('ru-RU')}
      </span>
    </div>
  </div>
);

// Вспомогательные компоненты
const FormGroup = ({ label, children, error, errorText }) => (
  <div className={styles.formGroup}>
    <label>{label}</label>
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
      <div className={styles.emptyIcon}> <svg width="67" height="67" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.625 10.7917V7.70834H7.70833V6.16668C7.70833 5.34893 8.03318 4.56467 8.61142 3.98643C9.18966 3.40819 9.97392 3.08334 10.7917 3.08334H20.0417V13.875L23.8958 11.5625L27.75 13.875V3.08334H29.2917C30.9104 3.08334 32.375 4.54793 32.375 6.16668V30.8333C32.375 32.4521 30.9104 33.9167 29.2917 33.9167H10.7917C9.17292 33.9167 7.70833 32.4521 7.70833 30.8333V29.2917H4.625V26.2083H7.70833V20.0417H4.625V16.9583H7.70833V10.7917H4.625ZM10.7917 16.9583H7.70833V20.0417H10.7917V16.9583ZM10.7917 10.7917V7.70834H7.70833V10.7917H10.7917ZM10.7917 29.2917V26.2083H7.70833V29.2917H10.7917Z"
            fill="#486284"
          />
        </svg></div>
    </div>
    <h4>Нет записей</h4>
    <p>Добавьте первый акт работ</p>
    <button 
      className={styles.emptyAction}
      onClick={onSwitchToForm}
    >
      Создать запись
    </button>
  </div>
);

export default HiddenWorks;