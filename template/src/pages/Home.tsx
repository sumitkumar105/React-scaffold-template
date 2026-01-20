import Button from '../components/Button'
import { useToggle } from '../hooks/useToggle'

function Home() {
  const [isActive, toggle] = useToggle(false)

  return (
    <div className="home">
      <h1>Welcome Home</h1>
      <p>This is the home page of your React application.</p>
      <div style={{ marginTop: '1rem' }}>
        <Button onClick={toggle}>
          {isActive ? 'Active' : 'Inactive'}
        </Button>
      </div>
    </div>
  )
}

export default Home
