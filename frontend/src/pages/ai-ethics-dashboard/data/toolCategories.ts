export const TOOL_CATEGORIES = [
  "General Purpose",
  "Image and Video Generators",
  "Audio Generators",
  "Writing and Text",
  "Design and Creativity",
  "Research",
  "Education",
  "Other Tools",
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export type CategorizableAITool = {
  name: string;
  about_section?: string;
  category?: string | null;
};

/**
 * Explicit category assignments for the current Strapi AI Tool catalog.
 * If the CMS adds a native `category` field later, that CMS value takes priority.
 */
const KNOWN_TOOL_CATEGORIES: Record<string, ToolCategory> = {
  // General Purpose
  chatgpt: "General Purpose",
  copilot: "General Purpose",
  "microsoft copilot": "General Purpose",
  gemini: "General Purpose",
  "deepseek-r1": "General Purpose",
  claude: "General Purpose",
  "grok ai": "General Purpose",
  deepai: "General Purpose",
  merlin: "General Purpose",
  "alicent ai": "General Purpose",

  // Image and Video Generators
  midjourney: "Image and Video Generators",
  pika: "Image and Video Generators",
  captions: "Image and Video Generators",
  leonardo: "Image and Video Generators",
  clipdrop: "Image and Video Generators",
  wan: "Image and Video Generators",
  opus: "Image and Video Generators",
  reccloud: "Image and Video Generators",

  // Audio Generators
  sesame: "Audio Generators",
  speechify: "Audio Generators",
  "lovo ai": "Audio Generators",
  "eleven labs": "Audio Generators",
  elevenlabs: "Audio Generators",
  descript: "Audio Generators",

  // Writing and Text
  grammarly: "Writing and Text",
  "google translate": "Writing and Text",
  rytr: "Writing and Text",
  "ai dungeon": "Writing and Text",

  // Design and Creativity
  simplified: "Design and Creativity",
  autodraw: "Design and Creativity",
  "designs ai": "Design and Creativity",
  "flair ai": "Design and Creativity",
  ideamap: "Design and Creativity",

  // Research
  scholarcy: "Research",
  scite: "Research",

  // Education
  studyfetch: "Education",

  // Other Tools (Chatbot builders, workflow & utility platforms)
  "amazon lex v2": "Other Tools",
  chatbase: "Other Tools",
  droxy: "Other Tools",
  promptbox: "Other Tools",
  tinywow: "Other Tools",
  notifyai: "Other Tools",
};

const KEYWORD_RULES: { category: ToolCategory; pattern: RegExp }[] = [
  {
    category: "Research",
    pattern: /\b(research|academic|scientific|literature|citation|fact-check|scholar|paper)\b/i,
  },
  {
    category: "Education",
    pattern: /\b(study|course material|classroom|tutor|student learning|flashcard|education)\b/i,
  },
  {
    category: "Audio Generators",
    pattern: /\b(voice|audio|speech|tts|voiceover|podcast|transcrib)\b/i,
  },
  {
    category: "Image and Video Generators",
    pattern: /\b(video|text-to-image|generate an image|uncrop|cinematic|tiktok|shorts)\b/i,
  },
  {
    category: "Design and Creativity",
    pattern: /\b(design|draw|mind map|brainstorm|creative platform|marketing visual|advertisement)\b/i,
  },
  {
    category: "Writing and Text",
    pattern: /\b(writing assistant|proofreading|plagiarism|translate|story-creating|poems)\b/i,
  },
  {
    category: "General Purpose",
    pattern: /\b(chatbot|generative ai|ai assistant|multiple ai models)\b/i,
  },
];

/**
 * Resolves the category for a Strapi AI tool:
 * 1. Native Strapi `category` field when populated.
 * 2. Known tool name mapping for the live catalog.
 * 3. Keyword classification from `name` + `about_section` for newly added CMS tools.
 */
export function getToolCategory(tool: CategorizableAITool): ToolCategory {
  if (tool.category && tool.category.trim()) {
    const normalized = tool.category.trim().toLowerCase();
    const matched = TOOL_CATEGORIES.find(
      (cat) => cat.toLowerCase() === normalized,
    );
    if (matched) return matched;
  }

  const normalizedName = tool.name.trim().toLowerCase();
  const known = KNOWN_TOOL_CATEGORIES[normalizedName];
  if (known) return known;

  const corpus = `${tool.name} ${tool.about_section ?? ""}`;
  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(corpus)) {
      return rule.category;
    }
  }

  return "Other Tools";
}

export function groupToolsByCategory<T extends CategorizableAITool>(
  tools: T[],
): Record<ToolCategory, T[]> {
  const grouped = Object.fromEntries(
    TOOL_CATEGORIES.map((category) => [category, [] as T[]]),
  ) as Record<ToolCategory, T[]>;

  for (const tool of tools) {
    const category = getToolCategory(tool);
    grouped[category].push(tool);
  }

  return grouped;
}
