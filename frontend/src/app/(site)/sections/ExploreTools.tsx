import { motion } from "framer-motion";
import ToolsCarousel, { type ToolSlide } from "@/components/ToolsCarousel";
import { Compass, Users, ClipboardList, BarChart, Brain, Gauge } from "lucide-react";

const toolSlides: ToolSlide[] = [
    {
        id: "ai-business-ethics-canvas",
        label: "Interactive Tool",
        title: "AI Business Ethics Canvas",
        subtitle: "Generate an ethical project proposal. AI trained using case studies.",
        href: "https://main.dn6y4rvhmhz3f.amplifyapp.com/",
        icon: <Brain className="h-8 w-8 text-[#A07CFF]" />,
      },
      {
        id: "ai-ethics-dashboard",
        label: "Educational Tool",
        title: "AI Ethics Dashboard",
        subtitle: "Explore the ethics of popular AI tools for development work.",
        href: "https://main.dc0y8ib3ovhbx.amplifyapp.com/",
        icon: <Gauge className="h-8 w-8 text-[#A07CFF]" />,
      },
  {
    id: "ethics-of-innovation",
    label: "Interactive Tool",
    title: "Ethics of Innovation",
    subtitle: "Interactive Global Development Explorer",
    href: "/ethics-of-innovation",
    icon: <Compass className="h-8 w-8 text-[#A07CFF]" />,
  },
  {
    id: "human-centered-design",
    label: "Design Tool",
    title: "Human Centered Design",
    subtitle: "Real projects, real impact",
    href: "/human-centered-design",
    icon: <Users className="h-8 w-8 text-[#A07CFF]" />,
  },
  {
    id: "project-planning",
    label: "Planning Tool",
    title: "Project Planning",
    subtitle: "Milestones, roles, and accountability checklists",
    href: "/project-planning",
    icon: <ClipboardList className="h-8 w-8 text-[#A07CFF]" />,
  },
  {
    id: "project-evaluation",
    label: "Evaluation Tool",
    title: "Project Evaluation",
    subtitle: "Measurable indicators for outcomes and unintended effects",
    href: "/project-evaluation",
    icon: <BarChart className="h-8 w-8 text-[#A07CFF]" />,
  },
];

export default function ExploreTools() {
  return (
    <motion.section
      id="tools"
      aria-labelledby="tools-title"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="w-full px-4 py-16 md:py-24 bg-black"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10 md:gap-14">
        {/* Top text block */}
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow/kicker */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-[#A07CFF]/100 mb-2"
          >
            Toolkit
          </motion.div>

          {/* Heading */}
          <motion.h2
            id="tools-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#A07CFF]"
          >
            Explore Our Tools
          </motion.h2>

          {/* Subheading / lead paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 text-base md:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed"
          >
            The <b>Development Ethics Toolkit</b> is a free, open-access platform that helps development practitioners, policy makers, and academics design, build, and test social impact projects that are effective, inclusive, and truly ethical. The toolkit incorporates values-based decision-making and human-centered design into every stage of the process. With tools for project planning, evaluation, and AI-powered project-design, plus a dashboard to assess and recommend AI tools for ethical use, our platform ensures that anyone, anywhere, can create development solutions that incorporate the values of worthwhile development, while avoiding the pitfalls of maldevelopment.
          </motion.p>
        </div>

        {/* Full-width carousel */}
        <ToolsCarousel slides={toolSlides} autoPlayInterval={7000} />
      </div>
    </motion.section>
  );
}


