import { Injectable } from '@nestjs/common';
import { ActEntity } from '../entities/act.entity';
import { ChecklistEntity } from '../entities/checklist.entity';

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

@Injectable()
export class PdfGenerationService {
  private russianFontsAvailable = false;

  async generateActPdf(act: ActEntity): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          },
          size: 'A4',
          info: {
            Title: `Акт ${act.actNumber}`,
            Author: 'Строительная система',
            Subject: `Акт ${this.getActTypeText(act.type)}`,
            CreationDate: new Date(),
          },
          lang: 'ru-RU',
          pdfVersion: '1.7',
          autoFirstPage: true
        });

        // Регистрируем шрифты Open Sans
        this.registerOpenSansFonts(doc);
        
        const chunks: Buffer[] = [];
        
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);
          resolve(pdfBuffer);
        });
        doc.on('error', reject);

        // === ЗАГОЛОВОК ===
        // Верхняя полоса
        doc.rect(0, 0, doc.page.width, 40)
           .fill('#2c3e50');
        
        // Заголовок документа
        doc.fontSize(16)
           .font('OpenSansBold')
           .fillColor('white')
           .text(`АКТ № ${act.actNumber}`, 50, 10, { align: 'left' });
        
        doc.fontSize(8)
           .text('Строительная система', 50, 32, { align: 'left' });
        
        // Дата документа
        const currentDate = new Date().toLocaleDateString('ru-RU');
        doc.fontSize(10)
           .font('OpenSansRegular')
           .text(`Дата: ${currentDate}`, doc.page.width - 200, 20, { align: 'right' })
           .fillColor('black');
        
        // Начало контента
        doc.y = 70;

        // === ОСНОВНАЯ ИНФОРМАЦИЯ ===
        doc.fontSize(14)
           .font('OpenSansBold')
           .text('Основная информация:', { underline: true });
        
        doc.moveDown(0.5);
        doc.fontSize(11)
           .font('OpenSansRegular');
        
        // Тип акта
        doc.text(`Тип акта: ${this.getActTypeText(act.type)}`, { continued: false });
        doc.moveDown(0.3);
        
        // Дата создания
        const createdAt = act.createdAt ? new Date(act.createdAt).toLocaleDateString('ru-RU') : 'Не указана';
        doc.text(`Дата создания: ${createdAt}`, { continued: false });
        doc.moveDown(0.3);
        
        // Объект
        if (act.object) {
          doc.text(`Объект: ${act.object.name || 'Не указан'}`, { continued: false });
          doc.moveDown(0.3);
          
          if (act.object.address) {
            doc.text(`Адрес: ${act.object.address}`, { continued: false });
            doc.moveDown(0.3);
          }
        }
        
        // === СОДЕРЖАНИЕ ===
        doc.moveDown();
        doc.fontSize(14)
           .font('OpenSansBold')
           .text('Содержание:', { underline: true });
        
        doc.moveDown(0.5);
        doc.fontSize(11)
           .font('OpenSansRegular')
           .text(act.content || 'Содержание не указано', {
             align: 'left',
             lineGap: 3
           });

        // === ПОДПИСИ ===
        this.addSignaturesSection(doc);

        doc.end();

      } catch (error) {
        console.error('PDF generation error:', error);
        reject(error);
      }
    });
  }

  async generateChecklistPdf(checklist: ChecklistEntity): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          },
          size: 'A4',
          info: {
            Title: `Чек-лист ${checklist.name}`,
            Author: 'Строительная система',
            Subject: `Чек-лист ${this.getChecklistTypeText(checklist.type)}`,
            CreationDate: new Date(),
          },
          lang: 'ru-RU',
          pdfVersion: '1.7'
        });

        // Регистрируем шрифты Open Sans
        this.registerOpenSansFonts(doc);
        
        const chunks: Buffer[] = [];
        
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);
          console.log(`Checklist PDF generated successfully, size: ${pdfBuffer.length} bytes`);
          resolve(pdfBuffer);
        });
        doc.on('error', reject);

        // === ЗАГОЛОВОК ===
        doc.rect(0, 0, doc.page.width, 40)
           .fill('#2c3e50');
        
        doc.fontSize(16)
           .font('OpenSansBold')
           .fillColor('white')
           .text(`ЧЕК-ЛИСТ: ${checklist.name}`, 50, 10, { align: 'left' });
        
        doc.fontSize(8)
           .text('Строительная система', 50, 32, { align: 'left' });
        
        const currentDate = new Date().toLocaleDateString('ru-RU');
        doc.fontSize(10)
           .font('OpenSansRegular')
           .text(`Дата: ${currentDate}`, doc.page.width - 200, 20, { align: 'right' })
           .fillColor('black');
        
        doc.y = 70;

        // === ОСНОВНАЯ ИНФОРМАЦИА ===
        doc.fontSize(14)
           .font('OpenSansBold')
           .text('Основная информация:', { underline: true });
        
        doc.moveDown(0.5);
        doc.fontSize(11)
           .font('OpenSansRegular');
        
        doc.text(`Тип: ${this.getChecklistTypeText(checklist.type)}`, { continued: false });
        doc.moveDown(0.3);
        
        const createdAt = checklist.createdAt ? new Date(checklist.createdAt).toLocaleDateString('ru-RU') : 'Не указана';
        doc.text(`Дата создания: ${createdAt}`, { continued: false });
        doc.moveDown(0.3);
        
        if (checklist.object) {
          doc.text(`Объект: ${checklist.object.name || 'Не указан'}`, { continued: false });
          doc.moveDown(0.3);
        }

        // === ПУНКТЫ ЧЕК-ЛИСТА ===
        doc.moveDown();
        doc.fontSize(14)
           .font('OpenSansBold')
           .text('Пункты проверки:', { underline: true });
        
        doc.moveDown(0.5);

        if (checklist.items && checklist.items.length > 0) {
          checklist.items.forEach((item, index) => {
            const startY = doc.y;
            
            // Чекбокс
            doc.rect(50, startY, 12, 12)
               .stroke();
            
            if (item.isCompleted) {
              doc.fontSize(10)
                 .font('OpenSansBold')
                 .text('✓', 53, startY + 2);
            }
            
            // Текст пункта
            doc.fontSize(11)
               .font('OpenSansRegular')
               .text(`${index + 1}. ${item.description}`, 70, startY + 2, {
                 width: 450,
                 lineGap: 2
               });
            
            doc.moveDown(1);
          });

          // Статистика
          const completed = checklist.items.filter(item => item.isCompleted).length;
          const total = checklist.items.length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          
          doc.moveDown();
          doc.fontSize(12)
             .font('OpenSansBold')
             .fillColor(completed === total ? 'green' : completed > 0 ? 'orange' : 'red')
             .text(`Выполнено: ${completed} из ${total} пунктов (${percentage}%)`, {
               align: 'center'
             })
             .fillColor('black');
        } else {
          doc.fontSize(11)
             .font('OpenSansRegular')
             .text('Нет пунктов для проверки', { indent: 20 });
        }

        // === ПОДПИСИ ===
        this.addSignaturesSection(doc);

        doc.end();

      } catch (error) {
        console.error('Checklist PDF generation error:', error);
        reject(error);
      }
    });
  }

  private registerOpenSansFonts(doc: any): void {
    try {
      // Возможные пути к шрифтам Open Sans
      const possibleFontPaths = [
        // В папке assets/fonts
        path.join(process.cwd(), 'assets', 'fonts', 'OpenSans-Regular.ttf'),
        path.join(process.cwd(), 'assets', 'fonts', 'OpenSans-Bold.ttf'),
        path.join(process.cwd(), 'assets', 'fonts', 'OpenSans-Regular.ttf'),
        path.join(process.cwd(), 'assets', 'fonts', 'OpenSans-Bold.ttf'),
        // В корне проекта
        path.join(process.cwd(), 'fonts', 'OpenSans-Regular.ttf'),
        path.join(process.cwd(), 'fonts', 'OpenSans-Bold.ttf'),
        // Относительные пути
        './assets/fonts/OpenSans-Regular.ttf',
        './assets/fonts/OpenSans-Bold.ttf',
        './fonts/OpenSans-Regular.ttf',
        './fonts/OpenSans-Bold.ttf',
      ];

      // Ищем Regular и Bold версии
      let regularFontPath = possibleFontPaths.find(path => 
        fs.existsSync(path) && (path.includes('Regular') || path.includes('regular'))
      );
      
      let boldFontPath = possibleFontPaths.find(path => 
        fs.existsSync(path) && (path.includes('Bold') || path.includes('bold'))
      );

      // Альтернативные названия файлов - если не нашли по основным путям
      if (!regularFontPath) {
        const altPaths = [
          path.join(process.cwd(), 'assets', 'fonts', 'OpenSans-Regular.ttf'),
          path.join(process.cwd(), 'assets', 'fonts', 'opensans-regular.ttf'),
          path.join(process.cwd(), 'assets', 'fonts', 'OpenSans_Regular.ttf'),
          path.join(process.cwd(), 'assets', 'fonts', 'OpenSansRegular.ttf'),
          path.join(process.cwd(), 'assets', 'fonts', 'OpenSans.ttf'),
        ];
        for (const altPath of altPaths) {
          if (fs.existsSync(altPath)) {
            regularFontPath = altPath;
            break;
          }
        }
      }

      if (!boldFontPath) {
        const altPaths = [
          path.join(process.cwd(), 'assets', 'fonts', 'OpenSans-Bold.ttf'),
          path.join(process.cwd(), 'assets', 'fonts', 'opensans-bold.ttf'),
          path.join(process.cwd(), 'assets', 'fonts', 'OpenSans_Bold.ttf'),
          path.join(process.cwd(), 'assets', 'fonts', 'OpenSansBold.ttf'),
          path.join(process.cwd(), 'assets', 'fonts', 'OpenSans-Bold.ttf'),
        ];
        for (const altPath of altPaths) {
          if (fs.existsSync(altPath)) {
            boldFontPath = altPath;
            break;
          }
        }
      }

      if (regularFontPath && boldFontPath) {
        doc.registerFont('OpenSansRegular', regularFontPath);
        doc.registerFont('OpenSansBold', boldFontPath);
        this.russianFontsAvailable = true;
        console.log('✓ Open Sans fonts registered successfully');
        console.log(`  Regular: ${regularFontPath}`);
        console.log(`  Bold: ${boldFontPath}`);
      } else {
        console.warn('Open Sans fonts not found, using fallback fonts');
        this.registerFallbackFonts(doc);
      }
    } catch (error) {
      console.error('Error registering Open Sans fonts:', error);
      this.registerFallbackFonts(doc);
    }
  }

  private registerFallbackFonts(doc: any): void {
    try {
      // Fallback на системные шрифты
      const systemFonts = [
        // Windows
        'C:/Windows/Fonts/arial.ttf',
        'C:/Windows/Fonts/arialbd.ttf',
        // macOS
        '/System/Library/Fonts/Arial.ttf',
        '/System/Library/Fonts/Arial Bold.ttf',
        // Linux
        '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
      ];

      const regularFont = systemFonts.find(font => fs.existsSync(font));
      const boldFont = systemFonts.find(font => 
        fs.existsSync(font) && (font.includes('bd') || font.includes('Bold') || font.includes('Bold'))
      );

      if (regularFont && boldFont) {
        doc.registerFont('OpenSansRegular', regularFont);
        doc.registerFont('OpenSansBold', boldFont);
        this.russianFontsAvailable = true;
        console.log('✓ Using system fallback fonts');
      } else {
        // Ultimate fallback - стандартные шрифты PDFKit
        doc.registerFont('OpenSansRegular', 'Helvetica');
        doc.registerFont('OpenSansBold', 'Helvetica-Bold');
        this.russianFontsAvailable = false;
        console.warn('Using default Helvetica fonts (cyrillic may not work)');
      }
    } catch (error) {
      console.error('Error registering fallback fonts:', error);
      doc.registerFont('OpenSansRegular', 'Helvetica');
      doc.registerFont('OpenSansBold', 'Helvetica-Bold');
      this.russianFontsAvailable = false;
    }
  }

  private addSignaturesSection(doc: any): void {
    if (doc.y > 600) {
      doc.addPage();
    }
    
    doc.moveDown(2);
    
    const signatureY = doc.y;
    const colWidth = (doc.page.width - 100) / 2;
    
    // Подпись исполнителя
    doc.fontSize(10)
       .font('OpenSansRegular')
       .text('Исполнитель:', 50, signatureY);
    
    doc.moveTo(50, signatureY + 20)
       .lineTo(50 + colWidth - 20, signatureY + 20)
       .stroke();
    
    doc.fontSize(8)
       .text('(подпись, ФИО)', 50, signatureY + 25, { width: colWidth - 20, align: 'center' });
    
    // Подпись проверяющего
    doc.fontSize(10)
       .font('OpenSansRegular')
       .text('Проверяющий:', 50 + colWidth, signatureY);
    
    doc.moveTo(50 + colWidth, signatureY + 20)
       .lineTo(50 + colWidth + colWidth - 20, signatureY + 20)
       .stroke();
    
    doc.fontSize(8)
       .text('(подпись, ФИО)', 50 + colWidth, signatureY + 25, { width: colWidth - 20, align: 'center' });
  }

  private getActTypeText(type: string): string {
    const types: { [key: string]: string } = {
      'opening': 'Открытия объекта',
      'closing': 'Закрытия объекта', 
      'intermediate': 'Промежуточный',
      'acceptance': 'Приемки работ',
      'examination': 'Обследования'
    };
    return types[type] || type;
  }

  private getChecklistTypeText(type: string): string {
    const types: { [key: string]: string } = {
      'object_opening': 'Открытия объекта',
      'quality_control': 'Контроля качества',
      'safety_inspection': 'Техники безопасности',
      'pre_work': 'Подготовки к работам',
      'post_work': 'Завершения работ'
    };
    return types[type] || type;
  }
}