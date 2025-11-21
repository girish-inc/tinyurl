// React-query hook that fetches all links + refetch function

import { useQuery } from '@tanstack/react-query'
import { fetchLinks } from '../utils/api'

export function useLinksQuery() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['links'],
    queryFn: fetchLinks,
  })

  return {
    links: data || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  }
}

