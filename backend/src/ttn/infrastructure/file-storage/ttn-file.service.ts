import { Injectable } from '@nestjs/common';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TTNFileService {
  private readonly uploadPath = join(process.cwd(), 'uploads', 'ttn');

  async saveTTNPhoto(file: Express.Multer.File): Promise<string> {
    // Создаем папку если не существует
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }

    // Генерируем уникальное имя файла
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = join(this.uploadPath, fileName);

    // Сохраняем файл
    writeFileSync(filePath, file.buffer);

    return `uploads/ttn/${fileName}`;
  }

  async getFileUrl(filePath: string): Promise<string> {
    // Для продакшена заменим на CDN URL
    return `/api/v1/files/${filePath}`;
  }
}