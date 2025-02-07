import useSWR, { mutate } from 'swr';
import z from '@repo/zod';
import { SnapshotSchema } from '@repo/zod/schemas/snapshots';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('获取笔记失败');
  }
  const json = await res.json();
  return {
    ...json,
    createdAt: new Date(json.createdAt),
    updatedAt: new Date(json.updatedAt)
  };
};

export function useSnapshot(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/snapshots/${id}` : null,
    fetcher
  );

  return {
    snapshot: data ? SnapshotSchema.parse(data) : undefined,
    error,
    isLoading,
    mutate
  };
}
