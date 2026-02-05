type LoaderSize = 'sm' | 'md' | 'lg'

interface LoaderProps {
  size?: LoaderSize
}

const sizeMap: Record<LoaderSize, number> = {
  sm: 16,
  md: 24,
  lg: 40,
}

export function Loader({ size = 'md' }: LoaderProps) {
  const px = sizeMap[size]

  return (
    <div
      style={{
        display: 'inline-block',
        width: px,
        height: px,
        border: `${Math.max(2, px / 8)}px solid #e5e7eb`,
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
      }}
    />
  )
}
