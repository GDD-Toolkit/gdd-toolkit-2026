import { motion } from 'framer-motion'
import LogoSVG from './LogoSVG'

export default function Logo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <motion.div layoutId="brand-logo" className={`inline-flex items-center flex-shrink-0 text-neutral-900 ${className}`}>
      <LogoSVG size={size} />
    </motion.div>
  )
}

