import { useRef } from "react";
import { motion, easeOut } from "framer-motion";
import "./EthicsOfInnovation.css";

const ExistingEcosystems: React.FC = () => {
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
                        Existing Ecosystems
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
                        src="/assets/images/existingecosystems.png"
                        alt="Design Principles Summary"
                        className="principles-summary-image"
                        />
                    </div>

                    <div className="principles-summary-text-wrapper">
                        <p className="principles-summary-text">
                        Ecosystems are the sum of many factors such as culture, economy, political environment and infrastructure to name a few. A solid understanding of an ecosystem is needed to accurately assess the needs to be fulfilled and the sustainability of those solutions. The ecosystem must be understood to make sure individuals can actually access or use a tool or initiative otherwise failure and unintended consequences can occur. Since ecosystems are so fluid and complex they must be regularly analyzed.  
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
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Culture: </strong> Have you considered how the culture might influence your project? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Gender Norms: </strong> Have you considered how local and global gender norms influence your project? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Political Environment: </strong> Have you looked at how the local political environment might influence your project? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Economy: </strong>Have you accounted for how the local and global economy will impact your project? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Technology Infrastructure: </strong>Have you explored how the local technology infrastructure will impact how your users interact with your project? Is that technology readily available to them? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> What other projects/products already exist that are like yours?</p>
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
                        <li> <a href="https://digitalprinciples.org/principle/understand-the-existing-ecosystem/"> Understand the Existing Ecosystem | Principles for Digital Development   </a></li>
                        <li> <a href="https://docs.google.com/document/d/1YANkLGuVjMbZzCjkyjj_xygvEJYvPsCdM2YNOwmeki4/edit"> FIRE Framework Layout </a></li>
                        <br></br>
                        <li> Fisher, J. A. et al. (2014). Understanding the relationships between ecosystem services and poverty alleviation: A conceptual framework. Ecosystem Services, vol 7, pp. 34-45. <a href="https://doi.org/10.1016/j.ecoser.2013.08.002"> https://doi.org/10.1016/j.ecoser.2013.08.002</a> 
                        <br></br>
                        This resource is a peer-reviewed, published paper in the Ecosystem Services journal. It presents a conceptual framework for “social-ecological systems science and international development” (Fisher et al., 2014). It explores access to services, payment for those services, and the ability for people to benefit from those services as well as competition and commodification from external actors.</li>
                    </motion.ul>
                </div>
            </section>
            <br></br>
        </div>
    );
};

export default ExistingEcosystems;
