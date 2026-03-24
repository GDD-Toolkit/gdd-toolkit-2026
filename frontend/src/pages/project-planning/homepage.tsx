// src/app/pages/project-planning/homepage.tsx

import React from "react";
import { motion, easeOut } from "framer-motion";

type Tool = {
  name: string;
  summary: string;
  href: string;
  icon: React.ReactNode;
  image: string;
};

const Icon: React.FC<{ path: string }> = ({ path }) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="h-6 w-6">
    <path d={path} />
  </svg>
);

const ICONS = {
  map: (
    <Icon path="M9.5 3.1 4.8 5A2 2 0 0 0 3.5 6.8v10.4A2 2 0 0 0 5.7 19l3.8-1.5 3.8 1.5 4.7-1.9a2 2 0 0 0 1.3-1.8V4.9a.9.9 0 0 0-1.2-.8l-4.8 1.9-3.8-1.9Z" />
  ),
  people: <Icon path="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7.5 8a7.5 7.5 0 0 1 15 0Z" />,
  chart: <Icon path="M4 20h16M7 16V8m5 8V4m5 12v-6" />,
  compare: <Icon path="M7 4h10a2 2 0 0 1 2 2v8l-4 4H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm8 12V6" />,
  flow: <Icon path="M4 7h7a3 3 0 0 1 0 6H8m8-6h4m-4 6h4M8 13v4a3 3 0 0 0 3 3h9" />,
  Sigma: <Icon path="M8 4h10v3H12l6 5-6 5h6v3H8v-3l6-5-6-5Z" />,
  bolt: <Icon path="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  clock: <Icon path="M12 22a10 10 0 1 1 10-10A10 10 0 0 1 12 22Zm1-10.4 3.9 2.3-1 1.7L11 13V7h2Z" />,
  bars: <Icon path="M3 6h18M3 12h12M3 18h18" />,
  dice: <Icon path="M9 3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm0 12h6l6 6H3l6-6Z" />,
} as const;

const bannerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

// Single flat list in the same order as the reference image (left→right, top→bottom)
const TOOLS: Tool[] = [
  { 
    name: "Agile", 
    summary: "Short, iterative cycles with frequent feedback for adaptive delivery.", 
    href: "#", 
    icon: ICONS.bolt,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop"
  },
  { 
    name: "Critical Chain", 
    summary: "Protect schedules with resource-buffer management under real-world constraints.", 
    href: "#", 
    icon: ICONS.clock,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
  },
  { 
    name: "DMAIC", 
    summary: "Define–Measure–Analyze–Improve–Control to optimize and stabilize processes.", 
    href: "#", 
    icon: ICONS.Sigma,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
  },
  { 
    name: "DMEDI", 
    summary: "Define–Measure–Explore–Develop–Implement for designing solutions from first principles.", 
    href: "#", 
    icon: ICONS.flow,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
  },
  { 
    name: "Force Field Analysis", 
    summary: "Map drivers and restraints on change to choose effective levers and mitigations.", 
    href: "#", 
    icon: ICONS.compare,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
  },
  { 
    name: "GAP Analysis", 
    summary: "Compare current vs. target state to surface capability gaps and actionable steps.", 
    href: "#", 
    icon: ICONS.chart,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
  },
  { 
    name: "Garvin's 8", 
    summary: "Quality dimensions overview—module summary and examples coming soon.", 
    href: "#", 
    icon: ICONS.chart,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
  },
  { 
    name: "Journey Mapping", 
    summary: "Visualize user steps, thoughts, and touchpoints to uncover needs and opportunities.", 
    href: "#", 
    icon: ICONS.map,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
  },
  { 
    name: "Lean", 
    summary: "Eliminate waste and improve flow with continuous improvement and pull systems.", 
    href: "#", 
    icon: ICONS.bars,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
  },
  { 
    name: "Monte Carlo", 
    summary: "Simulate uncertainty to estimate outcome ranges for cost, schedule, and risk.", 
    href: "#", 
    icon: ICONS.dice,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
  },
  { 
    name: "Persona Approach", 
    summary: "Create semi-fictional users/stakeholders to align decisions with real goals and constraints.", 
    href: "#", 
    icon: ICONS.people,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
  },
  { 
    name: "PUGH Chart", 
    summary: "Evaluate alternatives against weighted criteria to make transparent trade-offs.", 
    href: "#", 
    icon: ICONS.compare,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
  },
  { 
    name: "SIPOC", 
    summary: "Summarize Suppliers, Inputs, Process, Outputs, and Customers to frame the system.", 
    href: "#", 
    icon: ICONS.flow,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
  },
  { 
    name: "Six Sigma", 
    summary: "Reduce variation and defects using statistical control and disciplined improvement.", 
    href: "#", 
    icon: ICONS.Sigma,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
  },
  { 
    name: "Strategy Canvas", 
    summary: "Plot value curves versus alternatives to reveal where to differentiate.", 
    href: "#", 
    icon: ICONS.chart,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
  },
  { 
    name: "Waterfall", 
    summary: "Sequential, phase-gated delivery with clear stage exits and documentation.", 
    href: "#", 
    icon: ICONS.chart,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
  },
];

const ToolTile: React.FC<{ tool: Tool }> = ({ tool }) => (
  <article className="group rounded-3xl bg-white shadow-md ring-1 ring-black/5 hover:shadow-lg transition overflow-hidden">
    {/* image area */}
    <div className="aspect-square w-full rounded-t-3xl overflow-hidden bg-slate-100 relative">
      <img
        src={tool.image}
        alt={tool.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>

    {/* text block */}
    <div className="px-5 pb-5 pt-4">
      <a href={tool.href} className="text-emerald-700 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">
        <h3 className="text-lg font-semibold tracking-tight">{tool.name}</h3>
      </a>
      <p className="mt-1 text-slate-600 text-sm leading-6">{tool.summary}</p>
    </div>
  </article>
);

const ProjectPlanningHomepage: React.FC = () => {
  return (
    <div className="w-full bg-white text-gray-900">
      {/* Header Section - matching worthwhile.tsx style */}
      <section className="w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 py-14 text-center text-white">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-white"
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
        >
          Project Planning Tools
        </motion.h1>
        <motion.p
          className="mx-auto mt-4 max-w-3xl text-base md:text-lg text-white/90 leading-relaxed"
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
          transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
        >
          Practical methods and templates to plan, de-risk, and deliver ethical, sustainable projects.
        </motion.p>
      </section>

      {/* Intro Card - overlapping the header */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="relative -mt-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 md:p-8">
          <motion.p
            className="text-gray-700 leading-relaxed text-[15px] md:text-base text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            These are various types of software, tables, charts, infographics, and methods of thought to help
            our users develop their own projects. They can help you understand how to manage your own
            enterprises, track your progress, and organize every piece of our business or project development
            process. Each box is a different tool, and if you click on the name, you'll be taken to a free
            training module to teach you how to use this tool, and how it can apply to your specific goal or idea.
          </motion.p>
        </div>
      </section>

      <main className="pb-20">

      {/* UNIFIED GRID */}
      <section aria-labelledby="tool-grid" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <h2 id="tool-grid" className="sr-only">Tool Grid</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TOOLS.map((tool) => (
            <ToolTile key={tool.name} tool={tool} />
          ))}
        </div>
      </section>
      </main>
    </div>
  );
};

export default ProjectPlanningHomepage;
