import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { AWSResponse } from '../interface/awsResponse.interface';

dotenv.config();

@Injectable()
export class UploadService {
  public async execute(
    file: Express.Multer.File,
    tenantid: string,
    bucket: string,
  ): Promise<AWSResponse> {
    const { originalname } = file;

    const data = await this.uploadS3(
      file.buffer,
      bucket,
      originalname,
      tenantid,
    );

    return data;
  }

  public async uploadS3(
    file: Buffer,
    bucket: string,
    name: string,
    tenantid: string,
  ) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: `${tenantid}/${Date.now().toString()} - ${name}`,
      Body: file,
      ACL: 'public-read',
    };

    return s3.upload(params).promise();
  }

  public getS3(): AWS.S3 {
    return new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
