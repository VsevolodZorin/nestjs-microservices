import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalFileDto } from './dto/local-file.dto';
import { LocalFileEntity } from './entities/local-file.entity';
import * as fs from 'fs';
import * as path from 'path';
import { backendMessages } from 'libs';

@Injectable()
export class LocalFilesService {
  constructor(
    @InjectRepository(LocalFileEntity)
    private localFilesRepository: Repository<LocalFileEntity>,
    private readonly configService: ConfigService,
  ) {}

  createLocalFile(fileData: LocalFileDto): Promise<LocalFileEntity> {
    const newLocalFile = this.localFilesRepository.create(fileData);
    return this.localFilesRepository.save(newLocalFile);
  }

  updateLocalFile(
    id: number,
    fileData: LocalFileDto,
  ): Promise<LocalFileEntity> {
    return this.localFilesRepository.save({ id, ...fileData });
  }

  getFileById(id: number) {
    try {
      const file = this.localFilesRepository.findOneBy({ id });
      if (!file) {
        throw new NotFoundException(backendMessages.file.NOT_FOUND);
      }
      return file;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  removeFileFromStorage(fileName: string): boolean {
    const uploadsDir = this.configService.get('UPLOADS_DIR');
    const rootDir = process.cwd();
    const filePath = path.join(rootDir, uploadsDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    } else {
      console.log(backendMessages.file.NOT_FOUND);
      return false;
    }
  }
}
