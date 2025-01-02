import z from '../index';
import { getPaginationQuerySchema } from './misc';
import { TagSchema } from './tags';

export const SNAPSHOTS_MAX_PAGE_SIZE = 100;

export const getSnapshotsQuerySchema = z
  .object({
    search: z
      .string()
      .optional()
      .describe(
        'The search term to filter snapshots by title, summary or note.'
      ),
    tagName: z
      .string()
      .optional()
      .describe(
        'The tag name to filter snapshots by. Supports exact match or startsWith pattern matching.'
      ),
    tagId: z.string().optional().describe('The tag ID to filter snapshots by.'),
    tagIds: z
      .union([z.string(), z.array(z.string())])
      .transform((v) => (Array.isArray(v) ? v : v.split(',')))
      .optional()
      .describe('IDs of tags to filter by.'),
    sort: z
      .enum(['createdAt', 'updatedAt'])
      .optional()
      .describe('The field to sort by.'),
    withTags: z.boolean().optional().describe('Whether to include tags.'),
    withCount: z.boolean().optional().describe('Whether to include count.'),
    isDeleted: z
      .union([z.boolean(), z.string()])
      .transform((v) => (typeof v === 'boolean' ? v : v === 'true'))
      .optional()
      .describe('Whether to return snapshots in trash.'),
  })
  .merge(getPaginationQuerySchema({ pageSize: SNAPSHOTS_MAX_PAGE_SIZE }));

// Schema to validate the request body when creating a new snapshot
export const createSnapshotSchema = z
  .object({
    snapshotFileKey: z.string().optional(),
    screenshotFileKey: z.string().optional().describe('Screenshot of the page'),
    title: z.string().optional().describe('Title of the snapshot'),
    snippet: z
      .string()
      .optional()
      .describe('Short description of the snapshot'),
    tags: z
      .array(z.string())
      .describe('Tags for the snapshot (manually added by user)')
      .optional(),
    note: z.string().optional().describe('User note for the snapshot'),
    pageUrl: z.string().optional().describe('URL of the page'),
  })
  .refine(
    (data) => data.screenshotFileKey?.length || data.title || data.snippet,
    {
      message:
        'At least one of the fields "screenshotFileKey", "title", or "snippet" must be provided',
    }
  );

// Schema to validate the request body when updating a snapshot
export const updateSnapshotSchema = z.object({
  tags: z
    .array(z.string())
    .optional()
    .describe('Tags for the snapshot (manually added by user)'),
  snapshotId: z
    .string({
      required_error: 'Snapshot ID is required',
    })
    .min(5),
  note: z.string().optional().describe('User note for the snapshot'),
  pinned: z.boolean().optional().describe('Whether to pin the snapshot'),
  isDeleted: z
    .boolean()
    .optional()
    .describe('Whether to move the snapshot to trash'),
});

// Schema to validate the request body when deleting a snapshot
export const deleteSnapshotSchema = z.object({
  snapshotId: z
    .string({
      required_error: 'Snapshot ID is required',
    })
    .min(5),
});

export const SnapshotSchema: z.ZodType = z
  .object({
    id: z.string().describe('The unique ID of the snapshot.'),
    title: z.string().describe('The title of the snapshot.'),
    // tags: z.array(TagSchema).describe('The tags of the snapshot.'),
    screenshotFileKey: z
      .string()
      .nullable()
      .describe('The screenshot file key of the snapshot.'),
    snapshotFileKey: z
      .string()
      .nullable()
      .describe('The snapshot file key of the snapshot.'),
    // screenshotUrl: z
    //   .string()
    //   .url()
    //   .describe('The screenshot URL of the snapshot.'),
    // snapshotUrl: z
    //   .string()
    //   .url()
    //   .optional()
    //   .describe('The snapshot URL of the snapshot.'),
    pageUrl: z.string().describe('The page URL of the snapshot.'),
    storageUsage: z.number().describe('The storage usage of the snapshot.'),
    createdAt: z.date().describe('The creation date of the snapshot.'),
    updatedAt: z.date().describe('The update date of the snapshot.'),
    isDeleted: z
      .boolean()
      .optional()
      .nullable()
      .describe('Whether the snapshot is deleted.'),
    deletedAt: z
      .date()
      .optional()
      .nullable()
      .describe('The deletion date of the snapshot.'),
    tags: z
      .union([z.array(z.lazy(() => TagSchema)), z.array(z.unknown())])
      .describe('The tags of the snapshot.'),
  })
  .openapi({
    title: 'Snapshot',
  });
