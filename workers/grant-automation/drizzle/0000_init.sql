-- IF NOT EXISTS added by hand: scripts/bootstrap.ts creates the schema (owned by
-- grants_owner) before the first migration, and drizzle's migrator creates it
-- for its own bookkeeping table as well.
CREATE SCHEMA IF NOT EXISTS "grants";
--> statement-breakpoint
CREATE TABLE "grants"."grant_field_defs" (
	"key" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"type" text NOT NULL,
	"options" jsonb,
	"filterable" boolean DEFAULT false NOT NULL,
	"facet" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"sources" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "grant_field_defs_type_chk" CHECK (type in ('string', 'number', 'date', 'enum', 'list', 'url', 'money'))
);
--> statement-breakpoint
CREATE TABLE "grants"."grant_raw" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" text NOT NULL,
	"external_id" text NOT NULL,
	"run_id" uuid NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"payload" jsonb NOT NULL,
	"content_hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grants"."grant_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"adapter" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"license_note" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"last_run_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "grants"."grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" text NOT NULL,
	"external_id" text NOT NULL,
	"title" text NOT NULL,
	"funder" text DEFAULT '' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"url" text NOT NULL,
	"apply_url" text,
	"funding_type" text DEFAULT 'grant' NOT NULL,
	"amount_min" bigint,
	"amount_max" bigint,
	"currency" char(3) DEFAULT 'USD' NOT NULL,
	"deadline" date,
	"deadline_type" text DEFAULT 'unknown' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"posted_at" timestamp with time zone,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_verified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"geographies" text[] DEFAULT '{}'::text[] NOT NULL,
	"sdgs" smallint[] DEFAULT '{}'::smallint[] NOT NULL,
	"values" text[] DEFAULT '{}'::text[] NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"curation" text DEFAULT 'auto' NOT NULL,
	"data" jsonb NOT NULL,
	"search" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', title), 'A') || setweight(to_tsvector('english', funder), 'B') || setweight(to_tsvector('english', summary), 'C')) STORED,
	"content_hash" text NOT NULL,
	"schema_version" smallint DEFAULT 1 NOT NULL,
	CONSTRAINT "grants_status_chk" CHECK (status in ('open', 'closing_soon', 'rolling', 'forecasted', 'closed', 'archived')),
	CONSTRAINT "grants_curation_chk" CHECK (curation in ('auto', 'reviewed', 'featured', 'hidden')),
	CONSTRAINT "grants_funding_type_chk" CHECK (funding_type in ('grant', 'fellowship', 'scholarship', 'prize', 'cooperative_agreement', 'other')),
	CONSTRAINT "grants_deadline_type_chk" CHECK (deadline_type in ('fixed', 'rolling', 'multiple', 'unknown'))
);
--> statement-breakpoint
CREATE TABLE "grants"."ingest_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"status" text DEFAULT 'running' NOT NULL,
	"stats" jsonb DEFAULT '{"fetched":0,"relevant":0,"inserted":0,"updated":0,"unchanged":0,"closed":0}'::jsonb NOT NULL,
	"error" text,
	CONSTRAINT "ingest_runs_status_chk" CHECK (status in ('running', 'ok', 'failed'))
);
--> statement-breakpoint
ALTER TABLE "grants"."grant_raw" ADD CONSTRAINT "grant_raw_source_id_grant_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "grants"."grant_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grants"."grant_raw" ADD CONSTRAINT "grant_raw_run_id_ingest_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "grants"."ingest_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grants"."grants" ADD CONSTRAINT "grants_source_id_grant_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "grants"."grant_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grants"."ingest_runs" ADD CONSTRAINT "ingest_runs_source_id_grant_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "grants"."grant_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "grant_raw_source_external_hash_uq" ON "grants"."grant_raw" USING btree ("source_id","external_id","content_hash");--> statement-breakpoint
CREATE INDEX "grant_raw_source_external_idx" ON "grants"."grant_raw" USING btree ("source_id","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "grants_source_external_uq" ON "grants"."grants" USING btree ("source_id","external_id");--> statement-breakpoint
CREATE INDEX "grants_deadline_idx" ON "grants"."grants" USING btree ("deadline");--> statement-breakpoint
CREATE INDEX "grants_status_idx" ON "grants"."grants" USING btree ("status");--> statement-breakpoint
CREATE INDEX "grants_amount_max_idx" ON "grants"."grants" USING btree ("amount_max");--> statement-breakpoint
CREATE INDEX "grants_last_seen_at_idx" ON "grants"."grants" USING btree ("last_seen_at");--> statement-breakpoint
CREATE INDEX "grants_geographies_gin" ON "grants"."grants" USING gin ("geographies");--> statement-breakpoint
CREATE INDEX "grants_sdgs_gin" ON "grants"."grants" USING gin ("sdgs");--> statement-breakpoint
CREATE INDEX "grants_values_gin" ON "grants"."grants" USING gin ("values");--> statement-breakpoint
CREATE INDEX "grants_tags_gin" ON "grants"."grants" USING gin ("tags");--> statement-breakpoint
CREATE INDEX "grants_search_gin" ON "grants"."grants" USING gin ("search");--> statement-breakpoint
CREATE INDEX "grants_data_gin" ON "grants"."grants" USING gin ("data" jsonb_path_ops);--> statement-breakpoint
CREATE INDEX "ingest_runs_source_started_idx" ON "grants"."ingest_runs" USING btree ("source_id","started_at" DESC NULLS LAST);