import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authService'
import { useAuth } from '../../features/auth/useAuth'
import { toast } from '../../lib/toastStore'
import { ROUTES } from '../../lib/routes'

export function Navbar() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      toast.info('Du är utloggad.')
      navigate(ROUTES.login)
    } catch {
      toast.error('Utloggningen misslyckades, försök igen.')
    }
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
      isActive
        ? 'text-emerald-600 bg-emerald-50'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`

  const initials = profile?.display_name
    ? profile.display_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? '?').toUpperCase()

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto max-w-5xl px-4 flex items-center justify-between h-14">
        <Link to={ROUTES.pickups} className="flex items-center gap-2 font-bold text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white text-base">
            🥤
          </span>
          <span className="tracking-tight">Pantjakten</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-0.5">
            <NavLink to={ROUTES.pickups}   className={linkClass}>Hämtningar</NavLink>
            <NavLink to={ROUTES.map}       className={linkClass}>Karta</NavLink>
            <NavLink to={ROUTES.myPickups} className={linkClass}>Mina</NavLink>

            <Link
              to={ROUTES.create}
              className="ml-2 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
            >
              <span className="text-base leading-none">+</span>
              <span>Lägg till</span>
            </Link>

            <button
              onClick={handleLogout}
              title={`Logga ut (${profile?.display_name ?? user.email})`}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {initials}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to={ROUTES.login} className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5">
              Logga in
            </Link>
            <Link
              to={ROUTES.register}
              className="text-sm font-semibold bg-emerald-500 text-white px-3.5 py-2 rounded-xl hover:bg-emerald-600 shadow-sm transition-colors"
            >
              Registrera
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
