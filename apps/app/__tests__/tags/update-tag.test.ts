import type z from '@repo/zod';
import type {
  SnapshotSchema,
  createSnapshotSchema,
} from '@repo/zod/schemas/snapshots';
import type { TagSchema } from '@repo/zod/schemas/tags';
import { expect, test } from 'vitest';
import type { HttpClient } from '../utils/http';
import { IntegrationHarness } from '../utils/mock-client';

let h: IntegrationHarness;
let http: HttpClient;

test('PATCH /api/tags/:id', async (ctx) => {
  h = new IntegrationHarness(ctx);
  const { http: client } = await h.init();
  http = client;

  const newSnapshot: z.infer<typeof createSnapshotSchema> = {
    title: 'Prisma Starter',
    snippet: `import { PrismaClient } from '@prisma/client'
              const prisma = new PrismaClient()
              async function main() {
                // ... you will write your Prisma Client queries here
              }
              main()
                .then(async () => {
                  await prisma.$disconnect()
                })
                .catch(async (e) => {
                  console.error(e)
                  await prisma.$disconnect()
                  process.exit(1)
                })`,
    pageUrl: 'https://prisma.io',
    screenshotFileKey: 'test-test-test.tsx',
    snapshotFileKey: 'test-test-test.tsx',
  };

  // Create a snapshot and get the tags
  const { data: snapshotCreated } = await http.post<
    z.infer<typeof SnapshotSchema>
  >({
    path: '/snapshots',
    body: newSnapshot,
  });

  const firstTag = snapshotCreated.tags[0];
  const { status, data: updatedTag } = await http.patch<
    z.infer<typeof TagSchema>
  >({
    path: `/tags/${firstTag.id}`,
    body: {
      name: 'a/b/c',
      color: 'red',
      emoji: '🍎',
      pinned: true,
    },
  });

  expect(status).toEqual(200);
  expect(updatedTag.name).toEqual('a/b/c');
  expect(updatedTag.color).toEqual('red');
  expect(updatedTag.emoji).toEqual('🍎');
  expect(updatedTag.pinned).toEqual(true);

  await Promise.all([
    ...(snapshotCreated.tags ?? []).map((tag: { id: string }) =>
      h.deleteTag(tag.id, false)
    ),
    h.deleteSnapshot(snapshotCreated.id),
  ]);
});
