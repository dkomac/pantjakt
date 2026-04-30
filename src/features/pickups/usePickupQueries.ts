import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAvailablePickups,
  fetchPickupById,
  fetchMyPickups,
  claimPickup,
  completePickup,
  cancelPickup,
} from './pickupService'
import { toast } from '../../lib/toastStore'

export const QUERY_KEYS = {
  available: ['pickups', 'available'] as const,
  pickup: (id: string) => ['pickup', id] as const,
  myPickups: (userId: string) => ['my-pickups', userId] as const,
}

export function useAvailablePickups() {
  return useQuery({
    queryKey: QUERY_KEYS.available,
    queryFn: fetchAvailablePickups,
  })
}

export function usePickup(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.pickup(id ?? ''),
    queryFn: () => fetchPickupById(id!),
    enabled: !!id,
  })
}

export function useMyPickups(userId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.myPickups(userId ?? ''),
    queryFn: () => fetchMyPickups(userId!),
    enabled: !!userId,
  })
}

export function usePickupMutations(pickupId: string | undefined) {
  const qc = useQueryClient()

  function invalidate() {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.pickup(pickupId ?? '') })
    qc.invalidateQueries({ queryKey: QUERY_KEYS.available })
  }

  const claim = useMutation({
    mutationFn: (collectorId: string) => claimPickup(pickupId!, collectorId),
    onSuccess: () => { invalidate(); toast.success('Hämtning bokad!') },
    onError: () => toast.error('Kunde inte boka hämtningen.'),
  })

  const complete = useMutation({
    mutationFn: () => completePickup(pickupId!),
    onSuccess: () => { invalidate(); toast.success('Markerad som hämtad!') },
    onError: () => toast.error('Något gick fel.'),
  })

  const cancel = useMutation({
    mutationFn: () => cancelPickup(pickupId!),
    onSuccess: invalidate,
    onError: () => toast.error('Kunde inte avbryta.'),
  })

  return { claim, complete, cancel }
}
