import { Search, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  "Tool Name",
  "Tool Name",
  "Tool Name",
  "Tool Name",
  "Tool Name",
  "Tool Name",
  "Tool Name",
  "Tool Name",
  "Tool Name",
  "Tool Name",
];

export default function AIEthicsTools() {
  return (
    <main className="min-h-screen bg-white text-black px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Home button */}
        <button className="border border-black rounded-md px-7 py-2 text-lg">
          Home
        </button>

        {/* Page title */}
        <div className="text-center mt-[-35px]">
          <h1 className="text-5xl font-normal">AI Ethics Dashboard</h1>
        </div>

        {/* Top buttons */}
        <div className="mt-5 flex justify-center gap-28">
          <button className="border border-black rounded-md px-8 py-1.5">
            Read our Methodology
          </button>

          <button className="border border-black rounded-md px-8 py-1.5">
            View our Infographics
          </button>
        </div>

        {/* Search */}
        <div className="mt-5 flex justify-center">
          <div className="w-full max-w-3xl flex items-center border border-gray-300 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Value"
              className="flex-1 outline-none text-gray-500"
            />

            <Search size={20} />
          </div>
        </div>

        {/* Category */}
        <h2 className="mt-10 text-xl font-normal">General Purpose Tools</h2>

        {/* Filters */}
        <div className="mt-3 flex gap-12 text-base">
          <button>Tool Type⌄</button>
          <button>Research⌄</button>
          <button>Project Development⌄</button>
          <button>Price⌄</button>
          <button>Score⌄</button>
        </div>

        {/* Tool cards */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {tools.map((tool, index) => (
            <Link
              key={index}
              to="/ai-ethics-dashboard/tool"
              className="h-52 bg-gray-200 p-6 relative block hover:bg-gray-300 transition"
            >
              {/* Tool name + bookmark */}
              <div className="flex justify-between items-start">
                <h3 className="text-2xl">{tool}</h3>

                <Bookmark size={23} />
              </div>

              {/* Ethicality score */}
              <div className="mt-8">
                <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-green-400 rounded-full" />

                <p className="mt-2 text-center">Ethicality Score</p>
              </div>

              {/* Description */}
              <p className="mt-5 text-base">Brief description</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
