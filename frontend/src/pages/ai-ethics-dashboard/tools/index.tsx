import { Bookmark, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardResources from "../DashboardResources";
import { getAITools } from "../../../api/strapi";
import ToolFilters from "../../../components/ai-ethics-dashboard/ToolFilters";
import ToolSearch from "../../../components/ai-ethics-dashboard/ToolSearch";

type StrapiAITool = {
  id: number;
  documentId?: string;
  name: string;
  total_score: number;
  logo?: Array<{
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
};

export default function AIEthicsTools() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category")?.trim();
  const urlSearch = searchParams.get("search")?.trim() || "";

  const [filters, setFilters] = useState({
    type: null as string | null,
    research: null as string | null,
    projectDevelopment: null as string | null,
    price: null as string | null,
    score: null as string | null,
  });

  const [search, setSearch] = useState(urlSearch);
  const [tools, setTools] = useState<StrapiAITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    let cancelled = false;

    async function loadTools() {
      try {
        setLoading(true);
        setError("");

        const data = await getAITools();

        if (!cancelled) {
          setTools(data as StrapiAITool[]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load AI tools.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTools();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTools = tools.filter((tool) => {
    const normalizedSearch = search.trim().toLowerCase();

    return normalizedSearch
      ? tool.name?.toLowerCase().includes(normalizedSearch)
      : true;
  });

  const handleSearch = () => {
    const query = search.trim();

    if (!query) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("search");
      setSearchParams(nextParams);
      return;
    }

    setSearchParams({ search: query });
  };

  return (
    <main className="min-h-screen w-full bg-white text-black px-4 sm:px-6 py-8">
      <div className="w-full max-w-7xl mx-auto">
        <Link
          to="/ai-ethics-dashboard"
          className="flex items-center gap-2 text-lg w-fit"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        <div className="text-center mt-6 sm:mt-[-35px]">
          <h1 className="text-3xl sm:text-5xl font-normal">
            AI Ethics Dashboard
          </h1>
        </div>

        <DashboardResources />

        <div className="mt-5 flex justify-center">
          <ToolSearch
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
          />
        </div>

        <h2 className="mt-10 text-lg sm:text-xl font-normal">
          {category || "All Tools"}
        </h2>

        <ToolFilters onFilterChange={setFilters} />

        {loading && (
          <p className="mt-10 text-center text-gray-500">Loading AI tools...</p>
        )}

        {!loading && error && (
          <p className="mt-10 text-center text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
              {filteredTools.map((tool) => {
                const logo =
                  tool.logo?.[0]?.formats?.small?.url || tool.logo?.[0]?.url;

                return (
                  <Link
                    key={tool.documentId || tool.id}
                    to={`/ai-ethics-dashboard/tool?name=${encodeURIComponent(
                      tool.name,
                    )}`}
                    className="h-52 w-full bg-gray-200 p-6 relative block hover:bg-gray-300 transition"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xl sm:text-2xl">{tool.name}</h3>
                      <Bookmark size={23} className="shrink-0" />
                    </div>

                    {logo && (
                      <img
                        src={logo}
                        alt={`${tool.name} logo`}
                        className="mt-3 h-12 w-12 object-contain"
                      />
                    )}

                    <div className="mt-5">
                      <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-green-400 rounded-full" />

                      <p className="mt-2 text-center">
                        Ethicality Score: {tool.total_score}/50
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filteredTools.length === 0 && (
              <div className="mt-12 text-center text-gray-500">
                No tools found.
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
