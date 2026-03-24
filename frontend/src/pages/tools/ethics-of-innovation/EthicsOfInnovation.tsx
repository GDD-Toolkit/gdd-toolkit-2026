import { useRef } from "react";
import { motion, easeOut } from "framer-motion";
import "./EthicsOfInnovation.css";

const EthicsOfInnovation: React.FC = () => {
    const bannerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
    };

    const simulationRef = useRef<HTMLHeadingElement>(null);

    return (
        <div className="page-container">
            <header className="mission-banner">
                <motion.h1
                    className="mission-title"
                    initial="hidden"
                    animate="visible"
                    variants={bannerVariants}
                >
                    Ethics of Innovation
                </motion.h1>
            </header>

            {/* --- Section 1: Simulation --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        Ethics of Innovation Simulation
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        By utilizing the 9 Principles of Digital Design and incorporating ethics of innovation, you can effectively lead a 
                        project as a program manager in this simulation. In this role, you’ll have to decide how best to design you 
                        project while keeping ethics of innovation in mind! Try it out for yourself. 
                        <br /><br />
                        <a href="https://umdsurvey.umd.edu/jfe/form/SV_6tAE6MSIm6aExU2">
                            Click Here For Simulation!
                        </a>
                    </motion.p>
                </div>
            </section>

            {/* --- Section 2: 9 Principles --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 className="simulation-title">
                        9 Principles of Digital Design
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        <b> Click on the images </b> below to learn about each of the 9 digital design principles and how to incorporate 
                        them into your project. Each page also comes with a checklist that you can use after you project to ensure that 
                        you met the necessary criteria to have incorporated ethics of innovation into your project!
                    </motion.p>
                </div>
            </section>

            {/* --- Section 3: 9 Principles Grid --- */}
            <section className="principles-section">
                <div className="principles-grid">
                    {[
                        { title: "Design with the User", img: "/assets/images/design-user.png", link: "/ethics-of-innovation/user", 
                        text: "User-centered design begins with understanding the people you are designing for by utilizing conversation, observation, and co-creation." },
                        { title: "Understanding the Existing Ecosystems", img: "/assets/images/existingecosystems.png", link: "/ethics-of-innovation/ecosystem", 
                        text: "Ecosystems are the sum of many factors such as culture, economy, political environment and infrastructure to name a few." },
                        { title: "Design for Scale", img: "/assets/images/scale.png", link: "/ethics-of-innovation/scale", 
                        text: "Achieving scale requires thinking beyond a few pilot communities by determining affordability and usability when rationalizing a whole region or country and formulating decisions that enable widespread adoption in the future." },
                        { title: "Build for Sustainability", img: "/assets/images/sustainability.png", link: "/ethics-of-innovation/sustainability", 
                        text: "Building for sustainability allows the project planners to maximize long term impact by maintaining user and stakeholder support and ensuring that the user and stakeholder contributions are still developed even in the case of a loss of funding or other interruptions. " },
                        { title: "Be Data Driven", img: "/assets/images/datadriven.png", link: "/ethics-of-innovation/data", 
                        text: "It is essential for project managers to utilize quality data in making informed decisions that will impact their final product." },
                        { title: "Use Open Standards", img: "/assets/images/openstandards.png", link: "/ethics-of-innovation/standards", 
                        text: "Using open-source material can prevent unnecessary work and resource usage while still providing meaningful results." },
                        { title: "Reuse and Improve", img: "/assets/images/reuse.png", link: "https://digitalprinciples.org/principles/share-reuse-and-improve/", 
                        text: "Think before you innovate. Sharing tools, ideas, and lessons across teams prevents duplication, saves resources, and leads to stronger, more user-centered solutions." },
                        { title: "Address Privacy & Security", img: "/assets/images/privacy.png", link: "/ethics-of-innovation/privacy", 
                        text: "Considering the privacy and security of users is ensuring that users are safe from privacy violations during project implementations." },
                        { title: "Be Collaborative", img: "/assets/images/collaborative.png", link: "/ethics-of-innovation/collaboration", 
                        text: "Being collaborative requires project managers to communicate and share with peer organizations, stakeholders, and related government agencies." },
                    ].map((item, index) => (
                        <a key={index} href={item.link} className="principle-card">
                            <div className="principle-image-wrapper">
                                <img src={item.img} alt={item.title} className="principle-image" />
                            </div>
                            <div className="principle-info">
                                <h3 className="principle-title">{item.title}</h3>
                                <p className="principle-hover-text">{item.text}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default EthicsOfInnovation;
