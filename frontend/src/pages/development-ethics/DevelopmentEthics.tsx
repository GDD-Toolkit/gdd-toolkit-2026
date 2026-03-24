import { useRef } from "react";
import { motion, easeOut } from "framer-motion";
import "./DevelopmentEthics.css";
import { AlertTriangle} from "lucide-react";

const DevelopmentEthics: React.FC = () => {
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
                    Development Ethics
                </motion.h1>
                <br></br>
                <motion.p
                    initial="hidden"
                    animate="visible"
                    variants={bannerVariants}
                >
                    Designing social impact projects that are effective, inclusive, and ethical shouldn’t depend on where you live or the resources you have access to.
                </motion.p>
            </header>

            {/* --- Section 1: Foundations --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        About the Development Ethics Toolkit
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                    The First-Year Innovation & Research Experience stream Global Development & Design at the University of Maryland 
                    brings together Global Development and Design Thinking to answer a pressing question: <i>What does sustainable worthwhile
                    development really look like around the world, and how can we help practitioners address it ethically?</i> The field of 
                    Development Ethics reminds us that development is never value-neutral. There are real differences between “good” 
                    development that expands capabilities and opportunities, and maldevelopment that excludes, harms, or overlooks 
                    the people it intends to serve. Yet, in practice, ethical considerations often appear as afterthoughts; acknowledged 
                    verbally, but missing from the actual design of projects, programs and policies. The Development Ethics Toolkit is 
                    being designed to fix this gap. 
                    </motion.p>
                </div>
            </section>

            {/* --- Section 2: Seven Values --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        A Free, Open-Access Platform with Scalability for Ethical and Human-Centered Development
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                    Through our partnership with the National Science Foundation's I-Corp program, this interactive, open-access online toolkit has been found to supports development practitioners, inter-governmental organizations, community-based organizations, NGOs, policy makers, academics and researchers who want to design projects, programs or policies that are not only efficient and effective, but also transformative, participatory, and ethical.
                    <br></br><br></br>
                    At its core, the toolkit embeds <b>ethical imperatives</b> and <b>human-centered design</b> into each stage of the design process, from understanding the people impacted to evaluating solutions around these opportunities. It provides:
                    </motion.p>
                    <ul className="checklist">
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <b>Values-driven design tools</b> inspired by leading ethicists from around the world. </p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <b>Project planning, monitoring, and evaluation resources</b> tailored for development practitioners.</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <b>An AI-powered project-development assistant</b> that uses Agentic AI to help users craft ethical project proposals, programs, or policy ideas.</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <b>A dashboard that evaluates and suggests AI tools through an AI Ethics len</b> based on a proven and tested methodology.</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <b>Practical exercises and frameworks</b> that strengthen collaboration, creativity, and community participation.</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> <b>Accessible guidance</b> built for both seasoned practitioners and community organizations in the Global South who are too often excluded from high-cost design and innovation tools.</p>
                    </motion.li>
                    </ul>
                </div>
            </section>

            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        Why This Toolkit Matters
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                    Around the world, social impact planners face similar challenges:
                    </motion.p>
                    <ul className="checklist">
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Limited resources</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Unequal access to technology</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Insufficient time or training in human-centered design</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Pressure to prioritize efficiency over equity</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>A lack of guidance for mainstreaming ethics directly into project decisions</p>
                    </motion.li>
                    </ul>
                    <br></br>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                    The Development Ethics Toolkit helps practitioners overcome these barriers. It makes it easier to design inclusive, participatory, and locally grounded programs that reflect the voices of communities, not just the assumptions of external actors.
                    </motion.p>
                </div>
            </section>

            {/* --- Section 2: Seven Values --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        Our Vision
                    </h2>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                    We believe that ethical development should be assessable by everyone. Our vision is a world where every development project, program, or policy, whether launched by an intergovernmental organization like the United Nations or World Bank, a community organizer, an NGO, or a group of undergraduate research students advances the values of worthwhile development. 
                    </motion.p>
                </div>
            </section>

            {/* --- Section 3: Maldevelopment Alert Box --- */}
            <section className="content-section">
                <div className="content-card alert-box">
                    <div className="alert-header">
                        <AlertTriangle size={32} className="alert-icon" />
                        <h3>Maldevelopment Warning</h3>
                    </div>

                    <p className="alert-description">
                        Failure to consider these determinants can therefore lead to development that harms the
                        populations it is supposed to benefit, called “anti development” or “maldevelopment.”
                        According to Goulet, anti-development destroys or harms cultures and individuals
                        (Development Ethics a New Discipline, 1997, p. 9), and it can be the cause of “ecological
                        disaster, which strips nature of its regenerative vitality” (International Ethics and Human
                        Rights, 1992, p. 239). Additionally, anti development occurs in “the name of profit, some
                        absolutized ideology, or a supposed efficiency imperative” (Goulet, 1997, p.9). Essentially,
                        cases of anti-development involve projects that destroy cultures, people, or ecology for
                        the sake of profit gain, ideological gain, or efficiency.
                    </p>
                </div>
            </section>


            {/* --- Section 4: Checklist --- */}
            <section className="content-section checklist-section">
                <div className="content-card">
                    <h2 className="simulation-title">Embarking on a Development Project</h2>

                    <ul className="checklist">
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p> Are there any basic human rights that are currently infringed upon before any intervention?	</p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Was development called upon by the population intended to be aided?</p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Are there any ulterior motives besides helping those in want and need?</p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Will development negatively impact the environment leading to possible deterioration of the land?</p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Will development play a role in the erasure of culture? (language, religion, etc.)</p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Will development create increased tensions (politically)?</p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Does completion of development require a pay back to the developers?	</p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Will development increase access to health care?</p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Will development improve the economic state of said nation?</p>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="checklist-item"
                    >
                        <span className="checkmark">✔</span>
                        <p>Will development increase access to education for all?</p>
                    </motion.li>
                    </ul>
                    <br></br>
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        The first question serves as the principal question that one must ask before embarking on a development project. If the answers to both the first and second questions are “No,” it is strongly encouraged that you reconsider pursuing development. If the answers to the third through seventh questions are “Yes,” it is also recommended to reconsider moving forward with development. However, if the answer to the first question is “Yes,” then regardless of whether the community explicitly called for development, it is encouraged to begin project planning and restore the basic rights they have been deprived of.
                    </motion.p>
                </div>
            </section>

            {/* --- Section 5: Related Readings --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 ref={simulationRef} className="simulation-title">
                        Related Readings
                    </h2>
                    <ol className="numbered-list">
                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            The 1948 United Nations Universal Declaration of Human Rights, though it predates the field of development ethics, is an excellent guide to respecting human rights. It can be found easily online from the United Nations website. 
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            Another United Nations resource is the 2019 Human Development Report, "Beyond Income, Beyond Averages, Beyond Today: Inequalities in Human Development in the 21st Century", which contains detailed information about progress in development and is filled with informative and helpful graphs. It additionally provides a wealth of information regarding what still needs to be done to better development. 
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            Denis Goulet’s 1997 article Development Ethics, a new discipline, published in the International Journal of Social Economics, is an excellent explanation of the field of development ethics and the debates surrounding its goals.
                        </motion.li>

                        <motion.li
                            className="numbered-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            Martha Nausbaum is another major contributor to the field of development ethics who expanded upon Sen’s capability approach. Her 2000 book, Women and Human Development, explores not only issues of feminism and development, but also of what capabilities everyone should have access to. (Nussbaum, 2000)
                        </motion.li>
                    </ol>
                </div>
            </section>

            {/* --- Section 6: References --- */}
<section className="content-section">
    <div className="content-card">
        <h2 ref={simulationRef} className="simulation-title">
            References
        </h2>

        <ol className="numbered-list">

            <motion.li
                className="numbered-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                Deneulin, S. (2013). <i>Ethics and Development: An Introduction from the
                Perspective of the Capability Approach.</i> Geography Compass, 217–227. <a
                    href="https://doi.org/10.1111/gec3.12029"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5B6FE0] underline"
                >
                    https://doi.org/10.1111/gec3.12029
                </a>
            </motion.li>

            <motion.li
                className="numbered-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                Gasper, D. (2006). Introduction: Working in Development Ethics – a tribute to Denis Goulet.
                <i> Éthique Et économique</i>, 1–24. Retrieved December 11, 2020 from <a
                    href="https://papyrus.bib.umontreal.ca/xmlui/handle/1866/3377"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5B6FE0] underline"
                >
                    https://papyrus.bib.umontreal.ca/xmlui/handle/1866/3377
                </a>
            </motion.li>

            <motion.li
                className="numbered-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                Goulet, D. (1997). Development ethics: A new discipline.
                <i> International Journal of Social Economics</i>, 24(11), 1160–1171. <a
                    href="https://doi.org/10.1108/03068299710193543"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5B6FE0] underline"
                >
                    https://doi.org/10.1108/03068299710193543
                </a>
            </motion.li>

            <motion.li
                className="numbered-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                Ross-Larson, B., & Hanlon, E. (Eds.). (1990). <i>UNDP Human Development Report 1990.</i> New York, NY: Oxford University Press.
            </motion.li>

        </ol>
    </div>
</section>

            <br></br>
        </div>
    );
};

export default DevelopmentEthics;
