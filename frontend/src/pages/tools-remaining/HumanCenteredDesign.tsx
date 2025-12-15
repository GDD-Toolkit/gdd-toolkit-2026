import { motion, easeOut} from "framer-motion";
import { useEffect, useState,} from "react";
import {ArrowUp} from "lucide-react";

import HCDSurvey from "@/assets/images/HCD-Survey.png";
import HCDPersona from "@/assets/images/HCD-Persona.png"

import "./HumanCenteredDesign.css";
import HumanCenteredDesignQuiz from "./HumanCenteredDesignQuiz";

const bannerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

export default function HumanCenteredDesign() {
 
  const [selectedCapsule, setSelectedCapsule] = useState<string | null>(null);

  // Scroll-to-top button
  const [showScroll, setShowScroll] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShowScroll(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="entire-Container">
      {/*Header*/}
      <header className="head-Banner">
        <motion.h1
          className="header-Font-Styling"
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
        >
          Human Centered Design
        </motion.h1>
          <motion.p
          className="header-Sub-Paragraph"
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
          transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
        >
          “Human-centered design is a philosophy, not a precise set of methods, but one that assumes that innovation should start by getting close to users and observing their activities.”
        <br />
          <strong className="header-Sub-Bold">
            Donald A. Norman, co-founder of Nielsen Norman Group
          </strong>
        </motion.p>
      </header>
      <div className="first-Container">
        <section className="white-Box">
          <h2 className="subheading"
          >
            Factors To Consider
          </h2>
          <motion.p
            className="white-Box-Text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
           There are several factors that must be taken into consideration during the process of designing, including its functionalities, end-users, and general usability. 
           However, designers occasionally use their own experiences and insights, in turn influencing the way these factors are taken into account. 
           To develop a truly useful and inclusive toolkit, it is necessary to take into consideration the design choices' effects on all sorts of end-users and ensure that the resulting product benefits everyone fairly.
          </motion.p>
        </section>
      </div>
      <div className="second-Container">
        <section className="white-Box">
          <h2 className="subheading"
          >
            Ethical Design Thinking
          </h2>
          <motion.p
            className="white-Box-Text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
           Even when it is not feasible to predict the needs of all potential users, efforts must be made to create the design as user-friendly and inclusive as it possibly can. 
           The conceptualization of development ethics prompts us to ask whether or not our design decisions directly address the needs of the user or only our own presumptions. 
           Human-centered design facilitates it to ask such questions by prioritizing empathy, feedback, and collaboration among designers and their potential beneficiaries in the entire process of development. 
           One approach that effectively ensures that the toolkit is meaningful and useful as well as accessible by design to the user is Stanford’s iterative 5-step D.School Model: Empathize, Define, Ideate, Prototype, Test.
           <br></br><br></br>
           Let’s use an example: someone attempting to make a product that stores weights. 
           <br></br>

Step one: through our kit (and the d.school) model, is to empathize with your target audience. Interview potential buyers, and find out what they want the most. 
<br></br>
Step two: From those responses, imagine the kinds of people who would be interested in weight storage. Create a persona for them and imagine what kind of thugs they’d want and be interested in. Would they prefer the convenience of being able to move it around? A sturdier design? 
<br></br>
Step three: ideate solutions to their theorized problems. Try to find a design in the middle of the road that still lets you appeal to both sides. 
<br></br>
Step four: Develop that prototype that adheres to the ideas of human-centered design; make sure it’s human-friendly, easy to assemble, and doesn’t run the risk of any issues (faulty parts, a chance of breaking, etc.) 
<br></br>
Step five: Present the high-quality prototype, and make sure test audiences know you want feedback. Listen to all criticism and find out what could be improved for human-centered design. 
<br></br><br></br>
“The Field Guide to Human-Centered Design” (IDEO.org) emphasizes that human-centered design involves deep empathy with the people you are designing for. If you don’t have that, you’ll struggle to make a great design. Talk with them, and learn what they need. 
<br></br>
<br></br>
Design with your audience, not necessarily for them. 

          
          
          </motion.p>
        </section>
        <div className="white-Box">
          <h2 className="subheading"
          >
            5-Step D.School Model
          </h2>
          <motion.p
            className="white-Box-Text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            The d.School model, also known as the Design Thinking model, is a training tool to teach users about Design Thinking. It is a process that focuses on problem-solving. It is divided into five categories: Empathize, Define, Ideate, Prototype, and Test. The Global Development and Design FIRE stream has worked closely with this model, as has the Human-Centered Design module team. The learning objectives for the d.school model focus on different tools to improve design thinking, such as human-centered design and accessibility, develop user understanding and perspective, generate solutions, test ideas, and more. The practical applications for the d.school model include active problem-solving, collaboration, and project management. Learning is being evaluated through project-based learning. More specifically, it is shown by demonstrating the five skills through feedback and flexibility. 
            <br></br><br></br>
           Learn more in depth about each step of Stanford's iterative d.school model by clicking on their respective capsules!
          </motion.p>
        </div>
      </div>

      {/* Top 5 Capsules and Drop Down */}
      <div className="top-Capsules-Container">

        {/* Empathize Capsule */}
      <section className="top-Capsule">
        <div
          onClick={() => setSelectedCapsule("empathize")}
          className="top-Capsules-Styling"
        >
          <h2 className="capsule-Header">
            Empathize
          </h2>
        </div>
        </section>

      {/* Define Capsule*/}
      <section className="top-Capsule">
        <div
          onClick={() => setSelectedCapsule("define")}
          className="topTwo-Capsules-Styling"
        >
          <h2 className="capsule-Header">
            Define
          </h2>
        </div>
      </section>

      {/* Ideate Capsule*/}
      <section className="top-Capsule">
        <div
          onClick={() => setSelectedCapsule("ideate")}
          className="top-Capsules-Styling"
        >
          <h2 className="capsule-Header">
            Ideate
          </h2>
        </div>
      </section>

      {/* Prototype Capsule */}
      <section className="top-Capsule">
        <div
          onClick={() => setSelectedCapsule("prototype")}
          className="topTwo-Capsules-Styling"
        >
          <h2 className="capsule-Header">
            Prototype
          </h2>
        </div>
      </section>

      {/* Test Capsule */}
      <section className="top-Capsule">
        <div
          onClick={() => setSelectedCapsule("test")}
          className="top-Capsules-Styling"
        >
          <h2 className="capsule-Header">
            Test
          </h2>
        </div>
      </section>
      </div>

      {/* Content Drop Box */}
      {selectedCapsule && (
      <div className="bottom-Info-Holder">
        <div className="bottom-Content-Box">
        {selectedCapsule== "empathize" && (
        <div>
          <p>
            In order to properly implement Human-Centered Design principles, it is
            essential to understand and empathize with end users by knowing their
            background and their needs.
          </p>
          <img src={HCDPersona} alt="HCD Persona" />
          <p className="paragraph-Margin">
            In order for us to better properly empathize with end users, we created a
            persona and analyzed how we can meet their needs.
          </p>
        </div>
        )}

        {selectedCapsule== "define" && (
        <div>
          <p>
            Analyze data gathered from empathizing with the population and identify an underlying issue.
          </p>
          <img src={HCDSurvey} alt="HCD Survey" />
          <p className="paragraph-Margin">
            To understand how he could improve his class, a professor sent out a survey to his students. 
            Can you determine a trend in the responses and define a problem the students are experiencing?
          </p>
          <p className= "paragraph-Margin">
            Though there are multiple problems, the main one expressed was the pace of the professor.
          </p>
        </div>
        )}

        {selectedCapsule== "ideate" && (
        <div>
          <p>
            Develop solutions that meet specified needs.
          </p>
          <p className="paragraph-Margin">
            In order for us to better properly empathize with end users, we created a
            persona and analyzed how we can meet their needs.
          </p>
          <ul className="bullet-Point-List">
              <li> Brainstorm various ideas and decide on the best route.</li>
              <li> Begin stages of designs, development, and prototypes.</li>
              <li> Test out various ideas and prototypes.</li>
              <li> Utulize feedback in order to improve ideas and prototypes</li>
            </ul>
        </div>
        )}

        {selectedCapsule== "prototype" && (
        <div>
          <p>
            Create versions of your ideas so they can be evaluated before finalizing a solution.
          </p>
          <ul className="bullet-Point-List">
            <li> Low fidelity prototypes (such as sketches and storyboards).</li>
            <li> Role-player simulations.</li>
            <li> Physical prototypes (such as clay, cardboard, 3D printing).</li>
          </ul>
        </div>
        )}

        {selectedCapsule== "test" && (
        <div>
          <p>
            Present the end-user with a high-fidelity prototype. Listen to user feedback and reiterate the process if needed.
          </p>
          <ul className="bullet-Point-List">
            <li> Conduct focus groups with end-users.</li>
            <li> Send out a survey.</li>
          </ul>
        </div>
        )}
        </div>
      </div>
      )}
      <div className="third-Container">
        <section className="white-Box">
          <h2 className="subheading">
            Human Centered Design as a Whole
          </h2>
          <motion.p
            className="white-Box-Text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <b>Human-Centered Design (HCD)</b> is an approach to creating projects, products, and policies that starts with people and stays with them throughout the entire design process. 
            Instead of designing for communities from a distance, HCD focuses on designing with them—listening to their experiences, inviting their input, and treating them as experts in their own lives.
          </motion.p>
          <motion.p
            className="white-Box-Text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            In practice, this means that once a problem is identified, designers begin by learning directly from the people affected. 
            Through conversations, observations, and other forms of engagement, they surface real needs, everyday challenges, and existing strengths. These insights shape how the problem is framed and what directions are explored.
             As ideas are generated and tested, community members continue to react, critique, and co-create, helping refine solutions so they are understandable, usable, and genuinely helpful.
          </motion.p>
          <motion.p
            className="white-Box-Text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            Done well, HCD can make material more accessible, build trust, and create a sense of shared ownership over the outcome. 
            It doesn’t guarantee perfect solutions, but it does ensure that people’s voices, contexts, and constraints are central rather than an afterthought.
          </motion.p>
        </section>
      </div>
      <div className="fourth-Container">
        <section className="white-Box">
          <h2 className="subheading2">
            Fields That Commonly Use HCD Principles Include:
          </h2>
          <motion.p
            className="white-Box-Text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
          </motion.p>
          <ul className="bullet-Point-List">
            <li> <b>Technology:</b> Designing user-friendly apps, websites, and digital tools that people can navigate without frustration.</li>
            <li> <b>Education:</b> Creating curricula, learning materials, and classroom practices that meet learners where they are and support diverse learning needs.</li>
            <li> <b>Public Policy:</b> Crafting policies and services that reflect how people actually live, and that reduce barriers to access and participation.</li>
            <li><b>Manufacturing & Product Design:</b> Developing physical products that solve everyday problems, fit into real routines, and can be used safely and comfortably.</li>
          </ul>
        </section>
      </div>
      <div className="fourth-Container">
        <section className="white-Box">
          <motion.p
            className="white-Box-Text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <b>Development ethics</b> deepens human-centered design by asking not only “Is this desirable and usable?” but also “Is this just, dignifying, and genuinely worthwhile for people’s lives?” 
            While HCD focuses on understanding users’ experiences and designing with them, development ethics raises questions about power, agency, justice, and long-term well-being. 
            It asks who defines the “problem,” who benefits, who bears the risks, and whose voices are missing. 
            By combining HCD with development ethics, practitioners move beyond creating solutions that are merely efficient or appealing and instead design projects, programs, and policies that expand 
            people’s capabilities, respect their autonomy, and avoid reproducing harm or inequality. 
            In this toolkit, development ethics is not an add-on—it is the lens that shapes every stage of the HCD process.
          </motion.p>
        </section>
      </div>
      <div className="quiz-Title-Container">
        <section className="white-Box">
          <h2 className="subheading">
            Human-Centered Design Quiz
          </h2>
          <motion.p
            className="white-Box-Text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            The following quiz will test you on common Human-Centered Design knowledge and terms.
          </motion.p>
        </section>
      </div>
      {/* Quiz Content Below */}
      <div className="quiz-Container">
        <HumanCenteredDesignQuiz
          question="Question 1: What is not a key principle of human centered design?"
          options={[
            "Understanding end users of a product",
            "Empathy, Inclusion, Collaboration",
            "Involving users throughout design process",
            "Focusing on just technology, not humans",
          ]}
          correctIndex={3}
          correctExplanation="Human-centered design does not focus solely on developing technology; considering human opinions is the most important part of the mindset. "
        />
        <HumanCenteredDesignQuiz
          question="Question 2: Which is not a difference between human-centered design and design thinking?"
          options={[
            "Human-centered design is focused on improving usability of a product, while design thinking can be used to improve a larger problem",
            "There is no difference between human-centered design and design thinking",
            "Design thinking leans more on ambiguity to explore more solutions, while human-centered design seeks to find a specific solution to a problem",
            "Human-centered design is a mindset, while design thinking is a process",
          ]}
          correctIndex={1}
          correctExplanation="Design thinking and human-centered design are not the same thing. People use the design thinking process to develop ideas relating to human-centered design, but human-centered design is its own view on looking at problems."
        />
        <HumanCenteredDesignQuiz
          question="Question 3: Which of the following is NOT part of the 5-Step D.School model?"
          options={[
            "Define",
            "Discuss",
            "Prototype",
            "Ideate",
          ]}
          correctIndex={1}
          correctExplanation="The 5 steps are: Empathize, Define, Ideate, Prototype, Test"
          />
          <HumanCenteredDesignQuiz
          question="Question 4: In the “Empathize” phase, designers primarily focus on:"
          options={[
            "Testing prototypes",
            "Understanding users' experiences and needs",
            "Brainstorming solution ideas",
            "Measuring project success",
          ]}
          correctIndex={1}
          correctExplanation="Understanding is the key of empathizing; all the other responses relate to human-centered design, but they have nothing to do with empathy."
          />
          <HumanCenteredDesignQuiz
          question="Question 5: Which of the following is NOT a benefit of prototyping?"
          options={[
            "Identifying design flaws early",
            "Saving development time",
            "Replacing the need for user research",
            "Gathering user feedback",
          ]}
          correctIndex={2}
          correctExplanation="Prototyping helps tie ideas and receive feedback at an early stage, so it supports the research process rather than replacing it."
          />
           <HumanCenteredDesignQuiz
          question="Question 6: A team is designing a new digital ID system for cash transfers. Which action BEST reflects a development ethics approach?"
          options={[
            "Launching the system as quickly as possible to reach more users.",
            "Collecting as much personal data as possible 'just in case' it is useful later.",
            "Involving community members in discussions about risks (like data misuse or exclusion), adjusting the design based on their concerns, and clearly explaining their rights.",
            "Letting the technology vendor make all key decisions since they are the technical experts.",
          ]}
          correctIndex={2}
          correctExplanation=" A development ethics approach emphasizes agency, justice, and “do no harm.” Involving community members in identifying risks, making design trade-offs transparent, and clarifying rights shows respect for dignity and helps prevent harm. Speed, data hoarding, or top-down decisions may increase efficiency but undermine ethical quality."
          />
      </div>
      {showScroll && (
        <button
          aria-label="Scroll to top"
          className="scroll-Up-Button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="scroll-Up-Size" />
        </button>
      )}
    </div>
  );
}