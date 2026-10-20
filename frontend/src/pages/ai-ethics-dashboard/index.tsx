import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DashboardResources from "./DashboardResources";
import ToolSearch from "../../components/ai-ethics-dashboard/ToolSearch";
import SearchResults from "../../components/ai-ethics-dashboard/SearchResults";
import { searchDashboard, toolGroups } from "./data/searchTools";

export default function AIEthicsDashboard() {
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showFaq, setShowFaq] = useState(false);

  const [search, setSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(
    null,
  );

  const categoryRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const searchResult = searchDashboard(search);

  const faqs = [
    {
      question: "What is the AI Ethics Dashboard?",
      answer:
        "The AI Ethics Dashboard helps users discover and explore AI tools for ethical research and project development.",
    },
    {
      question: "How are AI tools evaluated?",
      answer:
        "AI tools are evaluated based on the criteria and methodology developed for this project.",
    },
    {
      question: "What does the Ethicality Score mean?",
      answer:
        "The Ethicality Score provides an overview of how a tool performs according to the ethical criteria used by this dashboard.",
    },
    {
      question: "How can I find a specific AI tool?",
      answer:
        "You can use the search bar and explore the different tool groupings to find AI tools that match your needs.",
    },
    {
      question: "Can I bookmark an AI tool?",
      answer:
        "Yes. The dashboard can allow users to bookmark tools so they can easily return to them later.",
    },
  ];

  /*
   * Close the search preview when the user clicks outside it.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Highlight a dashboard section for a few seconds.
   */
  useEffect(() => {
    if (!highlightedCategory) {
      return;
    }

    const timer = window.setTimeout(() => {
      setHighlightedCategory(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [highlightedCategory]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setShowSearchResults(value.trim().length > 0);

    /*
     * Remove an old category highlight when the user starts
     * a new search.
     */
    setHighlightedCategory(null);
  };

  /*
   * User clicks a matching dashboard section.
   */
  const handleCategoryClick = () => {
    if (!searchResult.category) {
      return;
    }

    const category = searchResult.category;

    setShowSearchResults(false);

    setHighlightedCategory(category);

    const element = categoryRefs.current[category];

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  /*
   * User clicks an individual tool in the preview.
   */
  const handleToolClick = (tool: { name: string }) => {
    setShowSearchResults(false);

    navigate(`/ai-ethics-dashboard/tool?name=${encodeURIComponent(tool.name)}`);
  };

  /*
   * User wants to see all matching tools.
   */
  const handleViewAll = () => {
    const query = search.trim();

    if (!query) {
      return;
    }

    setShowSearchResults(false);

    navigate(`/ai-ethics-dashboard/tools?search=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-screen w-full bg-white text-black px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-normal">
            AI Ethics Dashboard
          </h1>

          <p className="mt-4 text-base sm:text-xl">
            Discover and explore AI tools for ethical research and project
            development
          </p>
        </div>

        <DashboardResources />

        {/* Search */}
        <div
          ref={searchContainerRef}
          className="relative mt-8 flex justify-center"
        >
          <ToolSearch
            value={search}
            onChange={handleSearchChange}
            onSearch={() => setShowSearchResults(true)}
          />

          {showSearchResults && search.trim() && (
            <div className="absolute left-1/2 top-full z-30 w-full max-w-3xl -translate-x-1/2">
              <SearchResults
                query={search}
                category={searchResult.category}
                tools={searchResult.tools}
                onCategoryClick={handleCategoryClick}
                onToolClick={handleToolClick}
                onViewAll={handleViewAll}
              />
            </div>
          )}
        </div>

        {/* All Tools */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/ai-ethics-dashboard/tools"
            className="border border-black rounded-md px-8 py-3 text-base hover:bg-gray-100 transition"
          >
            View All Tools
          </Link>
        </div>

        {/* Tool Groups */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {toolGroups.map((group) => {
            const isHighlighted = highlightedCategory === group;

            return (
              <Link
                key={group}
                ref={(element) => {
                  categoryRefs.current[group] = element;
                }}
                to={`/ai-ethics-dashboard/tools?category=${encodeURIComponent(
                  group,
                )}`}
                className={`
                  relative h-64 w-full flex items-center justify-center
                  text-center px-6 transition
                  ${
                    isHighlighted
                      ? "bg-purple-200 ring-4 ring-purple-500 scale-[1.03]"
                      : "bg-gray-200 hover:bg-gray-300"
                  }
                `}
              >
                <span className="text-lg sm:text-xl">{group}</span>

                {isHighlighted && (
                  <span className="absolute top-3 right-3 rounded-full bg-purple-600 px-3 py-1 text-xs text-white">
                    Search Match
                  </span>
                )}
              </Link>
            );
          })}
        </section>

        {/* FAQ */}
        <section className="mt-16 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <button
              onClick={() => setShowFaq(!showFaq)}
              className="border border-black rounded-md px-12 py-3 text-lg font-medium hover:bg-gray-100 transition"
            >
              FAQ
            </button>
          </div>

          {showFaq && (
            <div className="mt-8">
              <div className="border-t border-gray-300">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <div key={index} className="border-b border-gray-300">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full flex items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className="text-lg font-medium">
                          {faq.question}
                        </span>

                        <span
                          className={`text-xl transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          ↓
                        </span>
                      </button>

                      {isOpen && (
                        <div className="pb-5 pr-10 text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
