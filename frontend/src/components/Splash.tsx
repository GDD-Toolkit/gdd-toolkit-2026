import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Logo from './Logo'

export default function Splash() {
  const [show, setShow] = useState(true)
  const r = useReducedMotion()

  useEffect(() => {
    if (r) { setShow(false); return }
    // 0.90s (outline) + 0.35s (fill) + 0.12s (settle overlap) ≈ 1.25s then exit
    const t = setTimeout(() => setShow(false), 1250)
    return () => clearTimeout(t)
  }, [r])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.34, ease: 'easeOut' }}
        >
          <motion.div
            // slight settle while fill appears
            initial={{ scale: 1.04 }}
            animate={{ scale: 1.0 }}
            transition={{ delay: 0.92, duration: 0.28, ease: 'easeOut' }}
          >
            <Logo size="md" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

