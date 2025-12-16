import { motion } from "framer-motion";

export default function AIAssistant() {
  return (
    <motion.section
      id="ai-assistant"
      aria-labelledby="ai-assistant-title"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="w-full px-4 py-16 md:py-24 bg-white"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
        <motion.h2
          id="ai-assistant-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#6D83F2]"
        >
          Use our new AI assistant
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed"
        >
          Our AI Assistant automatically generates a polished, values-aligned project proposal based on your responses to our guided questionnaire and insights drawn from our curated database of global development case studies. By combining structured inputs with evidence-based examples, it produces a customized PDF proposal that highlights risks, ethical considerations, affected stakeholders, and recommended design pathways—helping practitioners plan responsible, human-centered projects in minutes.
        </motion.p>

        <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
            window.location.href = "https://main.dn6y4rvhmhz3f.amplifyapp.com/";
        }}
        className="
            mt-4 inline-flex items-center gap-2 rounded-full
            bg-gradient-to-r from-[#A07CFF] to-[#6D83F2]
            px-6 py-3 text-white font-medium
            shadow-sm cursor-pointer

            transition-all duration-300 ease-out
            hover:brightness-85 hover:saturate-70
            focus:outline-none focus:ring-2 focus:ring-[#6D83F2]
            focus:ring-offset-2
        "
        >
        Get Started
        <span aria-hidden="true">→</span>
        </motion.button>
      </div>
    </motion.section>
  );
}

