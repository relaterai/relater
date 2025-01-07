import type { Prisma } from '@repo/database';
import { getPreSignedGetUrl } from '@repo/storage';

export const signedFileUrl = async (
  snapshots: Prisma.SnapshotGetPayload<{}>[]
): Promise<Array<Prisma.SnapshotGetPayload<{}>>> => {
  return Promise.all(
    snapshots.map(async (snapshot) => {
      const [snapshotUrl, screenshotUrl] = await Promise.all([
        snapshot.snapshotFileKey
          ? getPreSignedGetUrl(snapshot.snapshotFileKey, process.env.STORAGE_UPLOAD_BUCKET, 600, 'text/html')
          : null,
        snapshot.screenshotFileKey
          ? getPreSignedGetUrl(snapshot.screenshotFileKey)
          : null,
      ]);

      return {
        ...snapshot,
        snapshotFileKey: snapshotUrl,
        screenshotFileKey: screenshotUrl,
      };
    })
  );
};
