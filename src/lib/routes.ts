export const ROUTES = {
  home:      '/',
  login:     '/login',
  register:  '/register',
  pickups:   '/pickups',
  pickup:    (id: string) => `/pickups/${id}`,
  create:    '/create',
  myPickups: '/my-pickups',
  map:       '/map',
} as const
