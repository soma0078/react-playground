import { useQuery } from '@tanstack/react-query'

import { getUser } from '@/api'
import { CACHE_KEYS } from '@/constants'

export const useGetUsers = () =>
  useQuery({
    queryKey: [CACHE_KEYS.users],
    queryFn: getUser,
    retry: 1
  })
