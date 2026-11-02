import { tools, type AITool } from "./aiTools";

export const toolGroups = [
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

export type SearchResultType =
  | "category"
  | "tool"
  | "tag"
  | "mixed"
  | "none";

export type SearchResult = {
  type: SearchResultType;
  query: string;
  category?: string;
  tools: AITool[];
};

const normalize = (value: string) => value.trim().toLowerCase();

export function searchDashboard(query: string): SearchResult {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return {
      type: "none",
      query,
      tools: [],
    };
  }

  /*
   * Check whether the search matches one of the main dashboard blocks.
   */
  const matchedCategory = toolGroups.find((group) =>
    normalize(group).includes(normalizedQuery),
  );

  /*
   * Search tool information.
   *
   * A tool matches if the query appears in:
   * - tool name
   * - category
   * - tool type
   * - research
   * - project development
   * - price
   * - score
   */
  const matchedTools = tools.filter((tool) => {
    const searchableInformation = [
      tool.name,
      tool.category,
      tool.type,
      tool.research,
      tool.projectDevelopment,
      tool.price,
      String(tool.score),
    ];

    return searchableInformation.some((value) =>
      normalize(value).includes(normalizedQuery),
    );
  });

  /*
   * If the query matches both a main-page category
   * and tool information, go to the Tools page.
   */
  if (matchedCategory && matchedTools.length > 0) {
    return {
      type: "mixed",
      query,
      category: matchedCategory,
      tools: matchedTools,
    };
  }

  /*
   * If only a main-page block matches,
   * stay on the main dashboard.
   */
  if (matchedCategory) {
    return {
      type: "category",
      query,
      category: matchedCategory,
      tools: [],
    };
  }

  /*
   * If only tool information / tags match,
   * go to the Tools page.
   */
  if (matchedTools.length > 0) {
    return {
      type: "tool",
      query,
      tools: matchedTools,
    };
  }

  return {
    type: "none",
    query,
    tools: [],
  };
}