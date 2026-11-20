import { describe, expect, it } from "vitest";
import { Grant, GrantCore, GRANTS_SCHEMA_VERSION } from "../../../shared/types/Grants.js";
import { sampleGrant } from "./fixtures/sample-grant.js";

describe("shared Grant schema", () => {
  it("accepts a complete record unchanged", () => {
    expect(Grant.parse(sampleGrant)).toEqual(sampleGrant);
  });

  it("carries the current schema version", () => {
    expect(sampleGrant.schema_version).toBe(GRANTS_SCHEMA_VERSION);
    expect(GrantCore.safeParse({ ...withoutExtras(sampleGrant), schema_version: 99 }).success).toBe(false);
  });

  it("rejects unknown core keys (the core is strict)", () => {
    expect(GrantCore.safeParse({ ...withoutExtras(sampleGrant), bogus: 1 }).success).toBe(false);
  });

  it("rejects values outside the vocabularies", () => {
    expect(Grant.safeParse({ ...sampleGrant, status: "maybe" }).success).toBe(false);
    expect(Grant.safeParse({ ...sampleGrant, values: ["Kindness"] }).success).toBe(false);
    expect(Grant.safeParse({ ...sampleGrant, sdgs: [18] }).success).toBe(false);
    expect(Grant.safeParse({ ...sampleGrant, deadline: "31/03/2027" }).success).toBe(false);
    expect(Grant.safeParse({ ...sampleGrant, url: "not a url" }).success).toBe(false);
  });

  it("allows every extras value kind the field registry can describe", () => {
    const extras = { s: "x", n: 1, b: true, nil: null, list: ["a"], money: { amount: 1, currency: "EUR" } };
    expect(Grant.safeParse({ ...sampleGrant, extras }).success).toBe(true);
    expect(Grant.safeParse({ ...sampleGrant, extras: { nested: { deep: 1 } } }).success).toBe(false);
  });
});

function withoutExtras(grant: Grant) {
  const { extras, ...core } = grant;
  void extras;
  return core;
}
