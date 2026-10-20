import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AuthApiError,
  forgotPassword,
  login,
  register,
  resetPassword,
  strapiApiBase,
} from "@/api/auth";

function jsonResponse(
  body: unknown,
  init: { ok?: boolean; status?: number; statusText?: string } = {},
): Response {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: init.statusText ?? "OK",
    json: async () => body,
  } as Response;
}

const fetchMock = vi.fn<typeof fetch>();

function lastRequest() {
  const [url, init] = fetchMock.mock.calls.at(-1)!;
  const options = (init ?? {}) as RequestInit;
  return {
    url: String(url),
    method: options.method,
    body: options.body ? JSON.parse(String(options.body)) : undefined,
  };
}

beforeEach(() => {
  vi.stubEnv("VITE_STRAPI_URL", "http://cms.test");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});

describe("strapiApiBase", () => {
  it("appends /api and drops a trailing slash", () => {
    vi.stubEnv("VITE_STRAPI_URL", "http://cms.test/");
    expect(strapiApiBase()).toBe("http://cms.test/api");
  });

  it("keeps a base that already ends in /api", () => {
    vi.stubEnv("VITE_STRAPI_URL", "http://cms.test/api");
    expect(strapiApiBase()).toBe("http://cms.test/api");
  });
});

describe("request errors", () => {
  it("surfaces Strapi's error message and status", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { error: { message: "Invalid identifier or password", details: {} } },
        { ok: false, status: 400, statusText: "Bad Request" },
      ),
    );
    const error = await login({ identifier: "ada@example.com", password: "x" }).catch((e) => e);
    expect(error).toBeInstanceOf(AuthApiError);
    expect(error.status).toBe(400);
    expect(error.message).toBe("Invalid identifier or password");
  });

  it("falls back to the HTTP status when the body is not JSON", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      json: async () => {
        throw new Error("not json");
      },
    } as unknown as Response);
    await expect(login({ identifier: "ada@example.com", password: "x" })).rejects.toMatchObject({
      status: 502,
      message: "Request failed: 502 Bad Gateway",
    });
  });
});

describe("register", () => {
  it("normalises the email, mirrors it as the username and trims profile fields", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ user: { id: 1 } }));
    await register({
      email: "  Ada@Example.COM ",
      password: "secret123",
      firstName: " Ada ",
      lastName: "Lovelace ",
      institution: " UMD",
    });
    const { url, method, body } = lastRequest();
    expect(url).toBe("http://cms.test/api/auth/local/register");
    expect(method).toBe("POST");
    expect(body).toEqual({
      username: "ada@example.com",
      email: "ada@example.com",
      password: "secret123",
      firstName: "Ada",
      lastName: "Lovelace",
      institution: "UMD",
    });
  });
});

describe("password reset", () => {
  it("sends the lower-cased email to forgot-password", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    await forgotPassword(" Ada@Example.com ");
    const { url, method, body } = lastRequest();
    expect(url).toBe("http://cms.test/api/auth/forgot-password");
    expect(method).toBe("POST");
    expect(body).toEqual({ email: "ada@example.com" });
  });

  it("posts the code with both passwords and returns the new session", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ jwt: "jwt-1", user: { id: 1 } }));
    const result = await resetPassword("code-1", "newpass123", "newpass123");
    const { url, body } = lastRequest();
    expect(url).toBe("http://cms.test/api/auth/reset-password");
    expect(body).toEqual({ code: "code-1", password: "newpass123", passwordConfirmation: "newpass123" });
    expect(result.jwt).toBe("jwt-1");
  });
});
