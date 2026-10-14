import { ArrowLeft, ExternalLink } from "lucide-react";

const considerations = [
  "Viability",
  "Bias Mitigation",
  "Transparency",
  "Control & Oversight",
  "Privacy & Data",
  "Localization",
  "Evidence of Impact",
  "Low-tech Compatibility",
];

export default function AIEthicsTool() {
  return (
    <main className="min-h-screen bg-white text-black px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <button className="flex items-center gap-2 text-lg">
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Tool Header */}
        <div className="mt-10 text-center">
          <div className="mx-auto w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center">
            Logo
          </div>

          <h1 className="mt-6 text-4xl font-normal">Tool Name</h1>

          <p className="mt-2 text-gray-600">Version 1.0 · Last Updated</p>

          {/* Ethicality Score */}
          <div className="mt-6">
            <p className="text-lg">Ethicality Score</p>

            <p className="text-4xl font-semibold mt-1">72/100</p>
          </div>

          {/* External Link */}
          <button className="mt-5 border border-black rounded-md px-7 py-2 flex items-center gap-2 mx-auto">
            Visit Tool
            <ExternalLink size={18} />
          </button>
        </div>

        {/* Description */}
        <section className="mt-12">
          <h2 className="text-2xl font-medium">Description</h2>

          <div className="mt-4 bg-gray-200 rounded-md p-6 min-h-32">
            <p className="text-gray-700">
              Brief description of the AI tool and its intended use.
            </p>
          </div>
        </section>

        {/* Considerations */}
        <section className="mt-12">
          <h2 className="text-2xl font-medium">Ethical Considerations</h2>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {considerations.map((item) => (
              <div key={item} className="bg-gray-200 rounded-md p-6 min-h-36">
                <h3 className="text-lg font-medium">{item}</h3>

                <div className="mt-5 h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-green-500" />
                </div>

                <p className="mt-2 text-right">4/100</p>
              </div>
            ))}
          </div>
        </section>

        {/* Overall Assessment */}
        <section className="mt-12 mb-16">
          <h2 className="text-2xl font-medium">Overall Assessment</h2>

          <div className="mt-5 bg-gray-200 rounded-md p-8">
            <p className="text-lg text-gray-700">
              Overall assessment of this tool based on the ethical evaluation
              criteria.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
