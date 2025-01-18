import useSWR from 'swr';
import z from '@repo/zod';
import { getTagsQuerySchema } from '@repo/zod/schemas/tags';

const fetcher = async (url: string, { params }: { params?: Record<string, any> }) => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  const urlWithParams = `${url}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const res = await fetch(urlWithParams);
  if (!res.ok) {
    throw new Error('Failed to fetch tags');
  }
  return res.json();
};

export function useTags(params?: Partial<z.infer<typeof getTagsQuerySchema>>) {
  const { data, error, isLoading, mutate } = useSWR(
    ['/api/tags', params],
    ([url, queryParams]) => fetcher(url, { params: queryParams }),
    {
      keepPreviousData: true,
    }
  );

  return {
    tags: data ? z.array(z.object({
      id: z.string(),
      name: z.string(),
      emoji: z.string().optional(),
      pinned: z.boolean().optional(),
      snapshotsCount: z.number().optional()
    })).parse(data.items) : undefined,
    total: data?.total,
    counts: data?.counts,
    error,
    isLoading,
    mutate,
  };
}
