import useSWR from 'swr';
import z from '@repo/zod';
import { getSnapshotsQuerySchema, SnapshotSchema } from '@repo/zod/schemas/snapshots';

const fetcher = async (url: string, { params }: { params?: Record<string, any> }) => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const urlWithParams = `${url}${searchParams.toString() ? `?${decodeURIComponent(searchParams.toString())}` : ''}`;
  const res = await fetch(urlWithParams);
  if (!res.ok) {
    throw new Error('Failed to fetch snapshots');
  }
  const json = await res.json();
  return {
    ...json,
    items: json.items.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    }))
  };
};

export function useSnapshots(params?: Partial<z.infer<typeof getSnapshotsQuerySchema>>) {
  const { data, error, isLoading, mutate } = useSWR(
    ['/api/snapshots', params],
    ([url, queryParams]) => fetcher(url, { params: queryParams }),
    {
      keepPreviousData: true,
    }
  );

  return {
    snapshots: data ? z.array(SnapshotSchema).parse(data.items) : undefined,
    total: data?.pagination?.total,
    error,
    isLoading,
    mutate,
  };
}
