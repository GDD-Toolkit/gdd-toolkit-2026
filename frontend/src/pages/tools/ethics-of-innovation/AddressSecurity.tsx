import { useRef } from "react";
import { motion, easeOut } from "framer-motion";
import AddressSecurityImg from "@/assets/images/address-security.png";
import "./EthicsOfInnovation.css";

const AddressSecurity: React.FC = () => {
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
                        Address Privacy & Security
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
                        src={AddressSecurityImg}
                        alt="Design Principles Summary"
                        className="principles-summary-image"
                        />
                    </div>

                    <div className="principles-summary-text-wrapper">
                        <p className="principles-summary-text">
                        Considering the privacy and security of users is ensuring that users are safe from privacy violations during project implementations. 
                        If the project collects information from users, it is best to minimize its collection while also clearly notifying stakeholders that their information might be collected during the implementation and maintenance of a project. 
                        This allows users to make an informed decision as to whether they wish to give their information to an organization. 
                        Ultimately, projects are made to serve their users. A salient aspect of serving its users best includes defending their privacy by securing their data and minimizing collection. 
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
                        <p> <strong>Transparency: </strong> Is this implementation transparent in how we will protect the data of our users? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Interests: </strong>  Is this implementation in the best interest of those who are involved with it? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Analysis: </strong> Has there been a risk-benefit analysis of the new implementation? Is it positive or negative? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Security: </strong> Does this implementation minimize the collection of personal information? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Awareness: </strong> Have the stakeholders been informed on how their data will be used? </p>
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
                        <li> <a href="https://digitalprinciples.org/principle/address-privacy-security/"> Address Privacy & Security | Principles for Digital Development  </a></li>
                        <li> <a href="https://www.govtech.com/data/the-success-of-open-data-depends-on-open-standards.html"> Open data depends on open standards </a></li>
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
                        IDEO Asili Project
                        <a href="https://www.designkit.org/case-studies/6"> Design Kit </a> 
                        <br></br>
                        In the Asili Project, they addressed privacy and security by being transparent about their project with the community members. 
                        The project minimized the collection of information to key details surrounding the project and ensured that the outcome would be in the best interest of the community members only.
                    </motion.p>
                </div>
            </section>
            <br></br>
        </div>
    )
}

export default AddressSecurity;
