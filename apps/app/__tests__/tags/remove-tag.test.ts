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

test.sequential('DELETE /api/tags/:id?deleteSnapshot=false', async (ctx) => {
  h = new IntegrationHarness(ctx);
  const { http: client } = await h.init();
  http = client;

  const newSnapshot: z.infer<typeof createSnapshotSchema> = {
    title: 'Next.js Dynamic Routes Example',
    snippet: `export default async function Page({
                params,
              }: {
                params: Promise<{ slug: string }>
              }) {
                const slug = (await params).slug
                return <div>My Post: {slug}</div>
              }`,
    pageUrl:
      'https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes',
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
  const { status, data: deletedTag } = await http.delete<
    z.infer<typeof TagSchema>
  >({
    path: `/tags/${firstTag.id}?deleteSnapshot=false`,
  });

  expect(status).toEqual(200);
  expect(deletedTag.id).toEqual(firstTag.id);

  await Promise.all([
    ...(snapshotCreated.tags ?? [])
      .filter((tag: { id: string }) => tag.id !== firstTag.id)
      .map((tag: { id: string }) => h.deleteTag(tag.id, false)),
    h.deleteSnapshot(snapshotCreated.id),
  ]);
});

test.sequential('DELETE /api/tags/:id?deleteSnapshot=true', async (ctx) => {
  h = new IntegrationHarness(ctx);
  const { http: client } = await h.init();
  http = client;

  const newSnapshot: z.infer<typeof createSnapshotSchema> = {
    title: 'Next.js CSS Modules Example',
    snippet: `import styles from './styles.module.css'
              export default function Page({ children }: { children: React.ReactNode }) {
                return <main className={styles.blog}>{children}</main>
              }`,
    pageUrl: 'https://nextjs.org/docs/app/getting-started/css-and-styling',
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
  const { status, data: deletedTag } = await http.delete<
    z.infer<typeof TagSchema>
  >({
    path: `/tags/${firstTag.id}?deleteSnapshot=true`,
  });

  expect(status).toEqual(200);
  expect(deletedTag.id).toEqual(firstTag.id);

  await Promise.all([
    ...(snapshotCreated.tags ?? [])
      .filter((tag: { id: string }) => tag.id !== firstTag.id)
      .map((tag: { id: string }) => h.deleteTag(tag.id, false)),
    h.deleteSnapshot(snapshotCreated.id),
  ]);
});
