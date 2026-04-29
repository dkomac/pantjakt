export type { Pickup, PickupStatus } from '../../lib/database.types'

export type SortOption = 'newest' | 'value' | 'distance'

export interface PickupFilters {
  sort: SortOption
  userLat?: number
  userLon?: number
}
