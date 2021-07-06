import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UploadService {
  public async execute(file, tenantid) {
    const { originalname } = file;
    const bucketS3 = process.env.AWS_S3_BUCKET_NAME;

    await this.uploadS3(file.buffer, bucketS3, originalname, tenantid);
  }

  public async uploadS3(file, bucket: string, name: string, tenantid: string) {
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
        console.log('se caiu aqui a imagem ta na aws');
        resolve(data);
      });
    });
  }

  public getS3() {
    return new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
