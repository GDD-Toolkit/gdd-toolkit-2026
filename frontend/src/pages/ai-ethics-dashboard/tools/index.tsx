import { Bookmark, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardResources from "../DashboardResources";
import { tools } from "../data/aiTools";
import ToolFilters from "../../../components/ai-ethics-dashboard/ToolFilters";
import ToolSearch from "../../../components/ai-ethics-dashboard/ToolSearch";

export default function AIEthicsTools() {
  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * Category comes from the main dashboard.
   *
   * Example:
   * /tools?category=Research
   */
  const category = searchParams.get("category")?.trim();

  /*
   * Search can come from the main dashboard.
   *
   * Example:
   * /tools?search=Chatbot
   */
  const urlSearch = searchParams.get("search")?.trim() || "";

  const [filters, setFilters] = useState({
    type: null as string | null,
    research: null as string | null,
    projectDevelopment: null as string | null,
    price: null as string | null,
    score: null as string | null,
  });

  const [search, setSearch] = useState(urlSearch);

  /*
   * Keep the search box synchronized with the URL.
   */
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  /*
   * A search is a Tools-page filter.
   *
   * Therefore, once search contains anything,
   * the main dashboard category is completely ignored.
   */
  const hasToolFilters =
    filters.type !== null ||
    filters.research !== null ||
    filters.projectDevelopment !== null ||
    filters.price !== null ||
    filters.score !== null ||
    search.trim() !== "";

  const filteredTools = tools.filter((tool) => {
    /*
     * No Tools-page filter:
     * use the category selected from the main dashboard.
     */
    if (!hasToolFilters) {
      if (!category) {
        return true;
      }

      return (
        tool.category.trim().toLowerCase() === category.trim().toLowerCase()
      );
    }

    /*
     * Once a Tools-page filter or search is used,
     * start from ALL tools.
     */

    const matchesType = filters.type ? tool.type === filters.type : true;

    const matchesResearch = filters.research
      ? tool.research === filters.research
      : true;

    const matchesProjectDevelopment = filters.projectDevelopment
      ? tool.projectDevelopment === filters.projectDevelopment
      : true;

    const matchesPrice = filters.price ? tool.price === filters.price : true;

    const matchesScore = filters.score
      ? filters.score === "90–100"
        ? tool.score >= 90
        : filters.score === "70–89"
          ? tool.score >= 70 && tool.score <= 89
          : tool.score < 70
      : true;

    /*
     * Search all useful tool information.
     */
    const normalizedSearch = search.trim().toLowerCase();

    const matchesSearch = normalizedSearch
      ? [
          tool.name,
          tool.category,
          tool.type,
          tool.research,
          tool.projectDevelopment,
          tool.price,
          String(tool.score),
        ].some((value) => value.toLowerCase().includes(normalizedSearch))
      : true;

    return (
      matchesType &&
      matchesResearch &&
      matchesProjectDevelopment &&
      matchesPrice &&
      matchesScore &&
      matchesSearch
    );
  });

  const categoryTitle = category || "All Tools";

  const handleSearch = () => {
    const query = search.trim();

    if (!query) {
      /*
       * Remove only the search parameter.
       * Keep the category if the user came from a category.
       */
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("search");
      setSearchParams(nextParams);
      return;
    }

    /*
     * Search on the Tools page always starts from ALL tools.
     *
     * Remove category when searching so the URL also clearly
     * represents the independent-search behavior.
     */
    setSearchParams({
      search: query,
    });
  };

  return (
    <main className="min-h-screen w-full bg-white text-black px-4 sm:px-6 py-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Back to Dashboard */}
        <Link
          to="/ai-ethics-dashboard"
          className="flex items-center gap-2 text-lg w-fit"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        {/* Title */}
        <div className="text-center mt-6 sm:mt-[-35px]">
          <h1 className="text-3xl sm:text-5xl font-normal">
            AI Ethics Dashboard
          </h1>
        </div>

        <DashboardResources />

        {/* Search */}
        <div className="mt-5 flex justify-center">
          <ToolSearch
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
          />
        </div>

        {/* Category */}
        <h2 className="mt-10 text-lg sm:text-xl font-normal">
          {categoryTitle}
        </h2>

        {/* Filters */}
        <ToolFilters onFilterChange={setFilters} />

        {/* Tools */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {filteredTools.map((tool) => (
            <Link
              key={tool.name}
              to={`/ai-ethics-dashboard/tool?name=${encodeURIComponent(
                tool.name,
              )}`}
              className="h-52 w-full bg-gray-200 p-6 relative block hover:bg-gray-300 transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl sm:text-2xl">{tool.name}</h3>

                <Bookmark size={23} className="shrink-0" />
              </div>

              <div className="mt-8">
                <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-green-400 rounded-full" />

                <p className="mt-2 text-center">
                  Ethicality Score: {tool.score}
                </p>
              </div>

              <p className="mt-5 text-base">{tool.type}</p>
            </Link>
          ))}
        </div>

        {/* No results */}
        {filteredTools.length === 0 && (
          <div className="mt-12 text-center text-gray-500">No tools found.</div>
        )}
      </div>
    </main>
  );
}
