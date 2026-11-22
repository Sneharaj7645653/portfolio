import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../theme/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const night = theme === 'night'

  return (
    <motion.button
      onClick={toggle}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${night ? 'day' : 'night'} mode`}
      className="glass fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line px-4 py-2.5 shadow-glow"
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
          night ? 'text-muted' : 'bg-accent text-white'
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
      </span>
      <span className="text-xs font-semibold text-body">{night ? 'Campfire' : 'Botanical'}</span>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
          night ? 'bg-accent text-night' : 'text-muted'
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
      </span>
    </motion.button>
  )
}
