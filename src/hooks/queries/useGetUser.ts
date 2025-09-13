import { getUser } from '@/api'
import { CACHE_KEYS } from '@/cacheKeys'
import { useQuery } from '@tanstack/react-query'

export const useGetUsers = () =>
  useQuery({
    queryKey: [CACHE_KEYS.users],
    queryFn: getUser,
    retry: 1
  })
