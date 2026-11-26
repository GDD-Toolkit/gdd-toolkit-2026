import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import {
  grantQueryFromSearchParams,
  grantQueryToSearchParams,
  type GrantQueryInput,
} from "@shared/types/GrantsApi";
import { GrantsApiError, getGrant, getGrants, getGrantsByIds, setCuration } from "@/api/grants";
import { sampleDetail, sampleGrant } from "@/test/fixtures/grant";

const fetchMock = vi.fn();

function respond(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.stubEnv("VITE_GRANTS_API_URL", "http://api.test/");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});

describe("shared query helpers", () => {
  it("round-trips a query through search params", () => {
    const query: GrantQueryInput = {
      q: "water",
      status: ["open", "forecasted"],
      sdg: [1, 16],
      geography: ["philippines_sea"],
      amount_max: 50000,
      extras: { agency_code: "EXAMPLE" },
      sort: "-amount_max",
      page: 2,
    };
    const params = grantQueryToSearchParams(query);
    expect(params.getAll("sdg")).toEqual(["1", "16"]);
    expect(params.get("extras[agency_code]")).toBe("EXAMPLE");
    expect(grantQueryFromSearchParams(params)).toEqual({ ...query, pageSize: 24 });
  });

  it("drops invalid values and ignores the grant deep-link param", () => {
    const params = new URLSearchParams("sdg=99&sort=bogus&grant=abc&q=health");
    expect(grantQueryFromSearchParams(params)).toEqual({ q: "health", page: 1, pageSize: 24 });
  });
});

describe("getGrants", () => {
  it("builds the URL from the query and validates the response", async () => {
    fetchMock.mockResolvedValue(respond(200, { data: [sampleGrant], meta: { total: 1, page: 1, pageSize: 24 } }));

    const result = await getGrants({ sdg: [6], q: "water" });

    expect(fetchMock).toHaveBeenCalledWith("http://api.test/grants?sdg=6&q=water", undefined);
    expect(result.data[0]?.title).toBe(sampleGrant.title);
    expect(result.meta.total).toBe(1);
  });

  it("rejects a response the page would not understand", async () => {
    fetchMock.mockResolvedValue(respond(200, { data: [{ id: "nope" }], meta: { total: 1, page: 1, pageSize: 24 } }));

    await expect(getGrants({})).rejects.toBeInstanceOf(ZodError);
  });

  it("maps an API error body to GrantsApiError", async () => {
    fetchMock.mockResolvedValue(respond(404, { error: { status: 404, message: "Grant not found" } }));

    const error = await getGrant("0f6c9a2e-5c1b-4f0e-9d5a-2b7e1c3d4a5b").catch((cause: unknown) => cause);

    expect(error).toBeInstanceOf(GrantsApiError);
    expect((error as GrantsApiError).status).toBe(404);
    expect((error as GrantsApiError).message).toBe("Grant not found");
  });

  it("treats a 200 that is not JSON (the site's index.html) as the API being unavailable", async () => {
    fetchMock.mockResolvedValue(
      new Response("<!doctype html><html></html>", { status: 200, headers: { "Content-Type": "text/html" } }),
    );

    const error = await getGrants({}).catch((cause: unknown) => cause);

    expect(error).toBeInstanceOf(GrantsApiError);
    expect((error as GrantsApiError).message).toBe("The grants API did not respond.");
  });

  it("falls back to the HTTP status when the error body is not ours", async () => {
    fetchMock.mockResolvedValue(new Response("<html>bad gateway</html>", { status: 502, statusText: "Bad Gateway" }));

    await expect(getGrants({})).rejects.toMatchObject({ status: 502 });
  });
});

describe("getGrantsByIds", () => {
  it("asks for exactly those ids and returns the rows", async () => {
    fetchMock.mockResolvedValue(respond(200, { data: [sampleGrant], meta: { total: 1, page: 1, pageSize: 100 } }));

    const found = await getGrantsByIds([sampleGrant.id, sampleGrant.id]);

    const url = new URL(fetchMock.mock.calls[0]?.[0] as string);
    expect(url.searchParams.getAll("ids")).toEqual([sampleGrant.id]);
    expect(url.searchParams.get("pageSize")).toBe("100");
    expect(found).toHaveLength(1);
  });

  it("skips the request for an empty list", async () => {
    expect(await getGrantsByIds([])).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("setCuration", () => {
  it("sends a PATCH with the Strapi JWT and returns the updated grant", async () => {
    fetchMock.mockResolvedValue(respond(200, { ...sampleDetail, curation: "featured" }));

    const updated = await setCuration(sampleGrant.id, "featured", "jwt-1");

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`http://api.test/grants/${sampleGrant.id}/curation`);
    expect(init.method).toBe("PATCH");
    expect(init.headers).toMatchObject({ Authorization: "Bearer jwt-1" });
    expect(JSON.parse(init.body as string)).toEqual({ curation: "featured" });
    expect(updated.curation).toBe("featured");
  });
});
