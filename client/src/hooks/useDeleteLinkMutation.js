// Mutation for deleting, invalidates on success

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteLink } from '../utils/api'

export function useDeleteLinkMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })
}

