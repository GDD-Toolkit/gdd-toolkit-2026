import { Link } from "react-router-dom";
export default function AIEthicsDashboard() {
  const toolGroups = [
    "General Purpose",
    "Image and Video Generators",
    "Audio Generators",
    "Research",
    "Writing and Text",
    "Another Topic",
    "Data Analysis",
    "Education",
    "Design and Creativity",
    "Other Tools",
  ];

  return (
    <main className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-normal">AI Ethics Dashboard</h1>

          <p className="mt-4 text-xl">
            Discover and explore AI tools for ethical research and project
            development
          </p>
        </div>

        {/* Top Buttons */}
        <div className="mt-7 flex justify-center gap-24">
          <button className="border border-black rounded-md px-12 py-2 text-lg">
            Read our
            <br />
            Methodology
          </button>

          <button className="border border-black rounded-md px-12 py-2 text-lg">
            View our
            <br />
            Infographics
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Value"
                className="flex-1 outline-none text-gray-600"
              />

              <span className="text-xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Tool Grouping */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {toolGroups.map((group) => (
            <Link
              key={group}
              to="/ai-ethics-dashboard/tools"
              className="h-64 bg-gray-200 flex items-center justify-center text-center px-6 hover:bg-gray-300 transition"
            >
              <span className="text-xl">{group}</span>
            </Link>
          ))}
        </section>

        {/* FAQs */}
        <div className="mt-12 flex justify-center">
          <button className="border border-black rounded-md px-8 py-2">
            FAQs
          </button>
        </div>
      </div>
    </main>
  );
}
