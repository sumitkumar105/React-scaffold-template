import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, style, ...props }, ref) => {
    return (
      <div style={{ marginBottom: '1rem' }}>
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
            fontSize: '1rem',
            outline: 'none',
            ...style,
          }}
          {...props}
        />
        {error && (
          <span
            style={{
              color: '#ef4444',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
              display: 'block',
            }}
          >
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
