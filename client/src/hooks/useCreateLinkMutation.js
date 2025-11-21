// Mutation for creating link, invalidates links query on success

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLink } from '../utils/api'

export function useCreateLinkMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })
}

