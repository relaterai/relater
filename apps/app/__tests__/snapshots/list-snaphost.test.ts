import type z from '@repo/zod';
import type {
  SnapshotSchema,
  createSnapshotSchema,
} from '@repo/zod/schemas/snapshots';
import { afterAll, expect, test } from 'vitest';
import { IntegrationHarness } from '../utils/mock-client';

test('GET /snapshots', async (ctx) => {
  const h = new IntegrationHarness(ctx);
  const { http } = await h.init();

  const newSnapshot: z.infer<typeof createSnapshotSchema> = {
    title: 'Test Snapshot',
    snippet: 'Test Snippet',
    pageUrl: 'https://example.com',
    screenshotFileKey: 'test-test-test.tsx',
    snapshotFileKey: 'test-test-test.tsx',
  };

  const { data: snapshotCreated } = await http.post<
    z.infer<typeof SnapshotSchema>
  >({
    path: '/snapshots',
    body: newSnapshot,
  });
  const {
    status,
    data: { items: snapshots },
  } = await http.get<{ items: z.infer<typeof SnapshotSchema>[] }>({
    path: '/snapshots?page=1&pageSize=10',
  });

  expect(status).toEqual(200);
  expect(snapshots).toBeInstanceOf(Array);
  expect(snapshots.length).toBeGreaterThanOrEqual(1);
  const snapshotFound = snapshots.find((s) => s.id === snapshotCreated.id);

  expect(snapshotFound).toEqual(
    expect.objectContaining({
      // ...snapshotCreated,
      id: snapshotCreated.id,
      title: snapshotCreated.title,
      screenshotFileKey: expect.any(String),
      snapshotFileKey: expect.any(String),
      tags: snapshotCreated.tags,
    })
  );

  afterAll(async () => {
    await h.deleteSnapshot(snapshotCreated.id);
  });
});
