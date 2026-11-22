import { useState } from 'react'
import { ThemeProvider, useTheme } from './theme/ThemeContext.jsx'
import World from './three/World.jsx'
import Hud from './components/Hud.jsx'

function Experience() {
  const { theme } = useTheme()
  const [station, setStation] = useState(0)

  return (
    <>
      <World theme={theme} station={station} />
      <Hud theme={theme} station={station} setStation={setStation} />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Experience />
    </ThemeProvider>
  )
}
