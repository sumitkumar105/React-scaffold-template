import { APP_NAME } from '@config/constants'

export function HomePage() {
  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem' }}>
        Welcome to {APP_NAME}
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
        Your new React project is ready. Start building by editing the files in{' '}
        <code
          style={{
            backgroundColor: '#f3f4f6',
            padding: '0.125rem 0.375rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
          }}
        >
          src/features/
        </code>
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
          gap: '1rem',
        }}
      >
        <FeatureCard
          title="Feature-Based Architecture"
          description="Organized by domain features for scalable codebases."
        />
        <FeatureCard
          title="TypeScript"
          description="Full type safety with path aliases configured."
        />
        <FeatureCard
          title="API Layer"
          description="Axios client with interceptors ready to connect."
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
      }}
    >
      <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{description}</p>
    </div>
  )
}
