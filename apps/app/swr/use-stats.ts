import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch stats')
  }
  return res.json()
}

export interface UserStats {
  totalPosts: number
  totalComments: number
  totalLikes: number
}

export function useStats() {
  const { data, error, isLoading } = useSWR<UserStats>(
    '/api/user/stats',
    fetcher
  )

  return {
    stats: data,
    isLoading,
    isError: error
  }
}
