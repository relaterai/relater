import type { User } from '@repo/database';
import { fetcher } from '@repo/utils';
import useSwrImmutable from 'swr/immutable';

export default function useUser() {
  const { data, isLoading } = useSwrImmutable<User>('/api/user', fetcher);

  return {
    user: data,
    loading: isLoading,
  };
}
