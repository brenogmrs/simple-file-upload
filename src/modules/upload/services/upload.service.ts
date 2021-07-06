import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UploadService {
  public async execute(
    file: Express.Multer.File,
    tenantid: string,
    bucket: string,
  ) {
    const { originalname } = file;

    await this.uploadS3(file.buffer, bucket, originalname, tenantid);
  }

  public async uploadS3(
    file: Buffer | Blob,
    bucket: string,
    name: string,
    tenantid: string,
  ): Promise<void> {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: `${tenantid}/${name}`,
      Body: file,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  public getS3(): AWS.S3 {
    return new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
