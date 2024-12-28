import path from 'node:path';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  type HeadObjectCommandOutput,
  PutObjectCommand,
  S3Client,
  type S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@repo/env';
import { nanoid } from '@repo/utils';

export const storageClient = new S3Client({
  endpoint: env.STORAGE_ENDPOINT,
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
  },
  forcePathStyle: false,
  maxAttempts: 3,
});

/**
 * Generates a pre-signed URL for retrieving an object from a specified
 * bucket.
 *
 * @param {string} key - The key of the object to retrieve.
 * @param {string} [bucket=env.STORAGE_UPLOAD_BUCKET] - The name of the bucket to retrieve from.
 * @param {number} [ttl=600] - The time to live (in seconds) of the pre-signed URL.
 * @returns {Promise<string>} The pre-signed URL.
 */
export async function getPreSignedGetUrl(
  key: string,
  bucket: string = env.STORAGE_UPLOAD_BUCKET,
  ttl = 600
) {
  const getObjectCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(storageClient, getObjectCommand, {
    expiresIn: ttl,
  });

  return signedUrl;
}
/**
 * Generates a pre-signed URL for uploading an object to a specified bucket.
 *
 * @param {string} fileName - The name of the file to upload.
 * @param {string} userId - The ID of the user associated with the file.
 * @param {string} contentType - The content type of the file.
 * @param {string} [bucket=env.STORAGE_UPLOAD_BUCKET] - The name of the bucket to upload to.
 * @param {number} [ttl=600] - The time to live (in seconds) of the pre-signed URL.
 * @returns {Promise<string>} The pre-signed URL.
 */
export async function getPreSignedPutUrl(
  fileName: string,
  userId: string,
  contentType: string,
  bucket: string = env.STORAGE_UPLOAD_BUCKET,
  ttl = 600
) {
  const slugify = await import('@sindresorhus/slugify').then(
    (module) => module.default
  );
  const { name, ext } = path.parse(fileName);

  const slugifiedName = slugify(name) + ext;
  const key = `${userId}/${nanoid(16)}/${slugifiedName}`;
  const putObjectcommand = new PutObjectCommand({
    Bucket: bucket || process.env.STORAGE_UPLOAD_BUCKET,
    Key: key,
    ContentType: contentType,
    ContentDisposition: `attachment; filename="${slugifiedName}"`,
  });

  const signedUrl = await getSignedUrl(storageClient, putObjectcommand, {
    expiresIn: ttl,
  });

  return { url: signedUrl, key, userId, fileName: slugifiedName };
}

/**
 * Retrieves metadata of an object from a specified bucket.
 *
 * @param key - The key of the object to retrieve metadata for.
 * @param bucket - The name of the bucket containing the object. Defaults to `env.STORAGE_UPLOAD_BUCKET`.
 * @returns The metadata of the object if found, otherwise `null` if the object is not found.
 * @throws Will throw an error if the operation fails for reasons other than the object not being found.
 *
 */
export async function headObject(
  key: string,
  bucket: string = env.STORAGE_UPLOAD_BUCKET
): Promise<HeadObjectCommandOutput> {
  try {
    const meta = await storageClient.send(
      new HeadObjectCommand({ Key: key, Bucket: bucket })
    );
    return meta;
  } catch (error) {
    if ((error as S3ServiceException).name === 'NotFound') {
      return {
        $metadata: {
          httpStatusCode: 404, // file not exists
          requestId: '',
          extendedRequestId: '',
          attempts: 0,
          totalRetryDelay: 0,
        },
        AcceptRanges: '',
        ContentLength: 0, // default to 0 when file not exists
        ETag: '',
        ContentType: '',
      };
    }
    throw error;
  }
}

/**
 * Deletes an object from a specified bucket.
 *
 * @param key - The key of the object to delete.
 * @param bucket - The name of the bucket containing the object. Defaults to `env.STORAGE_UPLOAD_BUCKET`.
 * @returns A promise that resolves to an object with a `success` property set to `true`.
 * @throws Will throw an error if the operation fails for reasons other than the object not being found.
 */
export async function deleteObject(
  key: string,
  bucket: string = env.STORAGE_UPLOAD_BUCKET
): Promise<{ success: boolean }> {
  try {
    const res = await storageClient.send(
      new DeleteObjectCommand({ Key: key, Bucket: bucket })
    );
    return { success: true };
  } catch (error) {
    console.error('Error in deleteObject:', error);
    throw error;
  }
}

/**
 * Checks if a URL is stored in the storage service.
 *
 * @param url - The URL to check.
 * @returns True if the URL is stored in the storage service, false otherwise.
 */
export const isStored = (url?: string) => {
  return url && url.startsWith(env.STORAGE_ENDPOINT);
};
