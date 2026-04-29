import { z } from 'zod'

export const createPickupSchema = z.object({
  title: z.string().min(3, 'Minst 3 tecken').max(80),
  description: z.string().max(500).optional(),
  can_count: z.number().int().min(1, 'Minst 1 burk/flaska'),
  estimated_value: z.number().min(1, 'Minst 1 SEK'),
  address: z.string().min(5, 'Ange en adress'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  pickup_window_start: z.string().min(1, 'Välj starttid'),
  pickup_window_end: z.string().min(1, 'Välj sluttid'),
  instructions: z.string().max(300).optional(),
}).refine(
  (d) => new Date(d.pickup_window_end) > new Date(d.pickup_window_start),
  { message: 'Sluttid måste vara efter starttid', path: ['pickup_window_end'] },
)

export type CreatePickupFormData = z.infer<typeof createPickupSchema>
