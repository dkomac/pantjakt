import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './AppShell'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { PickupListPage } from '../features/pickups/PickupListPage'
import { PickupDetailsPage } from '../features/pickups/PickupDetailsPage'
import { CreatePickupPage } from '../features/pickups/CreatePickupPage'
import { MyPickupsPage } from '../features/pickups/MyPickupsPage'
import { MapPage } from '../features/map/MapPage'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/pickups" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'pickups',
        element: <ProtectedRoute><PickupListPage /></ProtectedRoute>,
      },
      {
        path: 'pickups/:id',
        element: <ProtectedRoute><PickupDetailsPage /></ProtectedRoute>,
      },
      {
        path: 'create',
        element: <ProtectedRoute><CreatePickupPage /></ProtectedRoute>,
      },
      {
        path: 'my-pickups',
        element: <ProtectedRoute><MyPickupsPage /></ProtectedRoute>,
      },
      {
        path: 'map',
        element: <ProtectedRoute><MapPage /></ProtectedRoute>,
      },
    ],
  },
])
