import type { ButtonProps } from '../types'

function Button({ children, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    padding: '0.6em 1.2em',
    borderRadius: '8px',
    border: '1px solid transparent',
    fontSize: '1em',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'border-color 0.25s, background-color 0.25s',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#646cff',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid #646cff',
      color: '#646cff',
    },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyles, ...variantStyles[variant] }}
    >
      {children}
    </button>
  )
}

export default Button
