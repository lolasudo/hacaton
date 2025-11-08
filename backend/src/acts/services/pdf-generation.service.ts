import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit');
import { ActEntity } from '../entities/act.entity';
import { ChecklistEntity } from '../entities/checklist.entity';

@Injectable()
export class PdfGenerationService {
  
  async generateActPdf(act: ActEntity): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Заголовок
        doc.fontSize(20).text(`АКТ № ${act.actNumber}`, 100, 100);
        doc.fontSize(12).text(`Тип: ${this.getActTypeText(act.type)}`, 100, 130);
        doc.text(`Объект: ${act.object.name}`, 100, 150);
        doc.text(`Адрес: ${act.object.address}`, 100, 170);
        doc.text(`Дата создания: ${act.createdAt.toLocaleDateString()}`, 100, 190);
        
        // Содержание акта
        doc.moveDown(2);
        doc.fontSize(14).text('СОДЕРЖАНИЕ:', 100, 230);
        doc.fontSize(10).text(act.content, 100, 260, { width: 400 });

        // Подписи
        doc.moveDown(4);
        doc.text('_________________________', 100, doc.y);
        doc.text('Исполнитель', 100, doc.y + 20);

        doc.text('_________________________', 300, doc.y - 40);
        doc.text('Заказчик', 300, doc.y - 20);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateChecklistPdf(checklist: ChecklistEntity): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Заголовок
        doc.fontSize(20).text(`ЧЕК-ЛИСТ: ${checklist.name}`, 100, 100);
        doc.fontSize(12).text(`Тип: ${this.getChecklistTypeText(checklist.type)}`, 100, 130);
        doc.text(`Объект: ${checklist.object.name}`, 100, 150);
        doc.text(`Дата создания: ${checklist.createdAt.toLocaleDateString()}`, 100, 170);

        // Пункты чек-листа
        doc.moveDown(2);
        doc.fontSize(14).text('ПУНКТЫ ПРОВЕРКИ:', 100, 210);

        let yPosition = 240;
        checklist.items.forEach((item, index) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 100;
          }

          const status = item.isCompleted ? 'ВЫПОЛНЕНО' : 'НЕ ВЫПОЛНЕНО';
          doc.fontSize(10).text(`${index + 1}. ${item.description}`, 120, yPosition);
          doc.text(status, 450, yPosition);
          yPosition += 25;
        });

        // Статистика
        const completedCount = checklist.items.filter(item => item.isCompleted).length;
        const totalCount = checklist.items.length;
        
        doc.moveDown(2);
        doc.text(`Выполнено: ${completedCount} из ${totalCount} пунктов`, 100, doc.y);
        
        if (completedCount === totalCount) {
          // УБИРАЕМ color - используем другой способ выделения
          doc.fillColor('green').text('ЧЕК-ЛИСТ ЗАВЕРШЕН', 100, doc.y + 20);
          doc.fillColor('black'); // возвращаем черный цвет
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private getActTypeText(type: string): string {
    const types = {
      'opening': 'Открытия объекта',
      'closing': 'Закрытия объекта', 
      'intermediate': 'Промежуточный'
    };
    return types[type] || type;
  }

  private getChecklistTypeText(type: string): string {
    const types = {
      'object_opening': 'Открытия объекта',
      'quality_control': 'Контроля качества',
      'safety_inspection': 'Техники безопасности'
    };
    return types[type] || type;
  }
}