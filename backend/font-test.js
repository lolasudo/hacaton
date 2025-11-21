const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

console.log('=== ДИАГНОСТИКА ШРИФТОВ ===');
console.log('Текущая директория:', process.cwd());

// Проверяем папку со шрифтами
const fontsDir = path.join(process.cwd(), 'assets', 'fonts');
console.log('Папка шрифтов:', fontsDir);
console.log('Существует:', fs.existsSync(fontsDir));

if (fs.existsSync(fontsDir)) {
  const files = fs.readdirSync(fontsDir);
  console.log('Файлы в папке fonts:');
  files.forEach(file => {
    const filePath = path.join(fontsDir, file);
    const stats = fs.statSync(filePath);
    console.log(`- ${file} (${stats.size} байт)`);
  });
}

// Создаем тестовый PDF
console.log('\n=== СОЗДАНИЕ ТЕСТОВОГО PDF ===');
const doc = new PDFDocument();
const outputPath = path.join(process.cwd(), 'test-output.pdf');
const stream = fs.createWriteStream(outputPath);

doc.pipe(stream);

// Пробуем разные варианты текста
doc.fontSize(20).text('ТЕСТ РУССКОГО ТЕКСТА', 100, 100);
doc.fontSize(12)
   .text('Простой текст: Привет мир!', 100, 130)
   .text('АКТ № TEST-001', 100, 150)
   .text('Объект: Тестовый объект', 100, 170)
   .text('Содержание: проверка кириллицы', 100, 190);

doc.end();

stream.on('finish', () => {
  console.log(`Тестовый PDF создан: ${outputPath}`);
  console.log('Попробуйте открыть этот файл и посмотреть, отображается ли кириллица');
});

console.log('\n=== ПРОВЕРКА СИСТЕМНЫХ ШРИФТОВ ===');

// Проверяем доступные системные шрифты
const systemFontPaths = [
  // Windows
  'C:/Windows/Fonts/arial.ttf',
  'C:/Windows/Fonts/times.ttf',
  // macOS
  '/System/Library/Fonts/Arial.ttf',
  '/System/Library/Fonts/Times.ttf',
  // Linux
  '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
  '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
];

systemFontPaths.forEach(fontPath => {
  if (fs.existsSync(fontPath)) {
    console.log(`✓ Найден системный шрифт: ${fontPath}`);
  }
});