import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Hero from './hero'
import ExploreTools from '@/app/(site)/sections/ExploreTools'
import AIAssistant from '@/app/(site)/sections/AIAssistant'
import CaseStudies from '@/app/(site)/sections/CaseStudies'
import Splash from '@/components/Splash'
import { Play } from 'lucide-react'


export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
      // Reset to 1 second mark when paused
      videoRef.current.currentTime = 1
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current && !isPlaying) {
      // Set video to show frame at 1 second mark
      videoRef.current.currentTime = 1
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    if (videoRef.current) {
      // Reset to 1 second mark when video ends
      videoRef.current.currentTime = 1
    }
  }

  // Animation starts after splash finishes (1.25s) with a slight delay
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.3,
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      }
    }
  }

  return (
    <>
      <Splash />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants}>
          <Hero />
        </motion.div>

        {/* Explore Tools section (text left, carousel right) */}
        <motion.div variants={itemVariants}>
          <ExploreTools />
        </motion.div>

        {/* AI Assistant section */}
        <motion.div variants={itemVariants}>
          <AIAssistant />
        </motion.div>

        {/* Case Studies directly under Tools */}
        <motion.div variants={itemVariants}>
          <CaseStudies />
        </motion.div>

        {/* Explainer Video */}
        <motion.section 
          aria-label="Toolkit explainer video" 
          className="py-12"
          variants={itemVariants}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            {/* Introductory text */}
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-4"
              >
                Learn More About the Toolkit
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Watch our explainer video to discover how the Development Ethics Toolkit can help you create ethical, human-centered development projects.
              </motion.p>
            </div>

            {/* Video player */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
              <video
                ref={videoRef}
                src="/ToolkitHomeVideo.mp4"
                className="w-full h-auto"
                controls={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={handlePause}
                onEnded={handleEnded}
                onLoadedMetadata={handleLoadedMetadata}
              />
              {!isPlaying && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer hover:bg-black/30 transition-colors"
                  onClick={handlePlay}
                  aria-label="Play video"
                >
                  <motion.button
                    initial={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] text-white shadow-lg hover:brightness-85 hover:saturate-70 transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
                  >
                    <Play className="w-10 h-10 ml-1" fill="currentColor" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Optional spacing */}
        <div className="py-8" />

        {/* IMAGE WITH TOP GRADIENT FADE */}
        <img
            src="/assets/images/footer_image.png"
            className="relative top-0 left-0 w-full h-full bg-gradient-to-b from-white to-transparent pointer-events-none"
        />
      </motion.div>
    </>
  )
}