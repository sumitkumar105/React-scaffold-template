import { APP_NAME, APP_VERSION } from '../config/constants'

function About() {
  return (
    <div className="about">
      <h1>About</h1>
      <p>
        {APP_NAME} v{APP_VERSION}
      </p>
      <p>
        A clean React template built with Vite and TypeScript.
      </p>
    </div>
  )
}

export default About
