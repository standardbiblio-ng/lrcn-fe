import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { ForbiddenError } from '@/features/errors/forbidden'
import { GeneralError } from '@/features/errors/general-error'
import { MaintenanceError } from '@/features/errors/maintenance-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { UnauthorisedError } from '@/features/errors/unauthorized-error'

export function ErrorBoundary() {
  const error = useRouteError()

  console.error('ErrorBoundary caught:', error)

  // Log the full error for debugging
  if (error instanceof Error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
  }

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFoundError />
      case 401:
        return <UnauthorisedError />
      case 403:
        return <ForbiddenError />
      case 503:
        return <MaintenanceError />
      default:
        return <GeneralError />
    }
  }

  // Handle the specific "Cannot convert object to primitive value" error
  if (
    error instanceof Error &&
    error.message.includes('Cannot convert object to primitive value')
  ) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Rendering Error</h1>
        <p>An object is being rendered where a primitive value is expected.</p>
        <p>
          This usually happens when you try to render an object directly in JSX.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: '10px 20px', marginTop: '10px' }}
        >
          Reload Page
        </button>
      </div>
    )
  }

  return <GeneralError />
}
