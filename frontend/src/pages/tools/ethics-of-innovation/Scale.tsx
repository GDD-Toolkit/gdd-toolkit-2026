import { useRef } from "react";
import { motion, easeOut } from "framer-motion";
import "./EthicsOfInnovation.css";

const Scale: React.FC = () => {
    const bannerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
    };

    const simulationRef = useRef<HTMLHeadingElement>(null);

    return (
        <div className="page-container">
            <header className="mission-banner">
                <div className="header-flex">
                    <button
                        className="back-button"
                        onClick={() => window.history.back()}
                    >
                        ← Back
                    </button>
                    <motion.h1
                        className="mission-title"
                        initial="hidden"
                        animate="visible"
                        variants={bannerVariants}
                    >
                        Design for Scale
                    </motion.h1>
                </div>
            </header>

            {/* --- Section 1: Image + Summary --- */}
            <section className="content-section">
                <div className="content-card principles-summary-flex">
                    <h2 ref={simulationRef} className="principles-summary-title">Summary</h2>

                    <div className="principles-summary-content">
                    <div className="principles-summary-image-wrapper">
                        <img
                        src="/assets/images/scale.png"
                        alt="Design Principles Summary"
                        className="principles-summary-image"
                        />
                    </div>

                    <div className="principles-summary-text-wrapper">
                        <p className="principles-summary-text">
                        Achieving scale requires thinking beyond a few pilot communities by determining affordability and usability when rationalizing a whole region or country and formulating decisions that enable widespread adoption in the future. This should be considered at the beginning of the design process in order to ensure that your project can be easily expanded to new users, regions, and/or markets. The initiative or project must have a local impact and meet user needs. 
                        </p>
                    </div>
                    </div>
                </div>
            </section>

            {/* --- Section 2: Checklist --- */}
            <section className="content-section checklist-section">
                <div className="content-card">
                    <h2 className="simulation-title">Checklist Questions</h2>

                    <ul className="checklist">
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> Have you planned and designed for scale from the start? </p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> Have you developed a definition for scale for your project or initiative?</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> Is your design simple and flexible in the case where changes are needed?</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> Is there an agreed-upon definition of important goals and models? </p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> Are there any possible partners who might be able to aid the project?</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> Is this implementation feasible considering project funding? </p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> Is the initiative plan and approach fully thought through and considered by multiple parties? </p>
                    </motion.li>
                    </ul>
                </div>
            </section>


            {/* --- Section 3: Additional Resources --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 className="simulation-title">
                        Additional Resources
                    </h2>
                    <motion.ul
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        <li> <a href="https://digitalprinciples.org/principle/design-for-scale/"> Design for Scale | Principles for Digital Development </a></li>
                        <li> <a href="https://uxplanet.org/scaling-design-as-the-company-grows-e99af38f9e8d"> Scaling Design as the Company Grows | by Ian Armstrong </a></li>
                    </motion.ul>
                </div>
            </section>

            {/* --- Section 4: Case Study --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 className="simulation-title">
                        Case Study
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        <a href="https://www.who.int/reproductivehealth/topics/mhealth/maps-toolkit/en/"> Launch of mHealth toolkit to help innovators scale up projects for reproductive, maternal, newborn, child and adolescent health</a>
                        <br></br>
                        The case study above applied this design principle of designing for scale by allowing for their project to be readily expandable to new users and regions. This study applies the research to real world applications that can be interpreted by all users.
                    </motion.p>
                </div>
            </section>
            <br></br>
        </div>
    );
};

export default Scale;
