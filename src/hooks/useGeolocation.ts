import { useState, useCallback } from 'react'

interface GeolocationState {
  coords: GeolocationCoordinates | null
  loading: boolean
  error: string | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: false,
    error: null,
  })

  const locate = useCallback((onSuccess?: (coords: GeolocationCoordinates) => void) => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation stöds inte av din webbläsare.' }))
      return
    }
    setState((s) => ({ ...s, loading: true, error: null }))
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({ coords: pos.coords, loading: false, error: null })
        onSuccess?.(pos.coords)
      },
      () => {
        setState((s) => ({ ...s, loading: false, error: 'Kunde inte hämta din plats.' }))
      },
    )
  }, [])

  return { ...state, locate }
}
