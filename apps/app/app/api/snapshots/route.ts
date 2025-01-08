import { genSnapshotTags } from '@/lib/functions/snapshots/gen-tags';
import { getSnapshots } from '@/lib/functions/snapshots/get-snapshots';
import { cleanUserSnapshotsCount } from '@/lib/functions/users/get-user-snapshots-count';
import { cleanUserTagsCount } from '@/lib/functions/users/get-user-tags-count';
import { parseRequestBody } from '@/lib/utils';
import { withSession } from '@repo/auth/session';
import prisma, { type Prisma } from '@repo/database';
import { isStored } from '@repo/storage';
import z from '@repo/zod';
import {
  SnapshotSchema,
  createSnapshotSchema,
  getSnapshotsQuerySchema,
} from '@repo/zod/schemas/snapshots';
import { waitUntil } from '@vercel/functions';
import { NextResponse } from 'next/server';

// GET /api/snapshots – get snapshots
export const GET = withSession(async ({ req, session, searchParams }) => {
  const { page, pageSize, withTags, sort, tagName, tagIds, search, isDeleted } =
    getSnapshotsQuerySchema.parse(searchParams);
  const { snapshots, pagination } = await getSnapshots({
    userId: session.user.id,
    page,
    pageSize,
    withTags,
    sort,
    tagName,
    tagIds,
    search,
    withCount: true,
    isDeleted,
  });
  return NextResponse.json({
    items: z.array(SnapshotSchema).parse(snapshots),
    pagination,
  });
});

// POST /api/snapshots – create a new snapshot
export const POST = withSession(async ({ req, session }) => {
  const { snapshotFileKey, title, snippet, tags, screenshotFileKey, pageUrl } =
    createSnapshotSchema.parse(await parseRequestBody(req));
  const newTags = await genSnapshotTags({
    title,
    snippet,
    tags,
    imageBase64: screenshotFileKey,
  });

  const newSnapshot = await prisma.snapshot.create({
    data: {
      screenshotFileKey: isStored(screenshotFileKey)
        ? screenshotFileKey?.split('/').pop()
        : screenshotFileKey,
      snapshotFileKey: isStored(snapshotFileKey)
        ? snapshotFileKey?.split('/').pop()
        : snapshotFileKey,
      pageUrl: pageUrl,
      userId: session.user.id,
      title: title || '',
      storageUsage: 0, // TODO: calculate storage usage
      aiTokensUsage: 0, // TODO: calculate ai tokens usage
    },
  });
  const createManyTagsData: Prisma.TagCreateInput[] = newTags.tags.allTags.map(
    (tag) => ({
      name: tag.replace(/^#/, ''),
      userId: session.user.id,
      isAutoGenerated: true,
      snapshots: {
        connect: {
          id: newSnapshot.id,
        },
      },
    })
  );

  // add user-defined tags
  if (tags) {
    createManyTagsData.push(
      ...tags.map((tag) => ({
        name: tag.replace(/^#/, ''),
        userId: session.user.id,
        isAutoGenerated: false,
        snapshots: {
          connect: {
            id: newSnapshot.id,
          },
        },
      }))
    );
  }
  const createdTags = await Promise.all(
    createManyTagsData.map(async (newTag) => {
      return await prisma.tag.upsert({
        where: {
          userId_name: {
            userId: session.user.id,
            name: newTag.name,
          },
        },
        update: newTag,
        create: newTag,
        select: {
          id: true,
          color: true,
          name: true,
          emoji: true,
        },
      });
    })
  );
  waitUntil(cleanUserTagsCount(session.user.id));
  waitUntil(cleanUserSnapshotsCount(session.user.id));
  return NextResponse.json({
    ...newSnapshot,
    tags: createdTags,
  });
});
