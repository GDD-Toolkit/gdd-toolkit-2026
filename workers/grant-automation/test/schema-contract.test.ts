// Proves the Drizzle tables and the shared zod schemas describe the same shape,
// so a change to one without the other fails here instead of in production.
import { getTableColumns } from "drizzle-orm";
import { getTableConfig, PgDialect } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import {
  CURATIONS,
  DEADLINE_TYPES,
  FIELD_TYPES,
  FUNDING_TYPES,
  GRANT_STATUSES,
  GrantCore,
  GrantFieldDef,
  GrantSource,
  IngestRun,
  RUN_STATUSES,
} from "../../../shared/types/Grants.js";
import { grantFieldDefs, grantRaw, grants, grantSources, ingestRuns } from "../src/db/schema.js";
import { grantToRow } from "../src/db/rows.js";
import { sampleGrant } from "./fixtures/sample-grant.js";

const columnNames = (table: Parameters<typeof getTableColumns>[0]) =>
  Object.values(getTableColumns(table))
    .map((c) => c.name)
    .sort();
const keys = (shape: object) => Object.keys(shape).sort();

describe("grants schema ↔ shared types", () => {
  it("every table property is named after its column (snake_case, no renaming layer)", () => {
    for (const table of [grants, grantSources, grantFieldDefs, ingestRuns, grantRaw]) {
      for (const [prop, column] of Object.entries(getTableColumns(table))) {
        expect(prop).toBe(column.name);
      }
    }
  });

  it("grants.grants = GrantCore keys + data + search", () => {
    expect(columnNames(grants)).toEqual([...keys(GrantCore.shape), "data", "search"].sort());
  });

  it("grant_sources = GrantSource keys", () => {
    expect(columnNames(grantSources)).toEqual(keys(GrantSource.shape));
  });

  it("grant_field_defs = GrantFieldDef keys + created_at", () => {
    expect(columnNames(grantFieldDefs)).toEqual([...keys(GrantFieldDef.shape), "created_at"].sort());
  });

  it("ingest_runs = IngestRun keys", () => {
    expect(columnNames(ingestRuns)).toEqual(keys(IngestRun.shape));
  });

  it("CHECK constraints list exactly the shared vocabularies", () => {
    const dialect = new PgDialect();
    const rendered = (table: Parameters<typeof getTableConfig>[0]) =>
      Object.fromEntries(getTableConfig(table).checks.map((c) => [c.name, dialect.sqlToQuery(c.value).sql]));
    const grantChecks = rendered(grants);
    const expectList = (sqlText: string | undefined, column: string, values: readonly string[]) =>
      expect(sqlText).toBe(`${column} in (${values.map((v) => `'${v}'`).join(", ")})`);
    expectList(grantChecks["grants_status_chk"], "status", GRANT_STATUSES);
    expectList(grantChecks["grants_curation_chk"], "curation", CURATIONS);
    expectList(grantChecks["grants_funding_type_chk"], "funding_type", FUNDING_TYPES);
    expectList(grantChecks["grants_deadline_type_chk"], "deadline_type", DEADLINE_TYPES);
    expectList(rendered(grantFieldDefs)["grant_field_defs_type_chk"], "type", FIELD_TYPES);
    expectList(rendered(ingestRuns)["ingest_runs_status_chk"], "status", RUN_STATUSES);
  });

  it("grantToRow keeps the record whole in data and fills every column", () => {
    const row = grantToRow(sampleGrant);
    expect(row.data).toBe(sampleGrant);
    expect(row.first_seen_at).toBeInstanceOf(Date);
    expect(row.posted_at?.toISOString()).toBe(sampleGrant.posted_at);
    expect(Object.keys(row).sort()).toEqual([...keys(GrantCore.shape), "data"].sort());
  });
});
