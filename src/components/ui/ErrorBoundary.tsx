import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-lg font-semibold text-gray-800">Något gick fel</h2>
          <p className="text-sm text-gray-500 max-w-sm">{this.state.error.message}</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Försök igen
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
