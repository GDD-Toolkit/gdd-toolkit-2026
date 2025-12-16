import Timeline from "./Timeline";
import { motion, easeOut } from "framer-motion";

const bannerVariants = 
{
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

export default function CapabilityApproach() {
  return (
    <div className="w-full bg-white text-gray-900 relative">
      {/*Header*/}
      <section className="w-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] py-14 text-center text-white">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-white"
          initial="hidden"
          animate="visible"
          variants={bannerVariants}
        >
          The Capability Approach
        </motion.h1>
          <motion.p
            className="mx-auto mt-4 max-w-3xl text-base md:text-lg text-white/90 leading-relaxed"
            initial="hidden"
            animate="visible"
            variants={bannerVariants}
            transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
          >
          The Capability Approach to human development was developed in the 1980’s as a way to look at development beyond economic measures.
        </motion.p>
      </section>

    {/*Pioneers Grids + Info*/}
    <div className="max-w-6xl mx-auto px-4 py-20 space-y-16">
      <div className = "relative -mt-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 md:p-8">
        <h2 className = "text-4xl text-center text-[#6D83F2] font-semibold"> Pioneers Of This Approach</h2>
      </div>
        <section>
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="relative -mt-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-[#6D83F2] text-center">
                Amartya Sen
              </h2>
                <img
                  src="https://www.reachivy.com/wp-content/uploads/2018/06/Amartya-Sen.png"
                  alt="Capabilities concept"
                  className="w-full h-64 object-cover object-center object-[80%_0%] rounded-xl shadow-md"
                />
                <ul className="list-disc pl-6 text-gray space-y-3 mt-8">
                  <li> His research focused on societal inequalities.</li>
                  <li> He views poverty and underdeveloped communities as a consequence of capability deprivations.</li>
                  <li> He believed development was too complex for a single path to improve everyone’s lives.</li>
                </ul>
            </div>
            <div className = "relative -mt-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-[#6D83F2] text-center">
                Martha Nussbaum
              </h2>
                <img
                  src="https://daily.jstor.org/wp-content/uploads/2018/07/martha_nussbaum_alt_1050x700.jpg"
                  alt="Freedom concept"
                  className="w-full h-64 object-cover object-[80%_0%] rounded-xl shadow-md"
              />
              <ul className="list-disc pl-6 text-gray space-y-3 mt-8">
                <li> Helped form the two major schools of thought in the human development and capabilities field.</li>
                <li> Her philosophy is rooted in ten explicitly stated central capabilities needed for development. </li>
                <li> She believed that satisfying these central capabilities, which are physical, social, and, emotional, can be a way to achieve justice.</li>
              </ul>
            </div>
          </div>
        </section>
      
      {/*Video*/}
      <section>
        <div className="relative -mt-1 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 md:p-8">
          <h2 className = "text-3xl text-center text-[#6D83F2] font-semibold">
            Capability Approach Explained By The Training & Knowledge Module Team
          </h2>
          <h3 className="text-gray mt-4 text-center">
            The following video helps explain the definition of Capability Approach along with examples.
          </h3>
        </div>
        <div className="w-full mt-6 rounded-xl shadow-lg">
          <video
            controls
            className="w-full h-[500px] rounded-xl object-cover"
          >
          <source
            src="/assets/Cabability-approach-video.mp4"
            type="video/mp4"
          />
          </video>
        </div>
      </section>

      {/*Intro Before Timeline*/}
      <section className="relative mt-40 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 md:p-8">
       {
        <section>
        <h2 className="text-4xl font-semibold mb-4 text-center text-[#6D83F2]">
          The Human Rights Based Approach
        </h2>
        <h3 className = "text-black text-center"> This approach to global development, a subset to the Capability Approach, aims to ensure that human rights are considered and respected when a country undergoes development.
          Below is a small timeline illustrating how this approach came to be. 
        </h3>
        </section>
       }
      </section>

      {/*Timeline*/}
      <section>
        <p className = "w-full">
            <Timeline/> 
        </p>
        <br></br>
        <br></br>
        <br></br>
      </section>
    </div>
    </div>
  );
}