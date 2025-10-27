export const workOptions = [
  { value: "foundation", label: "Фундамент" },
  { value: "walls", label: "Кладка стен" },
  { value: "roof", label: "Кровля" },
  { value: "finishing", label: "Отделка" },
];

export const volumeOptions = [
  { value: "m3", label: "м³" },
  { value: "ton", label: "тонн" },
  { value: "liters", label: "литров" },
];

export const fileTypes = {
  photo: {
    accept: "image/*",
    capture: "environment",
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  document: {
    accept: ".pdf,.doc,.docx,.jpg,.png",
    maxSize: 10 * 1024 * 1024 // 10MB
  }
};