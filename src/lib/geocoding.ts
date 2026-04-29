const BASE = 'https://nominatim.openstreetmap.org'
const HEADERS = {
  'Accept-Language': 'sv',
  'User-Agent': 'Pantjakten/1.0 (pantjakten.se)',
}

export interface GeocodingResult {
  displayName: string
  lat: number
  lon: number
}

export async function forwardGeocode(query: string): Promise<GeocodingResult[]> {
  if (query.trim().length < 3) return []
  const params = new URLSearchParams({ q: query, format: 'json', limit: '5', countrycodes: 'se' })
  const res = await fetch(`${BASE}/search?${params}`, { headers: HEADERS })
  if (!res.ok) return []
  const data: Array<{ display_name: string; lat: string; lon: string }> = await res.json()
  return data.map((item) => ({
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
  }))
}

export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon), format: 'json', zoom: '17' })
  const res = await fetch(`${BASE}/reverse?${params}`, { headers: HEADERS })
  if (!res.ok) return null
  const data: { display_name?: string } = await res.json()
  return data.display_name ?? null
}
