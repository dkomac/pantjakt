export type PickupStatus = 'available' | 'claimed' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  email: string
  display_name: string | null
  created_at: string
}

export interface Pickup {
  id: string
  donor_id: string
  title: string
  description: string | null
  can_count: number
  estimated_value: number
  address: string
  latitude: number
  longitude: number
  pickup_window_start: string
  pickup_window_end: string
  instructions: string | null
  image_url: string | null
  status: PickupStatus
  collector_id: string | null
  created_at: string
  updated_at: string
  donor?: Profile
  collector?: Profile | null
}
