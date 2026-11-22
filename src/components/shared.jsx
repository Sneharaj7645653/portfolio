import { motion } from 'framer-motion'
import { Flower2 } from 'lucide-react'

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

export function PageShell({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32 ${className}`}>
      {children}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, icon: Icon, center = true }) {
  return (
    <Reveal className={`mb-10 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl font-semibold text-heading sm:text-4xl">{title}</h2>
      {subtitle && <p className={`mt-3 text-body/80 ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>{subtitle}</p>}
    </Reveal>
  )
}

export function Tag({ children }) {
  return (
    <span className="rounded-full border border-line bg-chip-bg px-3 py-1 text-xs font-medium text-chip-text">
      {children}
    </span>
  )
}

export function FlowerRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Flower2 key={i} className={`h-4 w-4 ${i < rating ? 'fill-accent/30 text-accent' : 'text-muted/40'}`} />
      ))}
    </div>
  )
}
