import type { Bullet, ProjectPlanningTool } from "../pages/project-planning/ToolModal";

const sections = ["learning_obj", "characteristics", "process", "benefits", "drawbacks", "example", "resources", "evaluation"] as const;
const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");
function bullets(value: unknown, depth = 0): value is Bullet[] {
    return depth < 30 && Array.isArray(value) && value.every((item) => record(item)
        && typeof item.text === "string"
        && (item.image === undefined || typeof item.image === "string")
        && bullets(item.sub_bullets, depth + 1));
}

export function parsePlanningTool(value: unknown): ProjectPlanningTool {
    if (!record(value) || typeof value.name !== "string" || !strings(value.type) || !strings(value.time)
        || !sections.every((key) => bullets(value[key]))
        || !["image", "use_case_video", "slideshow"].every((key) => value[key] == null || typeof value[key] === "string")) {
        throw new Error("Invalid project planning tool returned by Strapi.");
    }
    return { ...value, image: value.image ?? "", use_case_video: value.use_case_video ?? undefined,
        slideshow: value.slideshow ?? undefined } as ProjectPlanningTool;
}
