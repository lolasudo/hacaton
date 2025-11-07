import React, { useState } from "react";
import style from "./style/contractorReports.module.scss";
import Select from "react-select";
import {
  FaFileExcel,
  FaFilePdf,
  FaChartLine,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCamera,
  FaUpload,
  FaPaperPlane,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import "../../Profile/styles/select-styles.scss";

const ContractorReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState({ value: "week", label: "Неделя" });
  const [selectedWorkType, setSelectedWorkType] = useState({ value: "all", label: "Все работы" });
  const [selectedDailyWork, setSelectedDailyWork] = useState(null);

  const metricsData = {
    overallProgress: 75,
    completedWorks: 24,
    totalWorks: 32,
    scheduleDelay: 3,
    activeRemarks: 5,
    overdueRemarks: 2,
  };

  const materialsData = [
    { name: "Брусчатка", planned: "1000 м²", delivered: "850 м²", deviation: -15 },
    { name: "Цемент", planned: "50 т", delivered: "50 т", deviation: 0 },
    { name: "Саженцы", planned: "200 шт", delivered: "150 шт", deviation: -25 },
  ];

  const issuesData = [
    { description: "Неравномерная укладка", deadline: "05.10", overdue: 2, status: "critical" },
    { description: "Отсутствие ограждения", deadline: "03.10", overdue: 4, status: "critical" },
    { description: "Несоответствие паспорту качества", deadline: "07.10", overdue: 0, status: "warning" },
  ];

  const statusCounts = { critical: 2, warning: 3, resolved: 12 };

  const progressData = [
    { day: "Пн", plan: 70, fact: 65 },
    { day: "Вт", plan: 72, fact: 70 },
    { day: "Ср", plan: 74, fact: 72 },
    { day: "Чт", plan: 76, fact: 75 },
    { day: "Пт", plan: 78, fact: 76 },
    { day: "Сб", plan: 80, fact: 77 },
    { day: "Вс", plan: 82, fact: 78 },
  ];

  const forecastData = [
    { week: "1 неделя", progress: 45 },
    { week: "2 неделя", progress: 55 },
    { week: "3 неделя", progress: 65 },
    { week: "4 неделя", progress: 75 },
    { week: "5 неделя", progress: 85 },
    { week: "6 неделя", progress: 95 },
  ];

  const periodOptions = [
    { value: "week", label: "Неделя" },
    { value: "month", label: "Месяц" },
    { value: "all", label: "Весь проект" },
  ];

  const workTypeOptions = [
    { value: "all", label: "Все работы" },
    { value: "preparation", label: "Подготовительные" },
    { value: "main", label: "Основные" },
    { value: "finishing", label: "Отделочные" },
  ];

  const handleExport = (format) => console.log(`Exporting to ${format}`);
  const handleDailyReportSubmit = (e) => e.preventDefault();

  return (
    <div className={style.reportsContainer}>
      {/* Заголовок */}
      <div className={style.welcomeSection}>
        <div className={style.welcomeText}>
          <h1>Дашборд прораба</h1>
          <p>Мониторинг выполнения работ и отчетность</p>
        </div>

        <div className={style.actions}>
          <button className={style.exportButton} onClick={() => handleExport("excel")}>
            <FaFileExcel /> Excel
          </button>
          <button className={style.exportButton} onClick={() => handleExport("pdf")}>
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>

      {/* Карточка */}
      <div className={style.reportsCard}>
        <div className={style.cardHeader}></div>

        {/* Фильтры */}
        <div className={style.filtersSection}>
          <Select
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            options={periodOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Выберите период"
          />
          <Select
            value={selectedWorkType}
            onChange={setSelectedWorkType}
            options={workTypeOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Тип работ"
          />
        </div>

        {/* Метрики */}
        <div className={style.dashboard}>
          <div className={style.metricCard}>
            <span className={style.metricValue}>{metricsData.overallProgress}%</span>
            <span className={style.metricLabel}>Общая готовность</span>
          </div>
          <div className={style.metricCard}>
            <span className={style.metricValue}>
              {metricsData.completedWorks}/{metricsData.totalWorks}
            </span>
            <span className={style.metricLabel}>Выполнено работ</span>
          </div>
          <div className={style.metricCard}>
            <span className={style.metricValue}>{metricsData.scheduleDelay} дн.</span>
            <span className={style.metricLabel}>Отставание от графика</span>
          </div>
          <div className={style.metricCard}>
            <span className={style.metricValue}>{metricsData.activeRemarks}</span>
            <span className={style.metricLabel}>Активные замечания</span>
          </div>
          <div className={style.metricCard}>
            <span className={style.metricValue}>{metricsData.overdueRemarks}</span>
            <span className={style.metricLabel}>Просроченные замечания</span>
          </div>
        </div>

        {/* Основной контент */}
        <div className={style.contentGrid}>
          {/* Аналитика */}
          <div className={style.chartSection}>
            <h3 className={style.sectionTitle}>
              <FaChartLine /> Аналитика выполнения графика
            </h3>
            <div className={style.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="plan" stroke="#3B82F6" name="План" />
                  <Line type="monotone" dataKey="fact" stroke="#10B981" name="Факт" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Материалы */}
          <div className={style.materialsSection}>
            <h3 className={style.sectionTitle}>Отчет по материалам</h3>
            <table className={style.materialsTable}>
              <thead>
                <tr>
                  <th className={style.tableHeader}>Материал</th>
                  <th className={style.tableHeader}>План</th>
                  <th className={style.tableHeader}>Поставлено</th>
                  <th className={style.tableHeader}>Отклонение</th>
                </tr>
              </thead>
              <tbody>
                {materialsData.map((m, i) => (
                  <tr key={i}>
                    <td className={style.tableCell}>{m.name}</td>
                    <td className={style.tableCell}>{m.planned}</td>
                    <td className={style.tableCell}>{m.delivered}</td>
                    <td
                      className={`${style.tableCell} ${
                        m.deviation < 0
                          ? style.deviationNegative
                          : m.deviation > 0
                          ? style.deviationPositive
                          : ""
                      }`}
                    >
                      {m.deviation > 0 ? "+" : ""}
                      {m.deviation}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Замечания */}
          <div className={style.issuesSection}>
            <h3 className={style.sectionTitle}>
              <FaExclamationTriangle /> Статус замечаний
            </h3>
            <div className={style.statusOverview}>
              <span className={style.statusCritical}>
                🔴 Критические: {statusCounts.critical}
              </span>
              <span className={style.statusWarning}>
                🟡 Требуют внимания: {statusCounts.warning}
              </span>
              <span className={style.statusResolved}>
                🟢 Исправлено: {statusCounts.resolved}
              </span>
            </div>
            <table className={style.issuesTable}>
              <thead>
                <tr>
                  <th className={style.tableHeader}>Замечание</th>
                  <th className={style.tableHeader}>Срок</th>
                  <th className={style.tableHeader}>Просрочка</th>
                </tr>
              </thead>
              <tbody>
                {issuesData.map((issue, i) => (
                  <tr key={i}>
                    <td className={style.tableCell}>{issue.description}</td>
                    <td className={style.tableCell}>{issue.deadline}</td>
                    <td className={`${style.tableCell} ${style.statusCritical}`}>
                      {issue.overdue} дня
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Прогноз */}
          <div className={style.chartSection}>
            <h3 className={style.sectionTitle}>
              <FaCalendarAlt /> Прогноз завершения работ
            </h3>
            <div className={style.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#3B82F6" name="Прогресс (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Ежедневный отчет */}
        <div className={style.dailyReportSection}>
          <h3 className={style.sectionTitle}>
            <FaCheckCircle /> Ежедневный отчет
          </h3>
          <form className={style.reportForm} onSubmit={handleDailyReportSubmit}>
            <div className={style.formGroup}>
              <label className={style.formLabel}>Выполненные сегодня работы</label>
              <Select
                value={selectedDailyWork}
                onChange={setSelectedDailyWork}
                options={workTypeOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Выберите работу"
              />
            </div>

            <div className={style.formGroup}>
              <label className={style.formLabel}>Поставленные материалы</label>
              <input
                type="text"
                className={style.formInput}
                placeholder="Наименование и объем материалов"
              />
            </div>

            <div className={style.formGroup}>
              <label className={style.formLabel}>Полученные замечания</label>
              <textarea
                className={style.formTextarea}
                placeholder="Опишите полученные замечания..."
              />
            </div>

            <div className={style.photoUpload}>
              <label className={style.formLabel}>Фотоотчет за день</label>
              <div className={style.uploadButton}>
                <FaCamera /> <FaUpload style={{ marginLeft: 8 }} /> Загрузить фотографии
              </div>
            </div>

            <button type="submit" className={style.submitButton}>
              <FaPaperPlane /> Отправить отчет
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContractorReports;
