import React from "react";
import { motion } from "framer-motion";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const Timeline: React.FC = () => {
  const events: TimelineEvent[] = [
    {
      year: "1948",
      title: "International Manuscript",
      description:
        "The UN publishes the Universal Declaration of Human Rights — a global standard for equality and dignity. This document was called the 'Universal Declaration of Human Rights' and merely outlined standards for human rights from an international perspective. ",
    },
    {
      year: "1997",
      title: "Reform",
      description:
        "The UN redefines its development model, shifting from basic needs to a Human Rights–Based Approach (HRBA). This effectively switched the focus of global development from the beneficiaries to the general human population.",
    },
    {
      year: "2003",
      title: "Adopted Globally",
      description:
        "The UN Common Understanding on a Human-Rights-Based Approach (HRBA) to Development Cooperation was adopted. In this document, the UN sets forth elements such as recognition of human rights that ensure proper consideration of human rights when developing a nation.",
    },
    {
      year: "2004",
      title: "HDCA",
      description:
        "The Human Development and Capability Association (HDCA) was established by Nobel laureate Amartya Sen. It was formally launched at a conference in Pavia, Italy, to promote research and discussion on human development and the capability approach.",
    }
  ];

  return (
    <section className="max-w-7xl mt-65 mb-20 mx-auto px-4 py-24">
      <div className="relative flex justify-between items-center">
        <div className="absolute top-1/2 inset-x-[-40%] h-1 bg-gradient-to-r from-transparent via-[#A07CFF] via-[#6D83F2] via-[#A07CFF] to-transparent -translate-y-1/2 rounded-full" />
          {events.map((event, index) => (
            <motion.div
              key={index}
              className="relative flex flex-col items-center w-1/15"
              initial={{ opacity: 0, y: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
            <motion.div
              className="z-20 w-8 h-8 bg-gradient-to-br from-[#6D83F2] to-[#A07CFF] rounded-full border-4 border-white shadow-lg"
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div
              className={`absolute w-72 bg-white shadow-xl rounded-xl p-5 border border-gray-200 transition-transform hover:scale-105 hover:shadow-2xl
              ${index % 2 === 0 ? "bottom-[130%]" : "top-[130%]"}`}
            >
              <h3 className="text-2xl font-bold text-black-800">{event.year}</h3>
              <p className="font-semibold text-blue-700 mt-2">{event.title}</p>
              <p className="text-black-600 text-sm mt-2 leading-relaxed">{event.description}</p>
            </div>
            <div
              className={`absolute w-1 bg-gradient-to-b from-[#A07CFF] to-[#6D83F2] ${
              index % 2 === 0
              ? "h-3 bottom-[100%]"
              : "h-3 top-[100%]"
              }`}
            />
            </motion.div>
          ))}
      </div>
    </section>
  );
};

export default Timeline;