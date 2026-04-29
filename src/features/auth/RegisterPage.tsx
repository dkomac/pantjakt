import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerUser } from './authService'
import { FormField } from '../../components/ui/FormField'
import { Button } from '../../components/ui/Button'

const schema = z.object({
  displayName: z.string().min(2, 'Minst 2 tecken'),
  email: z.string().email('Ogiltig e-postadress'),
  password: z.string().min(6, 'Minst 6 tecken'),
})

type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    try {
      await registerUser({ email: data.email, password: data.password, displayName: data.displayName })
      navigate('/pickups')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registreringen misslyckades'
      setError('root', { message: msg })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-emerald-500 p-12 text-white">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-lg">🥤</span>
          Pantjakten
        </div>
        <div>
          <p className="text-3xl font-bold leading-snug mb-3">
            Tjäna pengar på andras pant.
          </p>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Bläddra bland hämtningar i närheten, boka en, hämta påsarna och panta dem. Du behåller pengarna.
          </p>
        </div>
        <p className="text-emerald-200 text-xs">© {new Date().getFullYear()} Pantjakten</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Skapa konto</h1>
            <p className="text-sm text-gray-500 mt-1">Gratis och tar en minut</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Namn" error={errors.displayName?.message}>
              <input type="text" autoComplete="name" {...register('displayName')} className="input" placeholder="Anna Svensson" />
            </FormField>
            <FormField label="E-post" error={errors.email?.message}>
              <input type="email" autoComplete="email" {...register('email')} className="input" placeholder="din@email.com" />
            </FormField>
            <FormField label="Lösenord" error={errors.password?.message}>
              <input type="password" autoComplete="new-password" {...register('password')} className="input" placeholder="Minst 6 tecken" />
            </FormField>

            {errors.root && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}

            <Button type="submit" loading={isSubmitting} className="w-full mt-2">
              Skapa konto
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Har du redan ett konto?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Logga in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
