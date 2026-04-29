import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Toaster } from '../components/ui/Toaster'

export function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
