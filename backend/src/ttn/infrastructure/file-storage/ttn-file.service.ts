import { Injectable } from '@nestjs/common';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TTNFileService {
  private readonly uploadPath = join(process.cwd(), 'uploads', 'ttn');

  async saveTTNPhoto(file: Express.Multer.File): Promise<string> {
  
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }

    
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = join(this.uploadPath, fileName);


    writeFileSync(filePath, file.buffer);

    return `uploads/ttn/${fileName}`;
  }

  async getFileUrl(filePath: string): Promise<string> {
   
    return `/api/v1/files/${filePath}`;
  }
}