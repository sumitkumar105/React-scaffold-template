import { Link } from 'react-router-dom'
import { ROUTES } from '@config/constants'

export function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 700, marginBottom: '0.5rem' }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        Page not found
      </p>
      <Link
        to={ROUTES.HOME}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: '0.375rem',
          textDecoration: 'none',
        }}
      >
        Go Home
      </Link>
    </div>
  )
}
