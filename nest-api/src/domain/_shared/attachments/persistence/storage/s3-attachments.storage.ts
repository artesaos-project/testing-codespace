import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/shared/env/env';

export interface UploadParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

@Injectable()
export class S3AttachmentsStorage {
  private client: S3Client;

  constructor(
      private readonly s3Client: S3Client,
      private readonly config: ConfigService<Env, true>,
  ) {
    this.client = new S3Client({
      endpoint: this.config.get('STORAGE_URL', { infer: true }),
      region: 'auto',
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.config.get('STORAGE_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: this.config.get('STORAGE_SECRET_ACCESS_KEY', { infer: true }),
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{id: string}> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.get('STORAGE_BUCKET_NAME', { infer: true }),
        Key: fileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    return {
      id: fileName,
    };
  }

  async getUrlByFileName(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.get('STORAGE_BUCKET_NAME', { infer: true }),
      Key: fileName,
    });

    const url = await getSignedUrl(
      this.client,
      command,
      { expiresIn: 60 * 60 * 24 }, // 24 hour expiration
    );

    return this.convertToPublicUrl(url);
  }

  private convertToPublicUrl(url: string): string {
    // Substitui localhost:9000 pela URL pública do GitHub Codespaces
    return url.replace(
      'http://localhost:9000',
      'https://verbose-space-dollop-jwg7vpv9v64fq9x9-9000.app.github.dev'
    );
  }
}


