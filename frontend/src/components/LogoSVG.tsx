import { motion } from 'framer-motion'

type Props = { className?: string; strokeWidth?: number; size?: 'sm' | 'md' | 'lg' }

export default function LogoSVG({ className = '', strokeWidth = 3, size = 'md' }: Props) {
  // Aspect ratio: viewBox width (4050) / viewBox height (1120) ≈ 3.616
  const aspectRatio = 4050 / 1120
  
  const sizeConfig = {
    sm: { height: 40, width: 40 * aspectRatio }, // h-10 = 40px
    md: { height: 192, width: 192 * aspectRatio }, // h-48 = 192px
    lg: { height: 256, width: 256 * aspectRatio } // h-64 = 256px
  }
  
  const config = sizeConfig[size]
  
  return (
    <svg
      className={className}
      viewBox="550 -60 4050 1120"
      preserveAspectRatio="xMinYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Development Ethics Toolkit"
      width={config.width}
      height={config.height}
    >
      <defs>
        <style>
          {`.logo-text { font-family: ShieldRegular, Shield, system-ui, sans-serif; font-size: 796px; }`}
          {`.logo-letter-spacing { letter-spacing: -0.07em; }`}
        </style>
      </defs>
      
      {/* Outline group (animated) - Shield paths and text as strokes */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M1025.62,530.3l-.3,503.72,433.38-252.35-.2-500.14-432.88,248.76ZM1350.84,557.11l-31.61,54.97,31.62,18.39v88.61s-76.41,44.35-76.41,44.35l-31.7-18.37-31.75,55.19-76.74,44.54h0s.03-88.92.03-88.92l31.82-55.22-31.8-18.42.03-88.84,76.72-44.23,31.72,18.44,31.68-55,76.38-44.04v88.54Z"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        <motion.path
          d="M793.05,251.73L847.3,283.23L1172.88,94.17L1281.52,157.04L955.89,346.28L1010.23,377.83L1335.88,188.5L1444.7,251.47L1010.25,504.24L575.96,251.82L1010.15,0L1118.61,62.77L793.05,251.73Z"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        <motion.path
          d="M667.99,469.61l174.13,99.79c24.4,13.98,44.14,48.1,44.07,76.16l-.38,149.78c-.07,27.91-19.85,39.13-44.16,25.09l-173.47-100.2-.19-250.62M559.17,281.52l1.2,500.74,434.19,251.77,2.09-502.78-437.48-249.72h0Z"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        {/* Text outline - animated stroke */}
        <motion.text
          className="logo-text"
          transform="translate(1534.05 817.71)"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          initial={{ 
            strokeDasharray: 1000,
            strokeDashoffset: 1000,
            opacity: 1
          }}
          animate={{ 
            strokeDashoffset: 0,
            opacity: 1
          }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <tspan className="logo-letter-spacing" x="0" y="0">T</tspan>
          <tspan x="357.41" y="0">oolkit</tspan>
        </motion.text>
      </g>

      {/* Fill group (fades in after stroke) - Text and filled shapes */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.35, ease: 'easeOut' }}
        fill="currentColor"
      >
        {/* Shield fill */}
        <path
          d="M1025.62,530.3l-.3,503.72,433.38-252.35-.2-500.14-432.88,248.76ZM1350.84,557.11l-31.61,54.97,31.62,18.39v88.61s-76.41,44.35-76.41,44.35l-31.7-18.37-31.75,55.19-76.74,44.54h0s.03-88.92.03-88.92l31.82-55.22-31.8-18.42.03-88.84,76.72-44.23,31.72,18.44,31.68-55,76.38-44.04v88.54Z"
        />
        <polygon points="793.05 251.73 847.3 283.23 1172.88 94.17 1281.52 157.04 955.89 346.28 1010.23 377.83 1335.88 188.5 1444.7 251.47 1010.25 504.24 575.96 251.82 1010.15 0 1118.61 62.77 793.05 251.73" />
        <path
          d="M667.99,469.61l174.13,99.79c24.4,13.98,44.14,48.1,44.07,76.16l-.38,149.78c-.07,27.91-19.85,39.13-44.16,25.09l-173.47-100.2-.19-250.62M559.17,281.52l1.2,500.74,434.19,251.77,2.09-502.78-437.48-249.72h0Z"
        />
        {/* Wordmark text */}
        <text
          className="logo-text"
          transform="translate(1534.05 817.71)"
        >
          <tspan className="logo-letter-spacing" x="0" y="0">T</tspan>
          <tspan x="357.41" y="0">oolkit</tspan>
        </text>
      </motion.g>
    </svg>
  )
}

