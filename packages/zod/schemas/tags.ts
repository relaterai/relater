import { TagColor } from '@repo/database';
import z from '../index';
import { getPaginationQuerySchema } from './misc';
import { SnapshotSchema } from './snapshots';

export const SNAPSHOTS_MAX_PAGE_SIZE = 100;

export const getTagsQuerySchema = z
  .object({
    search: z
      .string()
      .optional()
      .describe('The search term to filter the tags by.'),
    name: z
      .string()
      .optional()
      .describe(
        'The name of the tag to filter by. Supports exact match or startsWith pattern matching.'
      ),
    ids: z
      .union([z.string(), z.array(z.string())])
      .transform((v) => (Array.isArray(v) ? v : v.split(',')))
      .optional()
      .describe('IDs of tags to filter by.'),
    sort: z
      .enum(['createdAt', 'updatedAt'])
      .optional()
      .describe('The field to sort by.'),
    withSnapshots: z
      .boolean()
      .optional()
      .refine((v) => v, {
        message: 'Not implemented yet.',
      })
      .describe('Whether to include snapshots. Not implemented yet.'),
    withSnapshotsCount: z
      .boolean()
      .optional()
      .describe('Whether to include snapshots count.'),
    all: z.boolean().optional().describe('Whether to include all tags.'),
  })
  .merge(getPaginationQuerySchema({ pageSize: SNAPSHOTS_MAX_PAGE_SIZE }));

// Schema to validate the request body when updating a tag
export const updateTagSchema = z.object({
  name: z.string().optional().describe('Name of the tag'),
  color: z.nativeEnum(TagColor).optional().describe('Color of the tag'),
  emoji: z.string().optional().describe('Emoji of the tag'),
  pinned: z.boolean().optional().describe('Whether to pin the tag'),
});

export const TagSchema = z
  .object({
    id: z.string().describe('The unique ID of the tag.'),
    name: z.string().describe('The name of the tag.'),
    color: z.nativeEnum(TagColor).describe('The color of the tag.'),
    emoji: z.string().describe('The emoji of the tag.'),
    isAutoGenerated: z.boolean().describe('Whether the tag is auto-generated.'),
    createdAt: z.date().describe('The creation date of the tag.'),
    updatedAt: z.date().describe('The update date of the tag.'),
    snapshots: z
      .array(z.union([z.lazy(() => SnapshotSchema), z.never()]))
      .optional()
      .describe('The snapshots of the tag.'),
  })
  .openapi({
    title: 'Tag',
  });

// Schema to validate the request body when disconnecting tags from a snapshot
export const disconnectTagsSchema = TagSchema.pick({
  id: true,
});

// Schema to validate the request body when deleting a tag and its snapshots
export const deleteTagSchema = TagSchema.pick({
  id: true,
}).extend({
  deleteSnapshot: z
    .boolean()
    .optional()
    .describe('Whether to delete related snapshots.'),
});

export const deleteTagQuerySchema = z.object({
  deleteSnapshot: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === 'boolean') return val;
      return val === 'true';
    })
    .optional()
    .describe('Whether to delete related snapshots.'),
});
