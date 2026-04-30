import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createPickupSchema, type CreatePickupFormData } from './pickupSchemas'
import { createPickup } from './pickupService'
import { useAuth } from '../auth/useAuth'
import { FormField } from '../../components/ui/FormField'
import { Button } from '../../components/ui/Button'
import { toast } from '../../lib/toastStore'
import { LocationPickerMap } from '../../components/map/LocationPickerMap'
import { forwardGeocode, reverseGeocode, type GeocodingResult } from '../../lib/geocoding'
import { toLocalDatetimeValue, ONE_DAY_MS } from '../../lib/dateUtils'
import { useGeolocation } from '../../hooks/useGeolocation'
import { ROUTES } from '../../lib/routes'
import { QUERY_KEYS } from './usePickupQueries'

export function CreatePickupPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [imageFile, setImageFile] = useState<File | undefined>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const reverseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipNextReverse = useRef(false)

  const { loading: locating, locate } = useGeolocation()

  const now = new Date()
  const later = new Date(now.getTime() + ONE_DAY_MS)

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreatePickupFormData>({
    resolver: zodResolver(createPickupSchema),
    defaultValues: {
      pickup_window_start: toLocalDatetimeValue(now),
      pickup_window_end: toLocalDatetimeValue(later),
      latitude: 59.3293,
      longitude: 18.0686,
    },
  })

  const lat = watch('latitude')
  const lon = watch('longitude')
  const addressValue = watch('address')

  useEffect(() => {
    return () => {
      if (reverseTimer.current) clearTimeout(reverseTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!addressValue || addressValue.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    const timer = setTimeout(async () => {
      setGeocoding(true)
      const results = await forwardGeocode(addressValue)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setGeocoding(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [addressValue])

  function selectSuggestion(result: GeocodingResult) {
    skipNextReverse.current = true
    setValue('address', result.displayName, { shouldValidate: true })
    setValue('latitude', result.lat, { shouldValidate: true })
    setValue('longitude', result.lon, { shouldValidate: true })
    setFlyTarget([result.lat, result.lon])
    setShowSuggestions(false)
    setSuggestions([])
  }

  function handleMapChange(newLat: number, newLon: number) {
    setValue('latitude', newLat, { shouldValidate: true })
    setValue('longitude', newLon, { shouldValidate: true })

    if (skipNextReverse.current) {
      skipNextReverse.current = false
      return
    }

    if (reverseTimer.current) clearTimeout(reverseTimer.current)
    reverseTimer.current = setTimeout(async () => {
      const address = await reverseGeocode(newLat, newLon)
      if (address) {
        setValue('address', address, { shouldValidate: true })
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 600)
  }

  function locateMe() {
    locate(async (coords) => {
      const { latitude, longitude } = coords
      skipNextReverse.current = true
      setValue('latitude', latitude, { shouldValidate: true })
      setValue('longitude', longitude, { shouldValidate: true })
      setFlyTarget([latitude, longitude])
      const address = await reverseGeocode(latitude, longitude)
      if (address) setValue('address', address, { shouldValidate: true })
    })
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const mutation = useMutation({
    mutationFn: (data: CreatePickupFormData) => createPickup(data, user!.id, imageFile),
    onSuccess: (pickup) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.available })
      toast.success('Hämtning publicerad!')
      navigate(ROUTES.pickup(pickup.id))
    },
    onError: (err: Error) => toast.error(err.message ?? 'Något gick fel.'),
  })

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Skapa hämtning</h1>
      <p className="text-sm text-gray-400 mb-5">Fyll i detaljer och välj plats på kartan</p>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField label="Titel" error={errors.title?.message}>
          <input type="text" {...register('title')} className="input" placeholder="T.ex. Pant utanför lgh 12B" />
        </FormField>

        <FormField label="Beskrivning (valfritt)" error={errors.description?.message}>
          <textarea rows={3} {...register('description')} className="input resize-none" placeholder="Beskriv påsens innehåll..." />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Antal burkar/flaskor" error={errors.can_count?.message}>
            <input type="number" min={1} {...register('can_count', { valueAsNumber: true })} className="input" />
          </FormField>
          <FormField label="Uppskattat pantsvärde (SEK)" error={errors.estimated_value?.message}>
            <input type="number" min={1} step="0.5" {...register('estimated_value', { valueAsNumber: true })} className="input" />
          </FormField>
        </div>

        <div className="relative">
          <FormField label="Adress" error={errors.address?.message}>
            <div className="relative">
              <input
                type="text"
                {...register('address')}
                className="input pr-8"
                placeholder="Sök adress eller klicka på kartan"
                autoComplete="off"
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              {geocoding && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              )}
            </div>
          </FormField>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-lg ring-1 ring-gray-100 overflow-hidden">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onMouseDown={() => selectSuggestion(s)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {s.displayName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm font-medium text-gray-700">Upphämtningsplats</p>
            <Button type="button" variant="ghost" onClick={locateMe} loading={locating} className="text-xs px-2 py-1">
              📍 Min plats
            </Button>
          </div>
          <div className="h-56 rounded-2xl overflow-hidden ring-1 ring-gray-200">
            <LocationPickerMap
              lat={lat ?? 59.3293}
              lon={lon ?? 18.0686}
              flyTarget={flyTarget}
              onChange={handleMapChange}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            Klicka på kartan eller dra nålen för att justera platsen
          </p>
          {(errors.latitude || errors.longitude) && (
            <p className="text-xs text-red-500 mt-1">⚠ Välj en giltig plats</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Hämtfönster start" error={errors.pickup_window_start?.message}>
            <input type="datetime-local" {...register('pickup_window_start')} className="input" />
          </FormField>
          <FormField label="Hämtfönster slut" error={errors.pickup_window_end?.message}>
            <input type="datetime-local" {...register('pickup_window_end')} className="input" />
          </FormField>
        </div>

        <FormField label="Instruktioner (valfritt)" error={errors.instructions?.message}>
          <textarea rows={2} {...register('instructions')} className="input resize-none" placeholder="T.ex. Påsen står vid dörren på plan 3" />
        </FormField>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">Bild (valfritt)</p>
          {imagePreview && (
            <img src={imagePreview} alt="Förhandsvisning" className="w-full h-40 object-cover rounded-xl mb-2" />
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()} className="text-sm">
            Välj bild
          </Button>
        </div>

        <Button type="submit" loading={isSubmitting || mutation.isPending} className="w-full">
          Publicera hämtning
        </Button>
      </form>
    </div>
  )
}
