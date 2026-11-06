import { afterEach, describe, expect, it, vi } from "vitest";
import { getProjectPlanningTools } from "./strapi";
import { parsePlanningTool } from "./planningToolValidation";

const tool = { name: "Agile", type: ["User-Centric"], time: ["Short-term"], image: "/assets/agile.png",
  learning_obj: [{ text: "Learn", sub_bullets: [{ text: "Nested", sub_bullets: [] }] }],
  characteristics: [], process: [], benefits: [], drawbacks: [], example: [], resources: [], evaluation: [] };
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe("planning tools", () => {
  it("loads every page in CMS order without duplicating /api", async () => {
    vi.stubEnv("VITE_STRAPI_URL", "https://cms.example/api/");
    const fetcher = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ data: [tool], meta: { pagination: { pageCount: 2 } } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [{ ...tool, name: "Lean" }], meta: { pagination: { pageCount: 2 } } }) });
    vi.stubGlobal("fetch", fetcher);
    const signal = new AbortController().signal;
    expect((await getProjectPlanningTools(signal)).map((item) => item.name)).toEqual(["Agile", "Lean"]);
    const url = new URL(fetcher.mock.calls[1][0]);
    expect(url.pathname).toBe("/api/project-planning-tools");
    expect(url.searchParams.get("pagination[page]")).toBe("2");
    expect(fetcher.mock.calls[0][1].signal).toBe(signal);
  });
  it("reports failed requests", async () => {
    vi.stubEnv("VITE_STRAPI_URL", "https://cms.example");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(getProjectPlanningTools()).rejects.toThrow("403");
  });
  it("preserves nested content and rejects malformed bullets", () => {
    expect(parsePlanningTool(tool)).toEqual(tool);
    expect(() => parsePlanningTool({ ...tool, process: [{ text: "Bad", sub_bullets: null }] })).toThrow();
  });
  it("handles an empty published collection", async () => {
    vi.stubEnv("VITE_STRAPI_URL", "https://cms.example");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [], meta: { pagination: { pageCount: 0 } } }) }));
    expect(await getProjectPlanningTools()).toEqual([]);
  });
});
