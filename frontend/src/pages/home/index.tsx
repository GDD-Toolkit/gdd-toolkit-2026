import { motion } from "framer-motion";
import Splash from "@/components/Splash";
import Hero from "./hero";
import ToolsBento from "./sections/ToolsBento";
import ModuleTeamsCarousel from "./sections/ModuleTeamsCarousel";
import ResearchAndCaseStudies from "./sections/ResearchAndCaseStudies";
import PlatformEcosystem from "./sections/PlatformEcosystem";

export default function HomePage() {
  // Animation starts after the preserved Logo splash finishes (1.25s)
  const contentVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.3,
        duration: 0.55,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
      },
    },
  };

  return (
    <div className="w-full bg-[#09090B] text-white">
      <Splash />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        <motion.div variants={itemVariants}>
          <Hero />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ToolsBento />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ModuleTeamsCarousel />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ResearchAndCaseStudies />
        </motion.div>

        <motion.div variants={itemVariants}>
          <PlatformEcosystem />
        </motion.div>
      </motion.div>
    </div>
  );
}
