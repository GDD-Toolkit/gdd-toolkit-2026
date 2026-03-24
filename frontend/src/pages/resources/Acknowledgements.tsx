import { useState } from "react";
import { motion, easeOut } from "framer-motion";
import "./Acknowledgements.css";

type Module = {
    name: string;
    students: string[];
};

const cohorts: Record<string, Module[]> = {
    "Cohort 2020": [
        { name: "Development Ethics", students: ["Vera Gbedemah","Ethan Paul"] },
        { name: "Ethics of Innovation", students: ["Ange Guianin", "Natasha Panduwawala", "Raya Seid"] },
        { name: "Human Centered Design", students: ["Amarachi Joe-Nweke", "Arrington Lancaster"] },
        { name: "Human Rights and Capabilities", students: ["Maria Castro-Rodriguez", "John Lin", "Roma Seth"] },
        { name: "Infrastructure and Interface", students: ["Manasvi Chegu", "Jalen Coles", "Shivasree Margam"] },
        { name: "Marketing and Outreach", students: ["Connie Cheung","Madeline Merrill","Anna Patterson","Sofia Retamal"] },
        { name: "Project Planning", students: ["Mikhaela-Mari Cuadera","Mahlet Dagne","Rachel Silberg"] },
    ],
    "Cohort 2021": [
        { 
            "name": "Development Ethics", 
            "students": ["PRM: Cameron Busser", "Jessica Chernoff", "Samira Mirza", "Juliana Woods", "Anastasia Katsafanas", "Nadia Panni", "Madeline Keen", "Isaiah Winger"] 
        },
        { 
            "name": "Ethics of Innovation", 
            "students": ["PRM: Raya Seid", "Ryan Bassett", "Steven Berit", "Mirabella Hitzges", "Petra Zika"] 
        },
        { 
            "name": "Human Centered Design", 
            "students": ["PRM: Courtney Davidson", "Tara Lui", "Madeline Omu-Ray"] 
        },
        { 
            "name": "Human Rights & Capabilities", 
            "students": ["PRM: Roma Sheth", "Jeremy Christian Mccallum", "Daniela Nemi", "Jada Smallwood", "Olivia Wolfson"] 
        },
        { 
            "name": "Infrastructure and Interface", 
            "students": ["PRM: Shivasree Margam", "Brett Caplan", "Blen Mulugeta", "Sharon Zhang"] 
        },
        { 
            "name": "Marketing & Outreach", 
            "students": ["PRM: Madeline Merrill", "Nikita Bandarupalli", "Sophia Eitel", "Ava Reiner", "Alexandra Rogan", "Khushi Shah"] 
        },
        { 
            "name": "Project Planning", 
            "students": ["PRM: Mikhaela Mari Cuadera", "Emma Orange", "Kelan Shah", "Zoe Singer", "Joseph Udovich"] 
        }
    ],
    "Cohort 2022": [
        { 
            "name": "Development Ethics", 
            "students": ["PRM: Zayna", "Tomomi Hayashi", "Andrew Wallen", "Morgan Borders", "Rohin Mishra", "Juliette Corseri"] 
        },
        { 
            "name": "Ethics of Innovation", 
            "students": ["PRM: Steven", "Henry Matthew Birger", "Drew Roland Durst", "Edward Rizkilla", "Christopher Li"] 
        },
        { 
            "name": "Human Centered Design", 
            "students": ["PRM: Tara Lui", "Ashley Chau", "Jennifer Chiang", "Jenna Nagie", "Fe Eugenie Batoon"] 
        },
        { 
            "name": "Maldevelopment", 
            "students": ["PRM: Ethan", "Bailey Sullivan", "Frances Chen", "Joseph Diaz", "Sophie Garcia"] 
        },
        { 
            "name": "Infrastructure and Interface", 
            "students": ["PRM: Shiv", "Jessica Nguyen", "Zoe Cheng", "Evan Hardy", "Rory Rutledge", "Joshua Gabriel Fitch"] 
        },
        { 
            "name": "Marketing & Outreach", 
            "students": ["PRM: Rylan", "Ezinne Uzoho", "Nick Murray", "Emily Chung", "Sarah Meklir"] 
        },
        { 
            "name": "Project Planning", 
            "students": ["PRM: Mikhaela", "Sarah Dominguez", "Haley Robinson", "Jordan Snarski"] 
        }
    ],
    "Cohort 2023": [
        { 
            "name": "Development Ethics", 
            "students": ["PRM: Bailey Sullivan", "Mayank Barnwal", "Christian Galeano Ramos", "Anderson Lemus-Del Cid", "Ananya Malipeddi"] 
        },
        { 
            "name": "Operational Protocols", 
            "students": ["PRM: Miral Mohammed", "Swaminathan Gayatri Lnu", "Colin Freas", "Alex Krucoff", "Miguel Queen"] 
        },
        { 
            "name": "Human Centered Design", 
            "students": ["PRM: Ashley Chau", "Wending Zhang", "Rachel Odumade", "Grace Liao"] 
        },
        { 
            "name": "Project Evaluation", 
            "students": ["PRM: Angie Nguyen", "Emilia Guzman", "Tobias West", "Regina Noel Kelly Hrabinski"] 
        },
        { 
            "name": "Infrastructure and Interface", 
            "students": ["PRM: Jessica Nguyen", "Oluwatobiloba Adegbaju", "Ojie Okodogbe", "Neha Veeragandham", "Khardiatou Wane", "Bodhi Getsug"] 
        },
        { 
            "name": "Marketing & Outreach", 
            "students": ["PRM: Emily Chung", "Ozioma Farrah Chigbo", "Lakayla James", "Caroline Meury", "Isaiah Ragsdale"] 
        },
        { 
            "name": "Project Planning", 
            "students": ["PRM: Quentin Hoglund", "Amisiyas Seyoum", "Niharika Sur", "Guhan Pradeep", "Julieanna Burke", "Peter Delalio"] 
        }
    ],
    "Cohort 2024": [
        { name: "Development Ethics", students: ["PRM: Regina Hrabinski", "Ishan Ho", "Manuela Prieto", "Rishit Roy", "Sara Saleh"] },
        { name: "Human Centered Design", students: ["PRM: Khadija Wane", "Alyssa Moreno", "Ariana Urbano Veliz", "Ishani Ghosh", "Maanya Upadhyay", "Margaret Senturia", "Ohan Semirjyan", "Ruth Whitehous", "Sarah Borgos", "Tami Mumuney"] },
        { name: "Infrastructure and Interface", students: ["PRM: Jessica Nguyen", "PRM: Somil Varshney", "Ainsley Jacobsen", "Rohan Tadisetty", "Saisidharth Seyyadri", "Sarah King", "Sequoia Santoro"] },
        { name: "Operational Protocols", students: ["PRM: Gayatri Lnu", "Milenko Stojkovic", "Rowan Kuske", "Stella Kahric", "Timothy Fasold"] },
        { name: "Project Evaluation", students: ["PRM: Emilia Guzman", "Alexandra Jordan", "Jiun Park", "Miles Taylor", "Riley Revilla"] },
        { name: "Project Planning", students: ["PRM: Julie Burke", "Jack Noyes", "Krishnan Tholkappian", "Lila Sheingate", "Lilia Shahal", "Sabeen Kirwi"] },
        { name: "Public Policy", students: ["PRM: Alex Krucoff", "Aryaan Ahmed", "Cameron Deocampo", "Eugene Choi", "Gideon Eichenwald", "Justin Jones", "Natalie Shiloni", "Shirin Saberi", "Wallace Savoy"] },
        { name: "Training and Knowledge Development", students: ["PRM: Rachel Odumade", "Aidyn Phillips", "Emanuella Chiemeka", "Javon Lecky"] },
    ],
    "Cohort 2025": [
        { name: "AI Development", students: ["PRM: Krishnan Tholkappian", "Youssef Ali Ahmed", "Nakshatra Hiray", "Siddhant Jain", "Richard Thomas", "Esha Vigneswaran"]},
        { name: "AI Ethics", students: ["PRM: Justin Jones", "William Bachran", "Zoey Katz", "Ashlyn Wu", "Anna Howell"] },
        { name: "Human Centered Design", students: ["PRM: Rowan Kuske", "Donovan Campos", "Isabella Canlas", "Sumer Elsalawi", "Arvind Kakanavaram", "Madeline Namias"] },
        { name: "Infrastructure and Interface", students: ["PRM: Rohan Tadisetty", "Saikousil Tirumalasetty", "Inemesit Udo-Akang", "Raymond Wu"] },
        { name: "Maldevelopment", students: ["PRM: Eugene Choi", "Emelia Adler", "Lexi Bernstein", "Daniella Hikin", "Grace Wieber"] },
        { name: "Marketing and Outreach", students: ["PRM: Sabeen Kirwi", "Rory Gilmore", "Nolan Rogalski", "Darian Tamami", "Sophia Tamayo", "Nevan Vando"] },
        { name: "Project Evaluation", students: ["PRM: Jiun Park", "Avery Demarco", "Alia Mubagal"] },
        { name: "Project Planning", students: ["PRM: Ruth Whitehouse", "Jaspreet Sonu", "Grace Wieber", "Neeraja Yasam"] },
        { name: "Pro Public Policy", students: ["PRM: Shirin Saberi", "Antonella Almendariz", "Mitchell Kuta", "Lexi Schwartz", "Nola Tischler"] },
        { name: "Training and Knowledge Development", students: ["PRM: Javon Lecky", "MeiMei Castranova", "Nora Grennon", "Eric Li"] },
    ],
};

