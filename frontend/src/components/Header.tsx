import { motion } from 'framer-motion'
import Logo from './Logo'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.33, duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur border-b"
    >
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center">
        <Logo size="sm" className="text-neutral-900" />
        <nav className="ml-auto hidden md:flex gap-6 text-sm text-neutral-700">
          <a href="/" className="hover:opacity-70">Home</a>
          <a href="/development-ethics" className="hover:opacity-70">Development Ethics</a>
          <a href="/tools" className="hover:opacity-70">Tools</a>
          <a href="/case-studies" className="hover:opacity-70">Case Studies</a>
        </nav>
      </div>
    </motion.header>
  )
}

