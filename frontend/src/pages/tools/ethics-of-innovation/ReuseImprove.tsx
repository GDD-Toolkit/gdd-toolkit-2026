import { useRef } from "react";
import { motion, easeOut } from "framer-motion";
import "./EthicsOfInnovation.css";

const ReuseImprove: React.FC = () => {
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
                        Reuse and Improve
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
                        src="INSERT HERE"
                        alt="Design Principles Summary"
                        className="principles-summary-image"
                        />
                    </div>

                    <div className="principles-summary-text-wrapper">
                        <p className="principles-summary-text">
                         Under Construction...
                        </p>
                    </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ReuseImprove;