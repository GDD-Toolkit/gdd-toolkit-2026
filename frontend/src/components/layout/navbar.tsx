import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'

type Menu = {
  label: string
  href?: string
  items?: { label: string; href: string }[]
}

const MENUS: Menu[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Development Ethics',
    items: [
      { label: 'Development Ethics', href: '/development-ethics' },
      { label: 'Worthwhile Development', href: '/worthwhile-development' },
      { label: 'The Capability Approach', href: '/capability-approach' }
    ]
  },
  {
    label: 'Tools',
    items: [
      { label: 'AI Business Ethics Canvas', href: 'https://main.dn6y4rvhmhz3f.amplifyapp.com/' },
      { label: 'AI Ethics Dashboard', href: 'https://main.dc0y8ib3ovhbx.amplifyapp.com/' },
      { label: 'Ethics of Innovation', href: '/ethics-of-innovation' },
      { label: 'Human Centered Design', href: '/human-centered-design' },
      { label: 'Project Planning', href: '/project-planning' },
      { label: 'Project Evaluation', href: '/project-evaluation' }
    ]
  },
  {
    label: 'Case Studies', href: '/case-studies',
  },
  {
    label: 'Resources',
    items: [
      { label: 'Funding Sources', href: '/funding-sources' },
      { label: 'Podcast', href: '/podcast' },
      { label: 'Acknowledgements', href: '/acknowledgements'}
    ]
  }
]

export default function Navbar() {
  const [open, setOpen] = useState<number | null>(null)
  const [mobile, setMobile] = useState(false)
  const [mobileOpenMenu, setMobileOpenMenu] = useState<number | null>(null)
  const [showMessage, setShowMessage] = useState(false) // toggle alert manually
  const closeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  const openMenu = (i: number) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setOpen(i)
  }

  const scheduleClose = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = window.setTimeout(() => setOpen(null), 200)
  }

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -8,
      scale: 0.96
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.96
    }
  }

  const mobileMenuVariants = {
    hidden: {
      height: 0,
      opacity: 0
    },
    visible: {
      height: 'auto',
      opacity: 1
    },
    exit: {
      height: 0,
      opacity: 0
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.04,
        duration: 0.2
      }
    })
  }

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.33, duration: 0.4, ease: 'easeOut' }}
    >
      {/* Subtle gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A07CFF] via-[#6D83F2] to-[#A07CFF]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* BRAND */}
          <motion.a 
            href="/" 
            className="inline-flex items-center shrink-0 group"
            aria-label="GDD Home"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Logo size="sm" />
          </motion.a>

          {/* DESKTOP NAV MENU */}
          <nav className="hidden lg:flex items-center gap-2">
            {MENUS.map((m, i) =>
              m.items ? (
                <div
                  key={m.label}
                  className="relative"
                  onMouseEnter={() => openMenu(i)}
                  onMouseLeave={scheduleClose}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <Button className="group hover:!bg-[#A07CFF]/10 hover:border-[#6D83F2] hover:!text-[#6D83F2]">
                      <span className="relative z-10">{m.label}</span>
                      <motion.span
                        className="relative z-10"
                        animate={{ rotate: open === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#6D83F2]" />
                      </motion.span>
                    </Button>
                  </motion.div>

                  <AnimatePresence>
                    {open === i && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-gray-200/80 overflow-hidden"
                        style={{ boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)' }}
                        onMouseEnter={() => openMenu(i)}
                        onMouseLeave={scheduleClose}
                      >
                        <div className="py-2">
                          {m.items.map((it, idx) => (
                            <motion.a
                              key={it.href}
                              href={it.href}
                              className="relative block px-5 py-3 text-sm text-slate-700 hover:bg-[#A07CFF]/10 hover:!text-[#6D83F2] transition-colors duration-150 group/item"
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              custom={idx}
                              whileHover={{ x: 2 }}
                            >
                              <span className="flex items-center gap-3">
                                <motion.span
                                  className="w-1 h-1 rounded-full bg-[#A07CFF]/10"
                                  initial={{ opacity: 0, scale: 0 }}
                                  whileHover={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                />
                                <span className="flex-1">{it.label}</span>
                              </span>
                              <motion.div
                                className="absolute left-0 top-0 bottom-0 w-1 bg-[#A07CFF]/10"
                                initial={{ scaleY: 0 }}
                                whileHover={{ scaleY: 1 }}
                                transition={{ duration: 0.2 }}
                                style={{ originY: 0 }}
                              />
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.a
                  key={m.label}
                  href={m.href}
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 px-5 py-2.5 bg-white !text-slate-800 border border-gray-200 shadow-sm hover:!bg-[#A07CFF]/10 hover:border-[#6D83F2] hover:!text-[#6D83F2] hover:shadow-md cursor-pointer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  {m.label}
                </motion.a>
              )
            )}

            {/* Triangle alert icon */}
            <div className="relative ml-4">
              <Button size="icon" variant="default" onClick={() => setShowMessage(v => !v)} aria-label="Prerelease info" className='hover:!bg-[#A07CFF]/10 hover:border-[#6D83F2] hover:!text-[#6D83F2]'>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </Button>

              {/* Alert message below the icon */}
              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 right-0 w-64 bg-red-600 text-white p-3 rounded-lg shadow-lg z-50"
                  >
                    This is a prerelease version of our Development Ethics Toolkit. For feedback and issues, please email <a href="mailto:gddfire@gmail.com" className="underline font-semibold">gddfire@gmail.com</a>.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </nav>

          {/* MOBILE TOGGLE */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              className="lg:hidden"
              onClick={() => setMobile((v) => !v)}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: mobile ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-t border-gray-200/60 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2">
              {MENUS.map((m, idx) =>
                m.items ? (
                  <div key={m.label} className="space-y-2">
                    <Button
                      variant="default"
                      className="w-full justify-between"
                      onClick={() => setMobileOpenMenu(mobileOpenMenu === idx ? null : idx)}
                    >
                      <span>{m.label}</span>
                      <motion.span
                        animate={{ rotate: mobileOpenMenu === idx ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      </motion.span>
                    </Button>
                    <AnimatePresence>
                      {mobileOpenMenu === idx && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-2 space-y-2"
                        >
                          {m.items.map((it, itemIdx) => (
                            <motion.li
                              key={it.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIdx * 0.03 }}
                            >
                              <Button
                                variant="default"
                                className="w-full justify-start ml-2"
                                onClick={() => {
                                  setMobile(false)
                                  window.location.href = it.href
                                }}
                              >
                                <span className="w-1 h-1 rounded-full bg-[#A07CFF]/10 mr-2" />
                                {it.label}
                              </Button>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Button variant="default" className="w-full" onClick={() => {
                      setMobile(false)
                      window.location.href = m.href || '/'
                    }}>
                      {m.label}
                    </Button>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
