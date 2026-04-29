import { supabase } from '../../lib/supabase'
import type { Pickup } from '../../lib/database.types'
import type { CreatePickupFormData } from './pickupSchemas'

const PICKUP_FIELDS = `
  *,
  donor:profiles!pickups_donor_id_fkey(id, display_name, email),
  collector:profiles!pickups_collector_id_fkey(id, display_name, email)
`

export async function fetchAvailablePickups(): Promise<Pickup[]> {
  const { data, error } = await supabase
    .from('pickups')
    .select(PICKUP_FIELDS)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as Pickup[]
}

export async function fetchPickupById(id: string): Promise<Pickup> {
  const { data, error } = await supabase
    .from('pickups')
    .select(PICKUP_FIELDS)
    .eq('id', id)
    .single()
  if (error) throw error
  return data as unknown as Pickup
}

export async function fetchMyPickups(userId: string): Promise<{ donated: Pickup[]; claimed: Pickup[] }> {
  const [donatedRes, claimedRes] = await Promise.all([
    supabase.from('pickups').select(PICKUP_FIELDS).eq('donor_id', userId).order('created_at', { ascending: false }),
    supabase.from('pickups').select(PICKUP_FIELDS).eq('collector_id', userId).order('created_at', { ascending: false }),
  ])
  if (donatedRes.error) throw donatedRes.error
  if (claimedRes.error) throw claimedRes.error
  return {
    donated: donatedRes.data as unknown as Pickup[],
    claimed: claimedRes.data as unknown as Pickup[],
  }
}

export async function createPickup(
  formData: CreatePickupFormData,
  donorId: string,
  imageFile?: File,
): Promise<Pickup> {
  let imageUrl: string | null = null

  if (imageFile) {
    const ext = imageFile.name.split('.').pop()
    const path = `pickups/${donorId}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('pickup-images').upload(path, imageFile)
    if (uploadError) throw uploadError
    const { data: urlData } = supabase.storage.from('pickup-images').getPublicUrl(path)
    imageUrl = urlData.publicUrl
  }

  const { data, error } = await supabase
    .from('pickups')
    .insert({
      ...formData,
      donor_id: donorId,
      image_url: imageUrl,
      status: 'available',
      collector_id: null,
    })
    .select(PICKUP_FIELDS)
    .single()

  if (error) throw error
  return data as unknown as Pickup
}

export async function claimPickup(pickupId: string, collectorId: string): Promise<void> {
  const { error } = await supabase
    .from('pickups')
    .update({ status: 'claimed', collector_id: collectorId })
    .eq('id', pickupId)
    .eq('status', 'available')
  if (error) throw error
}

export async function completePickup(pickupId: string): Promise<void> {
  const { error } = await supabase
    .from('pickups')
    .update({ status: 'completed' })
    .eq('id', pickupId)
  if (error) throw error
}

export async function cancelPickup(pickupId: string): Promise<void> {
  const { error } = await supabase
    .from('pickups')
    .update({ status: 'cancelled', collector_id: null })
    .eq('id', pickupId)
  if (error) throw error
}