const Acknowledgements: React.FC = () => {
    const bannerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
    };

    const [selectedCohort, setSelectedCohort] = useState("Cohort 2020");

    return (
        <div className="page-container">
            <header className="mission-banner">
                <motion.h1
                    className="mission-title"
                    initial="hidden"
                    animate="visible"
                    variants={bannerVariants}
                >
                    Acknowledgements
                </motion.h1>
            </header>

            {/* --- Section 1: Intro--- */}
            <section className="content-section">
                <div className="content-card">
                    <motion.p
                        className="simulation-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: easeOut }}
                    >
                        The University of Maryland’s FIRE program provides student researchers with an inclusive faculty-mentored research experience. Lead by <a href="https://www.fire.umd.edu/ben-huffman">Dr. Ben Huffman</a> along with founding research designer and faculty collaborator <a href="https://gvpt.umd.edu/facultyprofile/kosko/stacy-j">Dr. Stacy Kosko</a>. Together, students have worked to develop this toolkit. Special thanks to our international counterparts <a href="https://dict.gov.ph/">DICT</a> Director Rik Amores and <a href="https://oneworldleadership.org/">OWLI</a> Executive Director Joseph Odhiambo. 
                    </motion.p>
                </div>
            </section>

            {/* --- Section 2: Cohort Buttons + Modules --- */}
            <section className="content-section">
                <div className="cohort-container">
                    {/* Left Column: Cohort Buttons */}
                    <div className="cohort-buttons">
                        {Object.keys(cohorts).map((cohort) => (
                            <button
                                key={cohort}
                                className={`cohort-button ${selectedCohort === cohort ? "active" : ""}`}
                                onClick={() => setSelectedCohort(cohort)}
                            >
                                {cohort}
                            </button>
                        ))}
                    </div>

                    {/* Right Column: Modules */}
                    <div className="cohort-modules">
                        {cohorts[selectedCohort].map((module, idx) => (
                            <div key={idx} className="module-card">
                                <h4 className="module-name">{module.name}</h4>
                                <ul className="student-list">
                                    {module.students.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <br></br>
        </div>
    );
};

export default Acknowledgements;
