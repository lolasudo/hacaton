import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaSearchPlus, FaSearchMinus, FaUndo, FaRedo, FaFilePdf, FaImage, FaExpand, FaCompress, FaCalendarAlt, FaTasks } from "react-icons/fa";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import styles from "../styles/GanttChart.module.scss";

const GanttPro = () => {
  const ganttContainer = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ text: "", start_date: "", duration: "" });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState("weeks");
  const [taskCount, setTaskCount] = useState(0);

  // === Инициализация Gantt ===
  useEffect(() => {
    if (!ganttContainer.current) return;

    // Базовая конфигурация
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    gantt.config.date_format = "%d.%m.%Y";
    
    // Настройки для предотвращения обрезания
    gantt.config.autofit = true;
    gantt.config.fit_tasks = true;
    gantt.config.show_progress = true;
    
    // Размеры
    gantt.config.scale_height = 60;
    gantt.config.row_height = 40;
    gantt.config.bar_height = 25;
    gantt.config.grid_width = 350;
    
    // Стилизация
    gantt.config.grid_resize = true;
    gantt.config.drag_progress = true;
    gantt.config.drag_links = true;
    
    // Русская локализация
    gantt.i18n.setLocale("ru");
    
    // Колонки
    gantt.config.columns = [
      { name: "text", label: "Задача", width: 250, tree: true },
      { name: "start_date", label: "Начало", width: 100, align: "center" },
      { name: "end_date", label: "Конец", width: 100, align: "center" },
      { name: "duration", label: "Дней", width: 70, align: "center" },
      { name: "progress", label: "Прогресс", width: 80, align: "center", template: (obj) => `${Math.round(obj.progress * 100)}%` }
    ];

    // Инициализация
    gantt.init(ganttContainer.current);

    // Загрузка тестовых данных
    const initialData = [
      { id: 1, text: "Подготовка площадки", start_date: "2024-03-01", duration: 5, progress: 1 },
      { id: 2, text: "Земляные работы", start_date: "2024-03-05", duration: 10, progress: 0.8 },
      { id: 3, text: "Фундамент", start_date: "2024-03-12", duration: 15, progress: 0.3 },
      { id: 4, text: "Стены", start_date: "2024-03-25", duration: 20, progress: 0 },
      { id: 5, text: "Кровля", start_date: "2024-04-15", duration: 12, progress: 0 },
      { id: 6, text: "Отделка", start_date: "2024-04-25", duration: 25, progress: 0 },
    ];

    gantt.parse({
      data: initialData,
    });

    setTaskCount(initialData.length);

    // Настройка zoom
    const zoomConfig = {
      levels: [
        { 
          name: "days", 
          scale_height: 50, 
          min_column_width: 50, 
          scales: [
            { unit: "day", step: 1, format: "%d %M" }
          ] 
        },
        { 
          name: "weeks", 
          scale_height: 50, 
          min_column_width: 50, 
          scales: [
            { unit: "week", step: 1, format: "Неделя #%W" },
            { unit: "day", step: 1, format: "%d" }
          ] 
        },
        { 
          name: "months", 
          scale_height: 50, 
          min_column_width: 70, 
          scales: [
            { unit: "month", step: 1, format: "%F %Y" },
            { unit: "week", step: 1, format: "#%W" }
          ] 
        },
      ],
    };

    gantt.ext.zoom.init(zoomConfig);
    gantt.ext.zoom.setLevel("weeks");

    // Undo/Redo
    gantt.plugins({ undo: true });

    // События для обновления счетчика задач
    gantt.attachEvent("onTaskAdded", (id, item) => {
      setTaskCount(prev => prev + 1);
      return true;
    });

    gantt.attachEvent("onTaskDeleted", (id, item) => {
      setTaskCount(prev => prev - 1);
      return true;
    });

    // Автоподгонка после загрузки
    setTimeout(() => {
      gantt.ext.zoom.auto();
    }, 100);

    return () => {
      gantt.clearAll();
    };
  }, []);

  // === Управление Zoom ===
  const setZoom = (level) => {
    if (gantt.ext.zoom && gantt.ext.zoom.setLevel) {
      gantt.ext.zoom.setLevel(level);
      setCurrentZoom(level);
      gantt.render();
    }
  };

  const zoomIn = () => {
    if (gantt.ext.zoom && gantt.ext.zoom.zoomIn) {
      gantt.ext.zoom.zoomIn();
    }
  };

  const zoomOut = () => {
    if (gantt.ext.zoom && gantt.ext.zoom.zoomOut) {
      gantt.ext.zoom.zoomOut();
    }
  };

  const zoomAuto = () => {
    if (gantt.ext.zoom && gantt.ext.zoom.auto) {
      gantt.ext.zoom.auto();
    }
  };

  // === Fullscreen ===
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // === Управление задачами ===
  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleSubmitTask = () => {
    if (newTask.text && newTask.start_date && newTask.duration) {
      gantt.addTask({
        id: gantt.uid(),
        text: newTask.text,
        start_date: new Date(newTask.start_date),
        duration: parseInt(newTask.duration),
        progress: 0
      });
      setNewTask({ text: "", start_date: "", duration: "" });
      setIsModalOpen(false);
    }
  };

  const handleExportPDF = () => {
    if (gantt.exportToPDF) {
      gantt.exportToPDF({
        header: "Диаграмма Ганта",
        format: "A4",
        landscape: true
      });
    }
  };

  const handleExportPNG = () => {
    if (gantt.exportToPNG) {
      gantt.exportToPNG();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className={`${styles.wrapper} ${isFullscreen ? styles.fullscreen : ''}`}>
      {/* === Панель инструментов === */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button 
            onClick={handleAddTask} 
            className={styles.primaryButton}
            title="Добавить задачу"
          >
            <FaPlus />
            <span>Добавить задачу</span>
          </button>
          
          <div className={styles.taskInfo}>
            <FaTasks />
            <span>Задачи: {taskCount}</span>
          </div>
        </div>

        <div className={styles.toolbarCenter}>
          <div className={styles.zoomGroup}>
            <button onClick={zoomOut} title="Уменьшить">
              <FaSearchMinus />
            </button>
            <button onClick={zoomAuto} title="Автоподгонка" className={styles.zoomAuto}>
              🔍
            </button>
            <button onClick={zoomIn} title="Увеличить">
              <FaSearchPlus />
            </button>
          </div>

          <div className={styles.viewGroup}>
            <button 
              onClick={() => setZoom("days")} 
              className={currentZoom === "days" ? styles.active : ""}
              title="День"
            >
              День
            </button>
            <button 
              onClick={() => setZoom("weeks")} 
              className={currentZoom === "weeks" ? styles.active : ""}
              title="Неделя"
            >
              Неделя
            </button>
            <button 
              onClick={() => setZoom("months")} 
              className={currentZoom === "months" ? styles.active : ""}
              title="Месяц"
            >
              Месяц
            </button>
          </div>
        </div>

        <div className={styles.toolbarRight}>
          <div className={styles.historyGroup}>
            <button onClick={() => gantt.undo()} title="Отменить">
              <FaUndo />
            </button>
            <button onClick={() => gantt.redo()} title="Повторить">
              <FaRedo />
            </button>
          </div>
          
          <div className={styles.exportGroup}>
            <button onClick={handleExportPDF} title="Экспорт в PDF">
              <FaFilePdf />
            </button>
            <button onClick={handleExportPNG} title="Экспорт в PNG">
              <FaImage />
            </button>
          </div>

          <button 
            onClick={toggleFullscreen} 
            className={styles.fullscreenButton}
            title={isFullscreen ? "Выйти из полноэкранного режима" : "Полный экран"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* === Контейнер диаграммы === */}
      <div className={styles.ganttContainer} ref={ganttContainer}></div>

      {/* === Модальное окно === */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <FaCalendarAlt className={styles.modalIcon} />
              <h3>Добавить новую задачу</h3>
            </div>
            
            <div className={styles.formGroup}>
              <label>Название задачи</label>
              <input
                type="text"
                placeholder="Введите название задачи..."
                value={newTask.text}
                onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                className={styles.formInput}
                autoFocus
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Дата начала</label>
                <input
                  type="date"
                  value={newTask.start_date}
                  onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Длительность (дней)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newTask.duration}
                  onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                  className={styles.formInput}
                  min="1"
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton} 
                onClick={() => setIsModalOpen(false)}
              >
                Отмена
              </button>
              <button 
                className={styles.submitButton} 
                onClick={handleSubmitTask}
                disabled={!newTask.text || !newTask.start_date || !newTask.duration}
              >
                <FaPlus />
                Добавить задачу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GanttPro;