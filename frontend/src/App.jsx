import { useState } from 'react'
import LandingPage     from './components/LandingPage'
import WorkspaceLayout from './components/WorkspaceLayout'

export default function App() {
  const [sandbox, setSandbox] = useState(null)

  if (!sandbox) {
    return <LandingPage onSandboxCreated={setSandbox} />
  }

  return <WorkspaceLayout sandbox={sandbox} />
}
