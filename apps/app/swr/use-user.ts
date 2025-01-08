import useSWRImmutable from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useUser = () => {
  const { data: user, error, isLoading } = useSWRImmutable('/api/user', fetcher);

  return {
    user,
    isLoading,
    error
  };
};
