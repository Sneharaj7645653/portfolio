import { motion } from 'framer-motion'

/* Stylish running-hand signature — the name "writes" itself left-to-right,
   then a swash underline sweeps beneath it. */
export default function Signature({ className = '' }) {
  return (
    <div className={`relative inline-flex flex-col ${className}`}>
      <motion.span
        className="font-signature text-gradient animate-gradient-pan text-[2.6rem] leading-[1.05] sm:text-5xl"
        style={{ paddingBottom: '0.12em', paddingRight: '0.14em' }}
        initial={{ clipPath: 'inset(0 100% -20% 0)', opacity: 0 }}
        animate={{ clipPath: 'inset(0 0% -20% 0)', opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
      >
        Sneha Raj
      </motion.span>
      <svg viewBox="0 0 220 24" className="-mt-1 h-3 w-44 sm:w-56" fill="none" aria-hidden="true">
        <motion.path
          d="M4 15 C 38 5, 72 5, 106 12 S 178 22, 214 7"
          stroke="var(--accent)"
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: 'easeInOut', delay: 1.4 }}
        />
        <motion.path
          d="M205 3 l11 4 l-9 6"
          stroke="var(--accent)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
        />
      </svg>
    </div>
  )
}
