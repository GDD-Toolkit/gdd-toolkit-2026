import { useRef, useState } from "react";
import { motion, easeOut } from "framer-motion";
import "./ProjectPlanning.css";

import agileData from "./tools_data/agile.json";
import dmaicData from "./tools_data/dmaic.json";
import leanData from "./tools_data/lean.json";
import waterfallData from "./tools_data/waterfall.json";
import criticalchainData from "./tools_data/criticalchain.json";
import journeymappingData from "./tools_data/journeymapping.json";
import personaData from "./tools_data/persona.json";
import sipocData from "./tools_data/sipoc.json";
import garvins8Data from "./tools_data/garvin8.json";
import dmadvData from "./tools_data/dmadv.json";
import dmediData from "./tools_data/dmedi.json";
import strategycanvasData from "./tools_data/strategycanvas.json";
import gapanalysisData from "./tools_data/gapanalysis.json";
import pughchartData from "./tools_data/pughchart.json";
import montecarloData from "./tools_data/montecarlo.json";
import forceanalysisData from  "./tools_data/forceanalysis.json";

import ToolModal from "./ToolModal";

const ProjectPlanning: React.FC = () => {
    const bannerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
    };

    const simulationRef = useRef<HTMLHeadingElement>(null);

    type Bullet = {
        text: string;
        image?: string;
        sub_bullets: Bullet[];
    }

    type ProjectPlanningTool = {
        name: string;
        type: string[];
        time: string[];
        image: string;
        learning_obj: Bullet[];
        characteristics: Bullet[];
        process: Bullet[];
        benefits: Bullet[];
        drawbacks: Bullet[];
        example: Bullet[];
        resources: Bullet[];
        use_case_video?: string;
        slideshow?: string;
        evaluation: Bullet[];
    }

    // === Tools Data ===
    const tools: ProjectPlanningTool[] = [agileData, dmaicData, leanData, waterfallData, criticalchainData, journeymappingData, personaData, sipocData, garvins8Data, dmadvData, dmediData, strategycanvasData, gapanalysisData, pughchartData, montecarloData, forceanalysisData];
    // === Search State ===
    const [search, setSearch] = useState("");
    // === Modal State ===
    const [selectedTool, setSelectedTool] = useState<ProjectPlanningTool | null>(null);

    const filteredTools = tools.filter((t) => {
        const term = search.toLowerCase();
        return (
            t.name.toLowerCase().includes(term) ||
            t.type.some((ty) => ty.toLowerCase().includes(term)) ||
            t.time.some((ti) => ti.toLowerCase().includes(term))
        );
    });

    // === Badge Colors ===
    const typeColors: Record<string, string> = {
        "Six Sigma": "#dbeafe",          // light blue
        "Process Mapping": "#fef3c7",    // light yellow
        "Decision Making": "#fce7f3",    // light pink
        "User-Centric": "#d1fae5",       // light green
        "Efficiency/Innovation": "#fff7ed", // light orange
        "Quality Management": "#ede9fe"  // light purple
    };    

    const timeColors: Record<string, string> = {
        "Short-term": "#dcfce7",
        "Long-term": "#fee2e2",
    };

    return (
        <div className="page-container">
            <header className="mission-banner">
                <motion.h1
                    className="mission-title"
                    initial="hidden"
                    animate="visible"
                    variants={bannerVariants}
                >
                    Project Planning
                </motion.h1>
                <br></br>
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={bannerVariants}
                >
                    Project planning is the <b>organization of people, deadlines, methodology, and objectives</b> to streamline the production 
                    of a good, product, or goal. In a development context, that means planning to create an <b>effective, sustainable, and 
                    worthwhile project</b>, from infrastructure to social services.
                </motion.p>
            </header>

            {/* --- Section 1: Project Plannng Process --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        Project Planning Process
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        Effective project planning aims to properly document managerial elements needed for the successful completion of projects. Identifying primary aspects of project planning allows project management to control each stage of the project development and allows for the project timeline, roles, and responsibilities to be effectively designed and implemented.
                    </motion.p>
                    <br></br>
                    <div className="case-video-wrapper">
                        <iframe
                            className="case-video"
                            src="https://youtube.com/embed/EiaChYQll-0"
                            title="Project Planning Process Tutorial Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* --- Section 2: Project Planning Tools Intro --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 className="simulation-title">
                        Project Planning Tools
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                    These are various types of software, tables, charts, infographics, and method of thought to help
                    our users develop their own projects. They can help you understand how to manage your own
                    enterprises, track your progress, and organize every piece of our business or project
                    development process. Each box is a different tool, and if you click on the name, you’ll be taken to
                    a free training module to teach you to use this tool, and how it can apply to your specific goal or
                    idea.
                    </motion.p>
                 
                    {/* SEARCH BAR */}
                    <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                        <input
                            type="text"
                            placeholder="Search tools by name, type, or time..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="planning-search-bar"
                        />
                    </div>
                </div>
            </section>

            {/* --- Section 3: Project Planning Tools --- */}
            <div className="tools-grid">
                {filteredTools.map((tool) => (
                    <div 
                        key={tool.name} 
                        className="tool-card"
                        onClick={() => setSelectedTool(tool)}
                        style={{ cursor: "pointer" }}
                    >
                        <img src={tool.image} alt={tool.name} className="tool-image" />

                        <h3 className="tool-name">{tool.name}</h3>

                        <div className="tool-badges">
                        {tool.type.map((ty) => (
                            <span
                                key={ty}
                                className="tool-badge"
                                style={{ backgroundColor: typeColors[ty] }}
                            >
                                {ty}
                            </span>
                        ))}

                        {tool.time.map((ti) => (
                            <span
                                key={ti}
                                className="tool-badge"
                                style={{ backgroundColor: timeColors[ti] }}
                            >
                                {ti}
                            </span>
                        ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* === Modal Component === */}
            {selectedTool && (
                <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
            )}
            <br></br>
        </div>
    );
};

export default ProjectPlanning;
