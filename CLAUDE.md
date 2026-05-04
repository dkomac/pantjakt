# Pantjakten — CLAUDE.md

## Project overview

Pantjakten is a Swedish can/bottle recycling pickup app. Donors post bags of recyclable cans/bottles at a location; collectors claim and recycle them. There is a single user type — anyone can donate or collect.

## Tech stack

| Layer | Library |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 8 + `@tailwindcss/vite` (Tailwind v4) |
| Routing | React Router v7 (`createBrowserRouter`) |
| Server state | TanStack Query v5 |
| Forms | React Hook Form 7 + Zod 4 + `@hookform/resolvers` |
| Backend | Supabase v2 (auth, Postgres + RLS, Storage) |
| Maps | Leaflet 1.9.4 + react-leaflet 5, CartoDB Positron tiles |
| Geocoding | Nominatim (no API key, Sweden-restricted) |
| Toast | Zustand (`src/lib/toastStore.ts`) |
| Tests | Vitest + @testing-library/react + jsdom |

## Dev commands

```bash
npm run dev          # start dev server (localhost:5173)
npm run build        # tsc + vite build
npm run test         # vitest watch
npm run test:run     # vitest run (CI)
npm run lint         # eslint
```

TypeScript check only: `npx tsc --noEmit`

## Project structure

```
src/
  app/              # Router, AppShell, Providers
  components/
    layout/         # Navbar, ProtectedRoute
    map/            # LocationPickerMap, MiniMap (reusable map primitives)
    ui/             # Button, Badge, Stat, FormField, Spinner, Toaster, ErrorBoundary
  features/
    auth/           # AuthContext, authService, LoginPage, RegisterPage
    map/            # MapPage, PickupMap, PickupMarker
    pickups/        # All pickup CRUD pages + shared query hooks
  hooks/            # useGeolocation
  lib/              # supabase, routes, formatters, geo, geocoding,
                    # leafletIcons, dateUtils, queryClient, toastStore, database.types
  styles/
  test/             # setup.ts, utils.tsx
supabase/
  migrations/       # 001_init.sql, 002_drop_role.sql
```

## Key conventions

### Routes
All route strings live in `src/lib/routes.ts` as `ROUTES`. Never use raw string literals like `'/pickups'` in components — always use `ROUTES.pickups`, `ROUTES.pickup(id)`, etc.

### Query hooks
All TanStack Query logic is centralised in `src/features/pickups/usePickupQueries.ts`:
- `useAvailablePickups()` — list page + map
- `usePickup(id)` — detail page
- `useMyPickups(userId)` — my-pickups page
- `usePickupMutations(pickupId)` — claim / complete / cancel with built-in invalidation + toasts

Import these hooks in pages instead of calling `useQuery`/`useMutation` directly.

### Auth
`AuthContext` (at app root) owns the single Supabase `onAuthStateChange` subscription and exposes `{ user, profile, loading }` via `useAuth()`. Import `useAuth` from `../auth/useAuth` (thin re-export).

### Leaflet icons
Shared icon factories in `src/lib/leafletIcons.ts`:
- `createPinIcon({ size?, color? })` — circular dot marker
- `createPillIcon(label, color?)` — pill-shaped value label

Never inline `L.divIcon` markup in components.

### Date utilities
`src/lib/dateUtils.ts` exports `toLocalDatetimeValue(date)` and `ONE_DAY_MS`. Use these instead of reimplementing date formatting locally.

### Geolocation
`src/hooks/useGeolocation.ts` — returns `{ coords, loading, error, locate }`. Call `locate(onSuccess?)` to trigger. Never call `navigator.geolocation.getCurrentPosition` directly in components.

### Supabase client
`src/lib/supabase.ts` uses `createClient<any>()` — a deliberate trade-off to avoid fighting the generated `Database` type. `src/lib/database.types.ts` contains the hand-written `Pickup` and `Profile` types used everywhere.

## Environment variables

Requires a `.env.local` file (never commit this):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

Get these from Supabase dashboard → Project Settings → API.

## Supabase setup

Run migrations in order:
1. `supabase/migrations/001_init.sql` — creates `profiles`, `pickups`, trigger, RLS policies
2. `supabase/migrations/002_drop_role.sql` — removes the `role` column

Storage: create a public bucket named `pickup-images` and add an insert policy for authenticated users.

## Testing

Tests live next to the files they test (`*.test.ts` / `*.test.tsx`). Test setup is in `src/test/setup.ts`; shared render helper in `src/test/utils.tsx`.

Run `npm run test:run` before committing. All 51 tests must pass.
