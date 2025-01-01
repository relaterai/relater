import type z from '@repo/zod';
import type {
  SnapshotSchema,
  createSnapshotSchema,
} from '@repo/zod/schemas/snapshots';
import { expect, test } from 'vitest';
import { IntegrationHarness } from '../utils/mock-client';

// Test: List snapshots in trash
test('GET /api/snapshots?isDeleted=true', async (ctx) => {
  const h = new IntegrationHarness(ctx);
  const { http } = await h.init();

  const newSnapshot: z.infer<typeof createSnapshotSchema> = {
    title: 'Stripe StripeJS ESModule',
    snippet: `import {loadStripe} from '@stripe/stripe-js';
              const stripe = await loadStripe('pk_test_GvF3BSyx8RSXMK5yAFhqEd3H');`,
    pageUrl: 'https://docs.stripe.com/sdks/stripejs-esmodule',
    screenshotFileKey: 'test-test-test.tsx',
    snapshotFileKey: 'test-test-test.tsx',
  };

  const { data: snapshotCreated } = await http.post<
    z.infer<typeof SnapshotSchema>
  >({
    path: '/snapshots',
    body: newSnapshot,
  });

  // Move to trash
  const { data: snapshotUpdated } = await http.patch<
    z.infer<typeof SnapshotSchema>
  >({
    path: `/snapshots/${snapshotCreated.id}`,
    body: {
      isDeleted: true,
    },
  });

  const {
    status,
    data: { items: snapshots },
  } = await http.get<{ items: z.infer<typeof SnapshotSchema>[] }>({
    path: '/snapshots?page=1&pageSize=10&isDeleted=true',
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
      isDeleted: true,
      // tags: snapshotCreated.tags,
    })
  );

  // Restore from trash
  const { data: snapshotRestored } = await http.patch<
    z.infer<typeof SnapshotSchema>
  >({
    path: `/snapshots/${snapshotCreated.id}`,
    body: {
      isDeleted: false,
    },
  });

  expect(snapshotRestored).toEqual(
    expect.objectContaining({
      // ...snapshotCreated,
      id: snapshotCreated.id,
      title: snapshotCreated.title,
      screenshotFileKey: expect.any(String),
      snapshotFileKey: expect.any(String),
      isDeleted: false,
      // tags: snapshotCreated.tags,
    })
  );

  // Cleanup
  await Promise.all([
    ...(snapshotCreated.tags ?? []).map((tag: { id: string }) =>
      h.deleteTag(tag.id, false)
    ),
    h.deleteSnapshot(snapshotCreated.id),
  ]);
});
