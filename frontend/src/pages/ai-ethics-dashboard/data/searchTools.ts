import {
  getToolCategory,
  TOOL_CATEGORIES,
  type ToolCategory,
} from "./toolCategories";

export const toolGroups: readonly ToolCategory[] = TOOL_CATEGORIES;

export type SearchableAITool = {
  id: number;
  documentId?: string;
  name: string;
  total_score: number;
  about_section?: string;
  category?: string | null;
};

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
  tools: SearchableAITool[];
};

const normalize = (value: string) => value.trim().toLowerCase();

export function searchDashboard(
  query: string,
  tools: SearchableAITool[],
): SearchResult {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return {
      type: "none",
      query,
      tools: [],
    };
  }

  const matchedCategory = toolGroups.find((group) =>
    normalize(group).includes(normalizedQuery),
  );

  const matchedTools = tools.filter((tool) => {
    const category = getToolCategory(tool);
    return (
      normalize(tool.name).includes(normalizedQuery) ||
      normalize(category).includes(normalizedQuery)
    );
  });

  if (matchedCategory && matchedTools.length > 0) {
    return {
      type: "mixed",
      query,
      category: matchedCategory,
      tools: matchedTools,
    };
  }

  if (matchedCategory) {
    return {
      type: "category",
      query,
      category: matchedCategory,
      tools: [],
    };
  }

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
