import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../services/upload.service';
import { Request } from 'express';

@Controller('fileupload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<void> {
    const tenantid = req.headers.tenantid as string;
    const { bucket } = req.body;

    return this.uploadService.execute(file, tenantid, bucket);
  }
}
