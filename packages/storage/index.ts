import { env } from '@repo/env';
import { fetchWithTimeout } from '@repo/utils';
import { AwsClient } from 'aws4fetch';

interface ImageOptions {
  contentType?: string;
  width?: number;
  height?: number;
}

class StorageClient {
  private client: AwsClient;

  constructor() {
    this.client = new AwsClient({
      accessKeyId: env.STORAGE_ACCESS_KEY_ID || '',
      secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY || '',
      service: 's3',
      region: 'auto',
    });
  }

  async upload(key: string, body: Blob | Buffer | string, opts?: ImageOptions) {
    let uploadBody;
    if (typeof body === 'string') {
      if (this.isBase64(body)) {
        uploadBody = this.base64ToArrayBuffer(body, opts);
      } else if (this.isUrl(body)) {
        uploadBody = await this.urlToBlob(body, opts);
      } else {
        throw new Error('Invalid input: Not a base64 string or a valid URL');
      }
    } else {
      uploadBody = body;
    }

    const headers: Record<string, string> = {
      'Content-Length':
        uploadBody instanceof Blob
          ? uploadBody.size.toString()
          : Buffer.byteLength(uploadBody).toString(),
    };
    if (opts?.contentType) headers['Content-Type'] = opts.contentType;

    try {
      await this.client.fetch(`${process.env.STORAGE_ENDPOINT}/${key}`, {
        method: 'PUT',
        headers,
        body: uploadBody,
      });

      return {
        url: `${env.STORAGE_BASE_URL}/${key}`,
      };
    } catch (error: unknown) {
      throw new Error(
        `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async fetch(key: string) {
    return this.client.fetch(`${env.STORAGE_BASE_URL}/${key}`);
  }

  async delete(key: string) {
    await this.client.fetch(`${env.STORAGE_BASE_URL}/${key}`, {
      method: 'DELETE',
    });

    return { success: true };
  }

  async getSignedUrl(key: string) {
    const url = new URL(`${env.STORAGE_BASE_URL}/${key}`);

    // 10 minutes expiration
    url.searchParams.set('X-Amz-Expires', '600');

    const signed = await this.client.sign(url, {
      method: 'PUT',
      aws: {
        signQuery: true,
        allHeaders: true,
      },
    });

    return signed.url;
  }

  private base64ToArrayBuffer(base64: string, opts?: ImageOptions) {
    const base64Data = base64.replace(/^data:.+;base64,/, '');
    const paddedBase64Data = base64Data.padEnd(
      base64Data.length + ((4 - (base64Data.length % 4)) % 4),
      '='
    );

    const binaryString = atob(paddedBase64Data);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    const blobProps: { type?: string } = {};
    if (opts?.contentType) blobProps.type = opts.contentType;
    return new Blob([byteArray], blobProps);
  }

  private isBase64(str: string): boolean {
    const regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,([^\s]*)$/;
    return regex.test(str);
  }

  private isUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  }

  private async urlToBlob(url: string, opts?: ImageOptions): Promise<Blob> {
    let response: Response;
    if (opts?.height || opts?.width) {
      try {
        const proxyUrl = new URL('https://wsrv.nl');
        proxyUrl.searchParams.set('url', url);
        if (opts.width) proxyUrl.searchParams.set('w', opts.width.toString());
        if (opts.height) proxyUrl.searchParams.set('h', opts.height.toString());
        proxyUrl.searchParams.set('fit', 'cover');
        response = await fetchWithTimeout(proxyUrl.toString());
      } catch (error) {
        response = await fetch(url);
      }
    } else {
      response = await fetch(url);
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const blob = await response.blob();
    if (opts?.contentType) {
      return new Blob([blob], { type: opts.contentType });
    }
    return blob;
  }
}

export const storage = new StorageClient();

export const isStored = (url: string) => {
  return url.startsWith(env.STORAGE_BASE_URL);
};
