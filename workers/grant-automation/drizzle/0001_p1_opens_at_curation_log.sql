CREATE TABLE "grants"."curation_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grant_id" uuid NOT NULL,
	"user_id" integer NOT NULL,
	"from_curation" text NOT NULL,
	"to_curation" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "grants"."grants" ADD COLUMN "opens_at" date;--> statement-breakpoint
ALTER TABLE "grants"."curation_log" ADD CONSTRAINT "curation_log_grant_id_grants_id_fk" FOREIGN KEY ("grant_id") REFERENCES "grants"."grants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "curation_log_grant_idx" ON "grants"."curation_log" USING btree ("grant_id","at" DESC NULLS LAST);