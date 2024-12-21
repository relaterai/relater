import z from '../index';

// Schema to validate file upload parameters
export const fileUploadPreSignedUrlSchema = z.object({
  fileName: z
    .string({
      required_error: 'File name is required',
    })
    .min(1, 'File name cannot be empty'),
  userId: z
    .string({
      required_error: 'User ID is required',
    })
    .min(1, 'User ID cannot be empty')
    .optional()
    .nullable(),
  contentType: z
    .string({
      required_error: 'Content type is required',
    })
    .min(1, 'Content type cannot be empty'),
  bucket: z.string().optional(),
  ttl: z.number().int().positive().optional().default(600),
});

// Schema to validate file download parameters
export const fileDownloadPreSignedUrlSchema = z.object({
  key: z
    .string({
      required_error: 'Key is required',
    })
    .min(1, 'Key cannot be empty'),
  bucket: z.string().optional(),
  ttl: z.number().int().positive().optional().default(600),
});
