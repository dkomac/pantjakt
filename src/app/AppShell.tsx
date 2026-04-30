import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Toaster } from '../components/ui/Toaster'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

export function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Toaster />
    </div>
  )
}
