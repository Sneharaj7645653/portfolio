import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ theme: 'day', toggle: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'day'
    const saved = localStorage.getItem('sneha-theme')
    if (saved) return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'night')
    localStorage.setItem('sneha-theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'day' ? 'night' : 'day'))

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
