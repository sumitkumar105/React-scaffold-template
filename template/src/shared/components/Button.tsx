import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    backgroundColor: '#6b7280',
    color: '#ffffff',
    border: 'none',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '1px solid #3b82f6',
  },
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
  md: { padding: '0.5rem 1rem', fontSize: '1rem' },
  lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
}

export function Button({ variant = 'primary', size = 'md', style, ...props }: ButtonProps) {
  return (
    <button
      style={{
        borderRadius: '0.375rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    />
  )
}
