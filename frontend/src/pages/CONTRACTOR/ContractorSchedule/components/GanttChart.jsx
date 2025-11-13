import React, { useEffect, useRef, useState } from "react";
import {
  FaPlus,
  FaUndo,
  FaRedo,
  FaFilePdf,
  FaImage,
  FaExpand,
  FaCompress,
  FaCalendarAlt,
  FaTasks
} from "react-icons/fa";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import styles from "../styles/GanttChart.module.scss";

const GanttPro = () => {
  const ganttRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentScale, setCurrentScale] = useState("week");
  const [taskCount, setTaskCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ text: "", start_date: "", duration: "" });

  // Русские названия для масштабов
  const scaleLabels = {
    day: "День",
    week: "Неделя", 
    month: "Месяц",
    year: "Год",
    overview: "Сводка"
  };

  useEffect(() => {
    if (!ganttRef.current) return;

    gantt.clearAll();

    // --- Основные настройки
    gantt.config.xml_date = "%Y-%m-%d";
    gantt.config.date_format = "%d.%m.%Y";
    gantt.config.autofit = true;
    gantt.config.fit_tasks = true;
    gantt.config.show_progress = true;
    gantt.config.scale_height = 70;
    gantt.config.row_height = 50;
    gantt.config.bar_height = 30;
    gantt.config.grid_resize = true;
    gantt.config.drag_progress = true;
    gantt.config.drag_links = true;
    gantt.config.dblclick_create = false;
    gantt.config.select_task = true;
    gantt.i18n.setLocale("ru");

    gantt.config.columns = [
      { name: "text", label: "Задача", width: 300, tree: true },
      { name: "start_date", label: "Начало", width: 100, align: "center" },
      { name: "duration", label: "Дней", width: 70, align: "center" },
      { name: "progress", label: "Прогресс", width: 80, align: "center", template: obj => `${Math.round(obj.progress * 100)}%` }
    ];

    const initialTasks = [
      { id: 1, text: "Подготовка площадки", start_date: "2024-03-01", duration: 5, progress: 1 },
      { id: 2, text: "Земляные работы", start_date: "2024-03-05", duration: 10, progress: 0.8 },
      { id: 3, text: "Фундамент", start_date: "2024-03-12", duration: 15, progress: 0.3 },
      { id: 4, text: "Стены", start_date: "2024-03-25", duration: 20, progress: 0 },
      { id: 5, text: "Кровля", start_date: "2024-04-15", duration: 12, progress: 0 },
      { id: 6, text: "Отделка", start_date: "2024-04-25", duration: 25, progress: 0 },
    ];

    gantt.init(ganttRef.current);
    gantt.parse({ data: initialTasks });
    setTaskCount(initialTasks.length);

    initZoom();
    setScale(currentScale);
    gantt.plugins({ undo: true });

    gantt.attachEvent("onTaskAdded", () => setTaskCount(prev => prev + 1));
    gantt.attachEvent("onTaskDeleted", () => setTaskCount(prev => prev - 1));

    return () => gantt.clearAll();
  }, []);

  const initZoom = () => {
    gantt.ext.zoom.init({
      levels: [
        { 
          name: "day", 
          scale_height: 60, 
          min_column_width: 50, 
          scales: [
            { unit: "day", step: 1, format: "%d %M" },
            { unit: "week", step: 1, format: "Неделя %W" }
          ]
        },
        { 
          name: "week", 
          scale_height: 70, 
          min_column_width: 40, 
          scales: [
            { unit: "month", step: 1, format: "%F %Y" },
            { unit: "week", step: 1, format: "Неделя %W" },
            { unit: "day", step: 1, format: "%d" }
          ]
        },
        { 
          name: "month", 
          scale_height: 70, 
          min_column_width: 80, 
          scales: [
            { unit: "year", step: 1, format: "%Y" },
            { unit: "month", step: 1, format: "%F" }
          ]
        },
        { 
          name: "year", 
          scale_height: 70, 
          min_column_width: 100, 
          scales: [
            { unit: "year", step: 1, format: "%Y" },
            { unit: "month", step: 1, format: "%M" }
          ]
        },
        { 
          name: "overview", 
          scale_height: 70, 
          min_column_width: 120, 
          scales: [
            { unit: "year", step: 1, format: "%Y" },
            { unit: "quarter", step: 1, format: "Кв.%q" }
          ]
        }
      ]
    });
  };

  const setScale = (scale) => {
    if (gantt.ext.zoom && gantt.ext.zoom.setLevel) {
      gantt.ext.zoom.setLevel(scale);
      setCurrentScale(scale);
    }
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const openAddTaskModal = () => setIsModalOpen(true);

  const submitTask = () => {
    if (!newTask.text || !newTask.start_date || !newTask.duration) return;
    gantt.addTask({
      id: gantt.uid(),
      text: newTask.text,
      start_date: newTask.start_date,
      duration: parseInt(newTask.duration),
      progress: 0
    });
    setNewTask({ text: "", start_date: "", duration: "" });
    setIsModalOpen(false);
  };

  const exportPDF = () => gantt.exportToPDF?.({ header: "Диаграмма Ганта", format: "A4", landscape: true });
  const exportPNG = () => gantt.exportToPNG?.();

  return (
    <div className={`${styles.wrapper} ${isFullscreen ? styles.fullscreen : ""}`}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button className={styles.primaryButton} onClick={openAddTaskModal}><FaPlus /> Добавить задачу</button>
          <div className={styles.taskInfo}><FaTasks /> Задачи: {taskCount}</div>
        </div>

        <div className={styles.toolbarCenter}>
          <div className={styles.scaleGroup}>
            {["day","week","month","year","overview"].map(scale => (
              <button
                key={scale}
                className={`${styles.scaleButton} ${currentScale === scale ? styles.active : ""}`}
                onClick={() => setScale(scale)}
              >
                {scaleLabels[scale]}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.toolbarRight}>
          <div className={styles.historyGroup}>
            <button className={styles.historyButton} onClick={() => gantt.undo()}><FaUndo /></button>
            <button className={styles.historyButton} onClick={() => gantt.redo()}><FaRedo /></button>
          </div>
          <div className={styles.exportGroup}>
            <button className={styles.exportButton} onClick={exportPDF}><FaFilePdf /></button>
            <button className={styles.exportButton} onClick={exportPNG}><FaImage /></button>
          </div>
          <button className={styles.fullscreenButton} onClick={toggleFullscreen}>
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      <div className={styles.ganttContainer} ref={ganttRef}></div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}><FaCalendarAlt /> <h3>Добавить новую задачу</h3></div>
            <div className={styles.formGroup}>
              <label>Название задачи</label>
              <input type="text" className={styles.formInput} value={newTask.text} onChange={e => setNewTask({...newTask, text:e.target.value})} autoFocus />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}><label>Дата начала</label>
                <input type="date" className={styles.formInput} value={newTask.start_date} onChange={e => setNewTask({...newTask, start_date:e.target.value})} />
              </div>
              <div className={styles.formGroup}><label>Длительность (дней)</label>
                <input type="number" min="1" className={styles.formInput} value={newTask.duration} onChange={e => setNewTask({...newTask, duration:e.target.value})} />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Отмена</button>
              <button className={styles.submitButton} onClick={submitTask} disabled={!newTask.text || !newTask.start_date || !newTask.duration}><FaPlus /> Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GanttPro;