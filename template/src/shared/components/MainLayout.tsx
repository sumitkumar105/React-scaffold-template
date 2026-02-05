import { Outlet, Link } from 'react-router-dom'
import { ROUTES } from '@config/constants'

export function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Link to={ROUTES.HOME} style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          MyApp
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to={ROUTES.HOME}>Home</Link>
          <Link to={ROUTES.ABOUT}>About</Link>
        </div>
      </nav>
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
