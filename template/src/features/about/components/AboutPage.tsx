import { APP_NAME } from '@config/constants'

export function AboutPage() {
  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem' }}>
        About {APP_NAME}
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        This project was scaffolded with{' '}
        <strong>create-react-scaffold</strong> and uses a feature-based
        architecture for scalability and maintainability.
      </p>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        Project Structure
      </h2>
      <pre
        style={{
          backgroundColor: '#f3f4f6',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          overflowX: 'auto',
        }}
      >
{`src/
  app/          # App shell, routing, providers
  features/     # Domain-specific modules
  shared/       # Reusable components, hooks, utils
  services/     # API client and endpoints
  config/       # Environment and constants`}
      </pre>
    </div>
  )
}
