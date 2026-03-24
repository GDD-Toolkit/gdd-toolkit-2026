import { useRef } from "react";
import { motion, easeOut } from "framer-motion";
import "../tools/ethics-of-innovation/EthicsOfInnovation.css";
import "./ProjectEvaluation.css";

const ProjectEvaluation: React.FC = () => {
    const bannerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
    };

    const simulationRef = useRef<HTMLHeadingElement>(null);

    return (
        <div className="page-container">
            <header className="mission-banner">
                <div className="header-flex">
                    <motion.h1
                        className="mission-title"
                        initial="hidden"
                        animate="visible"
                        variants={bannerVariants}
                    >
                        Project Evaluation
                    </motion.h1>
                </div>
            </header>

            {/* --- Section 1: What is Project Evaluation --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        What is the Evaluation Tool?
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        The Project Evaluation Tool aims to assist in assessing the ethicality of development projects, programs, 
                        and/or policies based on the 7 values of worthwhile development (listed below) created by Jay
                        Drydyk in the Routledge Handbook of Development Ethics.
                        <br></br><br></br>
                        <b> The development project, program, and/or policy will be graded on a percent scale, with a score of 100% 
                            indicating a perfect project, program, and/or policy. Below are interpretations of select score ranges: </b>
                    </motion.p>
                    <ul className="star-list">
                        <motion.li
                            className="star-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <b>Poor: </b>0–30%
                        </motion.li>

                        <motion.li
                            className="star-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <b>Developing: </b>30–60%
                        </motion.li>

                        <motion.li
                            className="star-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            <b>Good: </b>60–80%
                        </motion.li>

                        <motion.li
                            className="star-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            <b>Superior: </b> 80–100%
                        </motion.li>
                    </ul>
                </div>
            </section>

            {/* --- Section 2: Seven Values --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        7 Values of Worthwhile Development
                    </h2>

                    <ol className="numbered-list">
                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            Enhancement of people’s <u>well-being</u>
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <u>Equitable</u> sharing in benefits of development
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            <u>Empowerment</u> to participate freely in development
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            Environmental <u>sustainability</u>
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            Promotion of <u>human rights</u>
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            Promotion of <u>cultural freedom</u>, consistent with human rights
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            <u>Responsible conduct</u>, including integrity over corruption
                        </motion.li>
                    </ol>
                </div>
            </section>

            {/* --- Section 3: What is Project Evaluation ---
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                    Click to See Evaluation of Previous Case Studies
                    </h2>

                    <div className="timeline-container">
                    {Array.from({ length: 10 }, (_, i) => {
                        const start = i * 10;
                        const end = start + 9 + (i === 9 ? 1 : 0);
                        return (
                        <div className="timeline-box" key={i}>
                            <span className="range-label">{`${start}-${end}%`}</span>
                            <div className="hover-box">
                            <ul>
                                <li>To Be Added</li>
                            </ul>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </div>
            </section> */}

            {/* --- Section 4: Normative Approach --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        A Normative Approach
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        The GDD Evaluation Tool is based on a normative approach of evaluation. When scoring your development projects, 
                        programs, and/or policies, you will be using your own judgment on how well it achieved the goals associated with 
                        the Value(s) of Worthwhile Development applicable to your projects, programs, and/or policies. 
                        <br></br><br></br>
                        To guide your evaluation, the Evaluation Tool provides an interactive guideline to help you through each step of 
                        the evaluation process. Each step of the evaluation process will have you determine the effectiveness of your 
                        development project, program, and/or policy and how well it created outcomes aligned to the Value(s) of 
                        Worthwhile Development applicable to your case study.
                        <br></br><br></br>
                        At the end, you will score your development project, program, and/or policy based on the benchmarks the GDD toolkit 
                        has established.
                    </motion.p>
                </div>
            </section>

            {/* --- Section 5: Stages of Project Evaluation --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        Stages of Project Evaluation
                    </h2>
                    <ol className="numbered-list">
                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            Evaluation of <b>DESIGN</b>
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            Evaluation of <b>EFFECTIVENESS</b>
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            Evaluation of <b>LONGETIVITY</b>
                        </motion.li>
                    </ol>
                </div>
            </section>

            {/* --- Section 6: Tool Presentation--- */}
            <section className="content-section">
            <div className="content-card">
                <h2 ref={simulationRef} className="simulation-title">
                Project Evaluation Simulation
                </h2>
                <motion.p
                className="simulation-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: easeOut }}
                >
                Walk through the Project Evaluation simulation. It will ask you a series of questions in three phases: 1) the project design phase, 2) the project implementation phase, and 3) the project outcomes phase.
                <br /><br />
                See the <a
                    href="/projectevalnewexternal.pdf" // link to methodology PDF
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-semibold underline hover:text-emerald-700 transition-colors"
                >
                    project evaluation methodology
                </a> for more details.
                </motion.p>

                {/* Embedded Canva presentation */}
                <motion.div
                className="mt-6 justify-center flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: easeOut }}
                >
                <iframe
                    src="https://www.canva.com/design/DAGlZMBzaxs/kfHOiechitv_JGXKeMXwCA/view?embed"
                    width="80%"
                    height="480"
                    style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                    allowFullScreen
                    title="Project Evaluation Simulation"
                ></iframe>
                </motion.div>
            </div>
            </section>
            <br></br>
        </div>
    );
};

export default ProjectEvaluation;
