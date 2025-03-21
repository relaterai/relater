import type z from '@repo/zod';
import type {
  SnapshotSchema,
  createSnapshotSchema,
} from '@repo/zod/schemas/snapshots';
import type { TagSchema } from '@repo/zod/schemas/tags';
import { expect, test } from 'vitest';
import { IntegrationHarness } from '../utils/mock-client';

test('GET /api/tags', async (ctx) => {
  const h = new IntegrationHarness(ctx);
  const { http } = await h.init();

  const newSnapshot: z.infer<typeof createSnapshotSchema> = {
    title: 'Test Snapshot',
    snippet: 'Test Snippet',
    pageUrl: 'https://relater.ai',
    screenshotFileKey: 'test-test-test.tsx',
    snapshotFileKey: 'test-test-test.tsx',
  };

  const { data: snapshotCreated } = await http.post<
    z.infer<typeof SnapshotSchema>
  >({
    path: '/snapshots',
    body: newSnapshot,
  });
  /**
   * List tags with all=true and withSnapshotsCount=true
   */
  const firstTag = snapshotCreated.tags[0];
  const {
    status,
    data: { items: tags },
  } = await http.get<{ items: z.infer<typeof TagSchema>[] }>({
    path: '/tags?all=true&withSnapshotsCount=true',
  });

  expect(status).toEqual(200);
  expect(tags).toBeInstanceOf(Array);
  expect(tags.length).toBeGreaterThanOrEqual(1);
  expect(snapshotCreated.tags.length).toBeGreaterThanOrEqual(1);

  expect(tags).toContainEqual(
    expect.objectContaining({
      id: firstTag.id,
      name: firstTag.name,
      color: firstTag.color,
      emoji: firstTag.emoji,
      isAutoGenerated: true,
      snapshotsCount: expect.any(Number),
    })
  );

  /**
   * Search tags by prefix
   */
  const prefix = firstTag.name.split('/').slice(0, 1).join('/');
  console.log(prefix, 'prefix');
  const {
    status: statusSearch,
    data: { items: tagsSearch },
  } = await http.get<{ items: z.infer<typeof TagSchema>[] }>({
    path: `/tags?tagName=${prefix}`,
  });

  expect(statusSearch).toEqual(200);
  expect(tagsSearch).toBeInstanceOf(Array);
  expect(tagsSearch.length).toBeGreaterThanOrEqual(1);
  expect(snapshotCreated.tags.length).toBeGreaterThanOrEqual(1);

  expect(tagsSearch).toContainEqual(
    expect.objectContaining({
      id: firstTag.id,
      name: firstTag.name,
      color: firstTag.color,
      emoji: firstTag.emoji,
      isAutoGenerated: true,
      snapshotsCount: expect.any(Number),
    })
  );
  await Promise.all([
    ...(snapshotCreated.tags ?? []).map((tag: { id: string }) =>
      h.deleteTag(tag.id, false)
    ),
    h.deleteSnapshot(snapshotCreated.id),
  ]);
});
