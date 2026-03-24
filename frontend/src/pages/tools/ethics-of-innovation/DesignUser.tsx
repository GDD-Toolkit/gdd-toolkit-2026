import { useRef } from "react";
import { motion, easeOut } from "framer-motion";
import "./EthicsOfInnovation.css";

const DesignUser: React.FC = () => {
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
                        Design with the User
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
                        src="/assets/images/design-user.png"
                        alt="Design Principles Summary"
                        className="principles-summary-image"
                        />
                    </div>

                    <div className="principles-summary-text-wrapper">
                        <p className="principles-summary-text">
                        User-centered design begins with understanding the people you are designing for by utilizing conversation, 
                        observation, and co-creation. Designing with the User is important at all points of the project. It can be 
                        incorporated at the beginning, middle, and end or at various points where your design team might want guidance. 
                        It is important for your project that your user feels involved and that the product suits their needs. By gaining 
                        their input you can determine what the user wants out of the project. By actively listening to the potential user 
                        you can synthesize other possible unexpressed needs and anticipate features that would make the project/product 
                        even more valuable and successful.  
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
                        <p> <strong>Observation: </strong> Have you observed your User? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Conversation: </strong> Have you reached out to your User and conducted a meeting? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Co-creation: </strong> Is the User involved in the project? How? </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <strong>Follow-up: </strong> Does the User feel involved in the project? Conduct another meeting or administer a survey. </p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> Out of all the voices heard in designing with the User are you possibly leaving anyone out? </p>
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
                        <li> <a href="https://digitalprinciples.org/principle/design-with-the-user/"> Design With the User | Principles for Digital Development  </a></li>
                        <li> <a href="https://docs.google.com/document/d/1YANkLGuVjMbZzCjkyjj_xygvEJYvPsCdM2YNOwmeki4/edit"> FIRE Framework Layout </a></li>
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
                        Grocki, M. (2014). 
                        <a href="https://www.youtube.com/watch?v=mSxpVRo3BLg&t=175s"> How to create a Customer Journey Map. </a> UX Mastery. YouTube. 
                        <br></br>
                        In this short video, Megan Grocki details the step by step process of thinking through customer journey mapping. 
                        While the resource uses a market, for-profit driven example, the same process is useful to explore user experience 
                        for developing project deliverables. 
                    </motion.p>
                    <div className="case-video-wrapper">
                        <iframe
                            className="case-video"
                            src="https://www.youtube.com/embed/mSxpVRo3BLg?start=175"
                            title="How to Create a Customer Journey Map"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                </div>
            </section>

            {/* --- Section 5: Empathy Mapping Resources --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 className="simulation-title">
                        Empathy Mapping Resources
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        <a href="https://www.youtube.com/watch?v=QwF9a56WFWA"> What is an Empathy Map?</a> PlaybookUX. YouTube. 
                        <br></br>
                        This video by PlaybookUX provides a guide to empathy mapping strategies in order to understand and later be able 
                        to build a relationship with the recipients of the project.
                    </motion.p>
                    <div className="case-video-wrapper">
                        <iframe
                            className="case-video"
                            src="https://www.youtube.com/embed/QwF9a56WFWA"
                            title="What is an Empathy Map?"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* --- Section 6: Design Thinking MIT --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 className="simulation-title">
                        Design Thinking MIT
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        Altitude (2017). 
                        <a href="https://www.youtube.com/watch?v=kq2kd3CXi1o"> Design Thinking Video from MIT and Altitude.</a> YouTube. 
                        <br></br>
                        This resource takes an inside journey through MIT and Altitude’s process of designing a functional walker for the 
                        elderly. It gives a good look at the interview and review process with the very demographic the product is intended 
                        for. By interacting one-on-one with potential consumers, Altitude and MIT make sure that the product truly suits 
                        their needs. Though ethical development projects may have different needs and aims than companies with a for-profit 
                        mission, we can use some of the same considerations that help involve the consumer as for profit and industry driven
                        products – because in the end, we are designing a product or service and that product should be something 
                        functional that people feel ownership of and want to use.
                    </motion.p>
                    <div className="case-video-wrapper">
                        <iframe
                            className="case-video"
                            src="https://www.youtube.com/embed/v=kq2kd3CXi1o"
                            title="Design Thinking Video from MIT and Altitude."
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </section>
            <br></br>
        </div>
    );
};

export default DesignUser;
