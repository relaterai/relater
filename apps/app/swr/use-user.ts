import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useUser = () => {
  const { data: user, error, isLoading, mutate } = useSWR('/api/user', fetcher);

  return {
    user,
    isLoading,
    error,
    mutate
  };
};
