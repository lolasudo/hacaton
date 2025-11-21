// src/data/sampleTasks.js
export const sampleTasks = [
  {
    id: 1,
    text: "Подготовка строительной площадки",
    start_date: "2024-03-01",
    duration: 5,
    progress: 1,
    parent: 0,
    open: true,
    type: "task"
  },
  {
    id: 2,
    text: "Земляные работы",
    start_date: "2024-03-05",
    duration: 10,
    progress: 0.8,
    parent: 0,
    open: true,
    type: "task"
  },
  {
    id: 3,
    text: "Устройство фундамента",
    start_date: "2024-03-12",
    duration: 15,
    progress: 0.3,
    parent: 0,
    open: true,
    type: "task"
  },
  {
    id: 4,
    text: "Возведение стен",
    start_date: "2024-03-25",
    duration: 20,
    progress: 0,
    parent: 0,
    open: true,
    type: "task"
  },
  {
    id: 5,
    text: "Монтаж кровли",
    start_date: "2024-04-15",
    duration: 12,
    progress: 0,
    parent: 0,
    open: true,
    type: "task"
  },
  {
    id: 6,
    text: "Отделочные работы",
    start_date: "2024-04-25",
    duration: 25,
    progress: 0,
    parent: 0,
    open: true,
    type: "task"
  },
  {
    id: 7,
    text: "Разработка котлована",
    start_date: "2024-03-05",
    duration: 5,
    progress: 1,
    parent: 2,
    type: "task"
  },
  {
    id: 8,
    text: "Уплотнение грунта",
    start_date: "2024-03-10",
    duration: 3,
    progress: 0.5,
    parent: 2,
    type: "task"
  }
];