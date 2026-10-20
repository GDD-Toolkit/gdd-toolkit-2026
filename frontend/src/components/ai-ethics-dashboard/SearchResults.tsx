import type { AITool } from "../../pages/ai-ethics-dashboard/data/aiTools";

type SearchResultsProps = {
  query: string;
  category?: string;
  tools: AITool[];
  onCategoryClick: () => void;
  onToolClick: (tool: AITool) => void;
  onViewAll: () => void;
};

export default function SearchResults({
  query,
  category,
  tools,
  onCategoryClick,
  onToolClick,
  onViewAll,
}: SearchResultsProps) {
  if (!query.trim()) {
    return null;
  }

  const hasCategory = Boolean(category);
  const hasTools = tools.length > 0;

  if (!hasCategory && !hasTools) {
    return (
      <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
        <p className="text-sm text-gray-500">No results found for "{query}".</p>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="px-5 py-4">
        <p className="text-sm font-medium text-gray-500">Search Results</p>
      </div>

      {/* Dashboard section */}
      {hasCategory && (
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Dashboard Section
          </p>

          <button
            type="button"
            onClick={onCategoryClick}
            className="mt-2 flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-gray-100 transition"
          >
            <div>
              <p className="font-medium text-black">{category}</p>

              <p className="mt-1 text-sm text-gray-500">Jump to this section</p>
            </div>

            <span className="text-lg text-gray-500">→</span>
          </button>
        </div>
      )}

      {/* Matching tools */}
      {hasTools && (
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Tools
            </p>

            <p className="text-xs text-gray-400">
              {tools.length} {tools.length === 1 ? "tool" : "tools"} found
            </p>
          </div>

          <div className="mt-2">
            {tools.slice(0, 5).map((tool) => (
              <button
                key={tool.name}
                type="button"
                onClick={() => onToolClick(tool)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-medium text-black">{tool.name}</p>

                  <p className="mt-1 text-sm text-gray-500">
                    {tool.type}
                    {" · "}
                    {tool.price}
                  </p>
                </div>

                <span className="text-gray-400">→</span>
              </button>
            ))}
          </div>

          {tools.length > 5 && (
            <p className="mt-2 px-3 text-xs text-gray-400">
              Showing the first 5 results
            </p>
          )}

          <button
            type="button"
            onClick={onViewAll}
            className="mt-3 w-full rounded-lg border border-black px-4 py-2.5 text-sm font-medium hover:bg-gray-100 transition"
          >
            View all matching tools →
          </button>
        </div>
      )}
    </div>
  );
}
